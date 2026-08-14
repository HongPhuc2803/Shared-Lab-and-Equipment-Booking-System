<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { bookingsApi } from '@/features/bookings/bookings.api'
import { resourcesApi } from '@/features/resources/resources.api'
import type { Resource } from '@/features/resources/resources.types'
import type {
  AvailabilitySlot,
  BookingConflictResponse,
} from '@/features/bookings/bookings.types'

const route = useRoute()
const router = useRouter()

const resources = ref<Resource[]>([])
const selectedResourceId = ref(String(route.query.resource ?? ''))

const start = ref(String(route.query.start ?? '2026-08-13T09:00'))
const end = ref(String(route.query.end ?? '2026-08-13T11:00'))
const purpose = ref('Đề tài nghiên cứu')
const notes = ref('')

const loadingResources = ref(false)
const checking = ref(false)
const submitting = ref(false)
const conflict = ref(false)
const submitted = ref(false)
const errorMessage = ref('')

const conflictResult = ref<BookingConflictResponse | null>(null)

const selectedResource = computed(() =>
  resources.value.find((r) => r.id === selectedResourceId.value),
)

async function loadResources() {
  loadingResources.value = true
  errorMessage.value = ''

  try {
    const response = await resourcesApi.list({
      page: 1,
      pageSize: 100,
    })

    resources.value = response.items

    if (
      !selectedResourceId.value ||
      !resources.value.some((r) => r.id === selectedResourceId.value)
    ) {
      selectedResourceId.value = resources.value[0]?.id ?? ''
    }
  } catch (error) {
    console.error('LOAD RESOURCES ERROR:', error)
    errorMessage.value = 'Không thể tải danh sách phòng / thiết bị.'
  } finally {
    loadingResources.value = false
  }
}

function toApiDateTime(value: string) {
  return new Date(value).toISOString()
}

let checkTimer: ReturnType<typeof setTimeout> | undefined

watch([selectedResourceId, start, end], () => {
  if (checkTimer) clearTimeout(checkTimer)

  if (!selectedResourceId.value || !start.value || !end.value) {
    return
  }

  checkTimer = setTimeout(() => {
    checkConflict()
  }, 500)
})

async function checkConflict() {
  if (!selectedResourceId.value || !start.value || !end.value) {
    return
  }

  checking.value = true
  errorMessage.value = ''

  try {
    const result = await bookingsApi.checkConflict({
      resourceId: selectedResourceId.value,
      startTime: toApiDateTime(start.value),
      endTime: toApiDateTime(end.value),
    })

    conflictResult.value = result
    conflict.value = result.hasConflict
  } catch (error) {
    console.error('CHECK BOOKING CONFLICT ERROR:', error)
    errorMessage.value = 'Không thể kiểm tra xung đột lịch.'
  } finally {
    checking.value = false
  }
}

async function submit() {
  if (
    !selectedResourceId.value ||
    conflict.value ||
    checking.value ||
    submitting.value
  ) {
    return
  }

  submitting.value = true
  errorMessage.value = ''

  try {
    await bookingsApi.create({
      resourceId: selectedResourceId.value,
      startTime: toApiDateTime(start.value),
      endTime: toApiDateTime(end.value),
      purpose: notes.value.trim()
        ? `${purpose.value} - ${notes.value.trim()}`
        : purpose.value,
      priorityRuleId: null,
    })

    submitted.value = true

    setTimeout(() => {
      router.push('/my-bookings')
    }, 800)
  } catch (error) {
    console.error('CREATE BOOKING ERROR:', error)
    errorMessage.value = 'Không thể gửi yêu cầu đặt lịch.'
  } finally {
    submitting.value = false
  }
}

function choose(slot: AvailabilitySlot) {
  start.value = slot.startTime.slice(0, 16)
  end.value = slot.endTime.slice(0, 16)

  conflict.value = false
  conflictResult.value = null
}

function formatSuggestionDate(date: string) {
  return new Date(date).toLocaleDateString('vi-VN')
}

function formatSuggestionTime(date: string) {
  return new Date(date).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(async () => {
  await loadResources()

  if (selectedResourceId.value) {
    await checkConflict()
  }
})
</script>

<template>
  <form class="panel booking-form" @submit.prevent="submit">
    <div class="panel-header">
      <h2>Thông tin yêu cầu</h2>
      <span class="badge badge-blue">Yêu cầu mới</span>
    </div>

    <div class="panel-body form-grid">
      <div class="field span-2">
        <label>Phòng / Thiết bị</label>

        <select
          v-model="selectedResourceId"
          class="select"
          :disabled="loadingResources"
          required
        >
          <option value="" disabled>
            {{ loadingResources ? 'Đang tải...' : 'Chọn phòng / thiết bị' }}
          </option>

          <option
            v-for="resource in resources"
            :key="resource.id"
            :value="resource.id"
          >
            {{ resource.name }}
          </option>
        </select>

        <small v-if="selectedResource" class="resource-info">
          {{ selectedResource.type }} ·
          {{ selectedResource.departmentName }} ·
          {{ selectedResource.status }}
        </small>
      </div>

      <div class="field">
        <label>Ngày giờ bắt đầu</label>

        <input
          v-model="start"
          class="input"
          type="datetime-local"
          required
        />
      </div>

      <div class="field">
        <label>Ngày giờ kết thúc</label>

        <input
          v-model="end"
          class="input"
          type="datetime-local"
          required
        />
      </div>

      <div class="field span-2">
        <label>Mục đích sử dụng</label>

        <select v-model="purpose" class="select">
          <option>Đề tài nghiên cứu</option>
          <option>Đồ án tốt nghiệp</option>
          <option>Bài tập môn học</option>
          <option>Tự học</option>
        </select>
      </div>

      <div class="field span-2">
        <label>Ghi chú chi tiết</label>

        <textarea
          v-model="notes"
          class="textarea"
          placeholder="Mô tả nội dung công việc, số người tham gia..."
        ></textarea>
      </div>

      <div class="span-2">
        <div v-if="checking" class="notice">
          Đang kiểm tra xung đột lịch...
        </div>

        <div v-else-if="conflict" class="notice notice-danger">
          <strong>Xung đột lịch xảy ra.</strong>
          Khung giờ này đã có người đặt hoặc đang bảo trì.
        </div>

        <div
          v-else-if="selectedResourceId && !errorMessage"
          class="notice notice-success"
        >
          <strong>Khung giờ khả dụng.</strong>
          Không phát hiện trùng lịch.
        </div>
      </div>

      <div
        v-if="conflict && conflictResult?.suggestedSlots.length"
        class="suggestions span-2"
      >
        <button
          v-for="slot in conflictResult.suggestedSlots"
          :key="`${slot.startTime}-${slot.endTime}`"
          type="button"
          @click="choose(slot)"
        >
          <strong>{{ formatSuggestionDate(slot.startTime) }}</strong>

          <span>
            {{ formatSuggestionTime(slot.startTime) }}
            -
            {{ formatSuggestionTime(slot.endTime) }}
          </span>
        </button>
      </div>

      <div
        v-if="errorMessage"
        class="notice notice-danger span-2"
      >
        {{ errorMessage }}
      </div>

      <div
        v-if="submitted"
        class="notice notice-success span-2"
      >
        Đã gửi yêu cầu. Đang chuyển đến danh sách đặt lịch...
      </div>
    </div>

    <div class="form-actions">
      <button
        type="button"
        class="btn"
        @click="router.back()"
      >
        Hủy
      </button>

      <button
        class="btn btn-primary"
        :disabled="
          loadingResources ||
          checking ||
          conflict ||
          submitting ||
          !selectedResourceId
        "
      >
        {{ submitting ? 'Đang gửi...' : 'Gửi yêu cầu' }}
      </button>
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

.resource-info {
  display: block;
  margin-top: 6px;
  color: #758094;
  font-size: 10px;
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
