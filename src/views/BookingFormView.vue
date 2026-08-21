<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { bookingsApi } from '@/features/bookings/bookings.api'
import { resourcesApi } from '@/features/resources/resources.api'
import { priorityRulesApi } from '@/features/priority-rules/priority-rules.api'
import type { Resource } from '@/features/resources/resources.types'
import type { PriorityRule } from '@/features/priority-rules/priority-rules.types'
import type {
  AvailabilitySlot,
  BookingConflictResponse,
} from '@/features/bookings/bookings.types'

const route = useRoute()
const router = useRouter()

const resources = ref<Resource[]>([])
const priorityRules = ref<PriorityRule[]>([])
const selectedResourceId = ref(String(route.query.resource ?? ''))

function formatLocalInput(date: Date) {
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

function defaultBookingRange() {
  const startDate = new Date()
  startDate.setSeconds(0, 0)
  startDate.setMinutes(0)
  startDate.setHours(startDate.getHours() + 1)

  const endDate = new Date(startDate)
  endDate.setHours(endDate.getHours() + 1)

  return { start: formatLocalInput(startDate), end: formatLocalInput(endDate) }
}

const defaultRange = defaultBookingRange()
const start = ref(String(route.query.start ?? defaultRange.start))
const end = ref(String(route.query.end ?? defaultRange.end))
const priorityRuleId = ref('')
const purpose = ref('')

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

const minDateTime = computed(() => formatLocalInput(new Date()))

const timeValidationError = computed(() => {
  const startDate = new Date(start.value)
  const endDate = new Date(end.value)

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return 'Thời gian không hợp lệ.'
  }
  if (startDate.getTime() < Date.now()) return 'Giờ bắt đầu phải ở tương lai.'
  if (endDate <= startDate) return 'Giờ kết thúc phải sau giờ bắt đầu.'
  if (startDate.toDateString() !== endDate.toDateString()) {
    return 'Lịch đặt phải bắt đầu và kết thúc trong cùng một ngày.'
  }
  if (startDate.getHours() < 7 || endDate.getHours() > 22 || (endDate.getHours() === 22 && endDate.getMinutes() > 0)) {
    return 'Lịch đặt phải nằm trong giờ hoạt động 07:00–22:00.'
  }
  return ''
})

async function loadResources() {
  loadingResources.value = true
  errorMessage.value = ''

  try {
    const [resourceItems, rules] = await Promise.all([
      resourcesApi.listAll(),
      priorityRulesApi.list(),
    ])

    resources.value = resourceItems.filter((resource) => resource.status === 'Available')
    priorityRules.value = rules
    priorityRuleId.value ||= rules[0]?.id ?? ''

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

  if (!selectedResourceId.value || !start.value || !end.value || timeValidationError.value) {
    conflict.value = false
    conflictResult.value = null
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

  if (timeValidationError.value) {
    conflict.value = false
    conflictResult.value = null
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
    submitting.value ||
    timeValidationError.value ||
    !purpose.value.trim()
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
      purpose: purpose.value.trim(),
      priorityRuleId: priorityRuleId.value || null,
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
  start.value = formatLocalInput(new Date(slot.startTime))
  end.value = formatLocalInput(new Date(slot.endTime))

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
          :min="minDateTime"
          required
        />
      </div>

      <div class="field">
        <label>Ngày giờ kết thúc</label>

        <input
          v-model="end"
          class="input"
          type="datetime-local"
          :min="start"
          required
        />
      </div>

      <div class="field span-2">
        <label>Quy tắc ưu tiên</label>

        <select v-model="priorityRuleId" class="select">
          <option value="">Không áp dụng</option>
          <option v-for="rule in priorityRules" :key="rule.id" :value="rule.id">
            {{ rule.name }}
          </option>
        </select>
      </div>

      <div class="field span-2">
        <label>Mục đích sử dụng</label>

        <textarea
          v-model="purpose"
          class="textarea"
          required
          placeholder="Mô tả nội dung công việc, số người tham gia..."
        ></textarea>
      </div>

      <div v-if="timeValidationError" class="notice notice-danger span-2">
        {{ timeValidationError }}
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
          v-else-if="selectedResourceId && !errorMessage && !timeValidationError"
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
          !selectedResourceId ||
          !!timeValidationError ||
          !purpose.trim()
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
