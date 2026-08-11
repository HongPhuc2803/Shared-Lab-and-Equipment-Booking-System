<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { resources } from '@/data/mock'
const route = useRoute(),
  router = useRouter()
const resource = computed(
  () => resources.find((r) => r.id === Number(route.query.resource)) ?? resources[0],
)
const start = ref(String(route.query.start ?? '2026-08-05T09:00')),
  end = ref(String(route.query.end ?? '2026-08-05T11:00')),
  purpose = ref('Đề tài nghiên cứu'),
  notes = ref(''),
  checking = ref(false),
  conflict = ref(false),
  submitted = ref(false)
watch([start, end], () => {
  checking.value = true
  setTimeout(() => {
    conflict.value = start.value.includes('13:')
    checking.value = false
  }, 450)
})
function submit() {
  submitted.value = true
  setTimeout(() => router.push('/my-bookings'), 1000)
}
function choose(s: string, e: string) {
  start.value = s
  end.value = e
  conflict.value = false
}
</script>
<template>
  <form class="panel booking-form" @submit.prevent="submit">
    <div class="panel-header">
      <h2>Thông tin yêu cầu</h2>
      <span class="badge badge-blue">Yêu cầu mới</span>
    </div>
    <div class="panel-body form-grid">
      <div class="field span-2">
        <label>Phòng / Thiết bị</label><input class="input" :value="resource.name" readonly />
      </div>
      <div class="field">
        <label>Ngày giờ bắt đầu</label
        ><input v-model="start" class="input" type="datetime-local" required />
      </div>
      <div class="field">
        <label>Ngày giờ kết thúc</label
        ><input v-model="end" class="input" type="datetime-local" required />
      </div>
      <div class="field span-2">
        <label>Mục đích sử dụng</label
        ><select v-model="purpose" class="select">
          <option>Đề tài nghiên cứu</option>
          <option>Đồ án tốt nghiệp</option>
          <option>Bài tập môn học</option>
          <option>Tự học</option>
        </select>
      </div>
      <div class="field span-2">
        <label>Ghi chú chi tiết</label
        ><textarea
          v-model="notes"
          class="textarea"
          placeholder="Mô tả nội dung công việc, số người tham gia..."
        ></textarea>
      </div>
      <div class="span-2">
        <div v-if="checking" class="notice">Đang kiểm tra xung đột lịch...</div>
        <div v-else-if="conflict" class="notice notice-danger">
          <strong>Xung đột lịch xảy ra.</strong> Khung giờ này đã có người đặt. Hãy chọn một gợi ý
          bên dưới.
        </div>
        <div v-else class="notice notice-success">
          <strong>Khung giờ khả dụng.</strong> Không phát hiện trùng lịch với booking khác.
        </div>
      </div>
      <div v-if="conflict" class="suggestions span-2">
        <button type="button" @click="choose('2026-08-05T15:00', '2026-08-05T17:00')">
          <strong>Hôm nay</strong><span>15:00 - 17:00</span></button
        ><button type="button" @click="choose('2026-08-06T09:00', '2026-08-06T11:00')">
          <strong>Ngày mai</strong><span>09:00 - 11:00</span></button
        ><button type="button" @click="choose('2026-08-07T08:00', '2026-08-07T10:00')">
          <strong>Thứ Sáu</strong><span>08:00 - 10:00</span>
        </button>
      </div>
      <div v-if="submitted" class="notice notice-success span-2">
        Đã gửi yêu cầu. Đang chuyển đến danh sách đặt lịch...
      </div>
    </div>
    <div class="form-actions">
      <button type="button" class="btn" @click="router.back()">Hủy</button
      ><button class="btn btn-primary" :disabled="checking || conflict">Gửi yêu cầu</button>
    </div>
  </form>
</template>
<style scoped>
.booking-form {
  max-width: 850px;
  margin: auto;
}
.form-actions {
  padding: 16px 19px;
  border-top: 1px solid #e7eaf0;
  display: flex;
  justify-content: flex-end;
  gap: 9px;
}
.suggestions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
}
.suggestions button {
  border: 1px solid #dfe4ec;
  background: #fff;
  border-radius: 6px;
  padding: 12px;
  text-align: left;
  cursor: pointer;
}
.suggestions button:hover {
  border-color: #3157d5;
}
.suggestions strong,
.suggestions span {
  display: block;
  font-size: 11px;
}
.suggestions span {
  margin-top: 4px;
  color: #3157d5;
  font-weight: 700;
}
@media (max-width: 650px) {
  .suggestions {
    grid-template-columns: 1fr;
  }
}
</style>
