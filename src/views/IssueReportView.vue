<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { bookingsApi } from '@/features/bookings/bookings.api'
import { http, unwrapApiResponse } from '@/lib/api/http'

const route = useRoute()
const router = useRouter()

const booking = ref<any>(null)
const loading = ref(true)
const submitting = ref(false)
const errorMessage = ref('')
const done = ref(false)

const incidentType = ref('Hỏng thiết bị')
const severity = ref('Trung bình')
const description = ref('')

async function loadBooking() {
  loading.value = true
  errorMessage.value = ''
  try {
    booking.value = await bookingsApi.getById(route.params.id as string)
  } catch (err) {
    console.error('LOAD BOOKING FOR INCIDENT ERROR:', err)
    errorMessage.value = 'Không thể tải thông tin lịch đặt.'
  } finally {
    loading.value = false
  }
}

async function submit() {
  if (!booking.value || submitting.value) return

  submitting.value = true
  errorMessage.value = ''
  try {
    const payload = {
      resourceId: booking.value.resourceId,
      bookingId: booking.value.id,
      description: `[${incidentType.value}][Mức độ: ${severity.value}] - ${description.value.trim()}`,
      imageUrl: null, // Backend does not support file upload, only string URL.
    }
    const response = await http.post('/Incidents', payload)
    unwrapApiResponse(response.data)
    
    done.value = true
    setTimeout(() => router.push('/my-bookings'), 1100)
  } catch (err: any) {
    console.error('SUBMIT INCIDENT ERROR:', err)
    errorMessage.value = err.message || 'Không thể gửi báo cáo sự cố.'
  } finally {
    submitting.value = false
  }
}

onMounted(loadBooking)
</script>

<template>
  <div v-if="loading" class="notice text-center" style="margin: 40px;">
    Đang tải thông tin lịch đặt...
  </div>
  <div v-else-if="errorMessage && !booking" class="notice notice-danger" style="margin: 40px;">
    {{ errorMessage }}
  </div>
  <form v-else class="panel issue-form" @submit.prevent="submit">
    <div class="panel-header">
      <h2>Phiếu báo cáo sự cố</h2>
      <span class="badge badge-red">Mã lịch đặt: {{ booking?.id.slice(0, 8) }}</span>
    </div>
    <div class="panel-body form-grid">
      <div class="field">
        <label>Tài nguyên gặp sự cố</label>
        <input class="input" type="text" readonly :value="booking?.resourceName" />
      </div>
      <div class="field">
        <label>Người báo cáo</label>
        <input class="input" type="text" readonly :value="booking?.requesterName" />
      </div>
      <div class="field">
        <label>Loại sự cố</label>
        <select v-model="incidentType" class="select">
          <option>Hỏng thiết bị</option>
          <option>Thiếu linh kiện</option>
          <option>Lỗi phần mềm</option>
          <option>Vấn đề an toàn</option>
        </select>
      </div>
      <div class="field">
        <label>Mức độ</label>
        <select v-model="severity" class="select">
          <option>Thấp</option>
          <option>Trung bình</option>
          <option>Nghiêm trọng</option>
        </select>
      </div>
      <div class="field span-2">
        <label>Mô tả chi tiết</label>
        <textarea
          v-model="description"
          class="textarea"
          required
          placeholder="Mô tả hiện tượng, thời điểm phát hiện và thao tác đã thực hiện..."
        ></textarea>
      </div>
      
      <div v-if="errorMessage" class="notice notice-danger span-2">
        {{ errorMessage }}
      </div>
      <div v-if="done" class="notice notice-success span-2">
        Báo cáo đã được gửi đến quản lý phòng lab. Đang chuyển hướng...
      </div>
    </div>
    <div class="form-actions">
      <button type="button" class="btn" :disabled="submitting" @click="router.back()">Hủy</button>
      <button class="btn btn-primary" :disabled="submitting">
        {{ submitting ? 'Đang gửi...' : 'Gửi báo cáo' }}
      </button>
    </div>
  </form>
</template>
<style scoped>
.issue-form {
  max-width: 800px;
  margin: auto;
}
.upload {
  border: 1px dashed #aeb8c8;
  border-radius: 6px;
  padding: 27px;
  text-align: center;
  cursor: pointer;
  background: #fafbfc;
}
.upload input {
  display: none;
}
.upload strong,
.upload span {
  display: block;
  font-size: 11px;
}
.upload strong {
  color: #3157d5;
}
.upload span {
  margin-top: 6px;
  color: #929aa8;
}
.file-list {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
}
.file-list span {
  background: #edf1f7;
  padding: 6px 9px;
  font-size: 10px;
  border-radius: 4px;
}
.form-actions {
  padding: 16px 19px;
  border-top: 1px solid #e7eaf0;
  display: flex;
  justify-content: flex-end;
  gap: 9px;
}
</style>
