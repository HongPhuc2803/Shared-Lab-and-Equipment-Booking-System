<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { resourcesApi } from '@/features/resources/resources.api'
import { http, unwrapApiResponse } from '@/lib/api/http'

const route = useRoute()
const router = useRouter()

const OPERATING_START_HOUR = 7
const OPERATING_END_HOUR = 22
const OPERATING_HOURS = OPERATING_END_HOUR - OPERATING_START_HOUR

const currentMonday = ref(getMonday(new Date()))
const resource = ref<any>(null)
const apiSlots = ref<any[]>([])
const loading = ref(false)
const errorMsg = ref('')
const now = ref(Date.now())
let clockTimer: ReturnType<typeof setInterval> | undefined

function getMonday(d: Date) {
  const date = new Date(d)
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(date.setDate(diff))
  monday.setHours(0, 0, 0, 0)
  return monday
}

const weekDays = computed(() => {
  const dates = []
  const start = new Date(currentMonday.value)
  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    dates.push(d)
  }
  return dates
})

const daysLabels = computed(() => {
  const prefix = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
  return weekDays.value.map((d, index) => {
    const dayStr = String(d.getDate()).padStart(2, '0')
    const monthStr = String(d.getMonth() + 1).padStart(2, '0')
    return `${prefix[index]} ${dayStr}/${monthStr}`
  })
})

const weekLabel = computed(() => {
  const start = weekDays.value[0]
  const end = weekDays.value[6]
  if (!start || !end) return ''

  const startDay = String(start.getDate()).padStart(2, '0')
  const startMonth = String(start.getMonth() + 1).padStart(2, '0')
  const endDay = String(end.getDate()).padStart(2, '0')
  const endMonth = String(end.getMonth() + 1).padStart(2, '0')

  const target = new Date(start.valueOf())
  const dayNr = (start.getDay() + 6) % 7
  target.setDate(target.getDate() - dayNr + 3)
  const firstThursday = target.valueOf()
  target.setMonth(0, 1)
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7)
  }
  const weekNum = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000)

  return `Tuần ${weekNum} · ${startDay}/${startMonth} - ${endDay}/${endMonth}`
})

async function fetchData() {
  loading.value = true
  errorMsg.value = ''
  try {
    const resourceId = route.params.id as string
    if (!resource.value) {
      resource.value = await resourcesApi.getById(resourceId)
    }

    const monday = currentMonday.value
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    sunday.setHours(23, 59, 59, 999)

    const response = await http.get(`/Resources/${resourceId}/availability`, {
      params: {
        from: monday.toISOString(),
        to: sunday.toISOString(),
      },
    })
    const unwrapped = unwrapApiResponse(response.data) as any[]
    apiSlots.value = unwrapped || []
  } catch (err: any) {
    console.error('Fetch availability error:', err)
    errorMsg.value = 'Không thể tải lịch khả dụng từ máy chủ.'
  } finally {
    loading.value = false
  }
}

function changeWeek(offset: number) {
  const newMonday = new Date(currentMonday.value)
  newMonday.setDate(newMonday.getDate() + offset * 7)
  currentMonday.value = newMonday
  fetchData()
}

const parsedSlots = computed(() => {
  const result = []
  for (const slot of apiSlots.value) {
    const startD = new Date(slot.startTime)
    const endD = new Date(slot.endTime)

    const dayIndex = weekDays.value.findIndex(
      (d) =>
        d.getDate() === startD.getDate() &&
        d.getMonth() === startD.getMonth() &&
        d.getFullYear() === startD.getFullYear(),
    )

    if (dayIndex === -1) continue

    const startHourDecimal = startD.getHours() + startD.getMinutes() / 60
    const endHourDecimal = endD.getHours() + endD.getMinutes() / 60

    if (endHourDecimal <= OPERATING_START_HOUR || startHourDecimal >= OPERATING_END_HOUR) continue

    const clampedStart = Math.max(OPERATING_START_HOUR, startHourDecimal)
    const clampedEnd = Math.min(OPERATING_END_HOUR, endHourDecimal)

    const gridStart = Math.floor(clampedStart - OPERATING_START_HOUR)
    const gridSpan = Math.max(1, Math.round(clampedEnd - clampedStart))

    const statusLower = (slot.status || slot.type || '').toLowerCase()
    if (statusLower === 'free' && startD.getTime() <= now.value) continue

    let typeClass = 'booked'
    let label = 'Đã đặt'
    if (statusLower === 'free') {
      typeClass = 'free'
      label = '+ Đặt lịch'
    } else if (statusLower === 'undermaintenance' || statusLower === 'maintenance') {
      typeClass = 'maintenance'
      label = 'Bảo trì'
    }

    result.push({
      day: dayIndex,
      start: gridStart,
      h: gridSpan,
      type: typeClass,
      label,
      raw: slot,
    })
  }
  return result
})

function formatLocalISO(date: Date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`
}

function selectSlot(s: any) {
  const resourceId = route.params.id as string | undefined
  const startDate = new Date(s.raw.startTime)

  if (!resourceId || Number.isNaN(startDate.getTime()) || startDate.getTime() <= Date.now()) {
    return
  }

  const startStr = formatLocalISO(new Date(s.raw.startTime))
  const endStr = formatLocalISO(new Date(s.raw.endTime))
  router.push({
    path: '/bookings/new',
    query: {
      resource: resourceId,
      start: startStr,
      end: endStr,
    },
  })
}

onMounted(() => {
  fetchData()
  clockTimer = setInterval(() => {
    now.value = Date.now()
  }, 30_000)
})

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer)
})
</script>

<template>
  <div class="calendar-panel panel">
    <div class="calendar-toolbar">
      <strong>Lịch theo tuần</strong>
      <div class="week-nav">
        <button class="icon-button" :disabled="loading" @click="changeWeek(-1)">‹</button>
        <strong>{{ weekLabel }}</strong>
        <button class="icon-button" :disabled="loading" @click="changeWeek(1)">›</button>
      </div>
    </div>
    
    <div class="calendar-legend">
      <span><i class="blue"></i>Đã đặt</span>
      <span><i class="red"></i>Bảo trì</span>
      <span><i class="green"></i>Khả dụng</span>
    </div>
    
    <div v-if="loading" class="notice text-center" style="margin: 20px;">
      Đang tải dữ liệu lịch biểu...
    </div>
    <div v-else-if="errorMsg" class="notice notice-danger" style="margin: 20px;">
      {{ errorMsg }}
    </div>
    
    <div v-else class="calendar-scroll">
      <div class="calendar-grid">
        <!-- Corner -->
        <div class="corner"></div>

        <!-- Day Headers -->
        <div
          v-for="(d, idx) in daysLabels"
          :key="d"
          class="day-head"
          :style="{ gridColumn: idx + 2, gridRow: 1 }"
        >
          {{ d }}
        </div>

        <!-- Time column -->
        <div
          v-for="h in OPERATING_HOURS"
          :key="'time-' + h"
          class="time"
          :style="{ gridColumn: 1, gridRow: h + 1 }"
        >
          {{ String(h + OPERATING_START_HOUR - 1).padStart(2, '0') }}:00
        </div>

        <!-- Background grid cells -->
        <template v-for="h in OPERATING_HOURS" :key="'row-' + h">
          <div
            v-for="d in 7"
            :key="'cell-' + h + '-' + d"
            class="cell"
            :style="{ gridColumn: d + 1, gridRow: h + 1 }"
          ></div>
        </template>
        
        <!-- Slot items placed on top -->
        <button
          v-for="(s, i) in parsedSlots"
          :key="'slot-' + i"
          class="slot"
          :class="s.type"
          :style="{
            gridColumn: s.day + 2,
            gridRowStart: s.start + 2,
            gridRowEnd: `span ${s.h}`
          }"
          :disabled="s.type !== 'free'"
          @click="s.type === 'free' && selectSlot(s)"
        >
          {{ s.label }}
        </button>
      </div>
    </div>
    
    <p class="calendar-note" v-if="resource">
      Chọn một khung giờ khả dụng để tạo yêu cầu cho <strong>{{ resource.name }}</strong>.
    </p>
  </div>
</template>

<style scoped>
.calendar-panel {
  overflow: hidden;
}
.calendar-toolbar {
  padding: 15px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e5e9f0;
}
.segmented {
  display: flex;
  border: 1px solid #dce1e9;
  border-radius: 6px;
  overflow: hidden;
}
.segmented button {
  border: 0;
  border-right: 1px solid #dce1e9;
  background: #fff;
  padding: 9px 18px;
  color: #697487;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}
.segmented button:last-child {
  border: 0;
}
.segmented button.active {
  background: #3157d5;
  color: #fff;
}
.week-nav {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
}
.icon-button {
  background: #f0f3f8;
  border: 1px solid #dce1e9;
  border-radius: 4px;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
}
.icon-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.calendar-legend {
  display: flex;
  gap: 20px;
  justify-content: flex-end;
  padding: 11px 18px;
  font-size: 10px;
  color: #6f7a8d;
}
.calendar-legend span {
  display: inline-flex;
  align-items: center;
}
.calendar-legend i {
  display: inline-block;
  width: 9px;
  height: 9px;
  border-radius: 2px;
  margin-right: 5px;
}
.blue {
  background: #aebff7;
}
.red {
  background: #ffc2c5;
}
.green {
  background: #d9f5e2;
  border: 1px dashed #2c9b59;
}
.calendar-scroll {
  overflow: auto;
  max-height: calc(100vh - 270px);
}
.calendar-grid {
  display: grid;
  grid-template-columns: 65px repeat(7, minmax(115px, 1fr));
  grid-template-rows: 42px repeat(15, 55px);
  min-width: 880px;
  position: relative;
}
.corner,
.day-head,
.time,
.cell {
  border-right: 1px solid #e7eaf0;
  border-bottom: 1px solid #e7eaf0;
}
.corner {
  grid-column: 1;
  grid-row: 1;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 12;
  background: #f8f9fb;
}
.day-head {
  display: grid;
  place-items: center;
  font-size: 11px;
  font-weight: 700;
  background: #f8f9fb;
  position: sticky;
  top: 0;
  z-index: 10;
}
.time {
  text-align: right;
  padding: 8px;
  color: #9099a8;
  font-size: 9px;
  position: sticky;
  left: 0;
  z-index: 9;
  background: #fff;
}
.cell {
  background: #fff;
}
.slot {
  z-index: 2;
  margin: 3px;
  border-radius: 5px;
  border: 1px solid;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4px;
}
.booked {
  background: #dce4ff;
  border-color: #5074e6;
  color: #3157d5;
}
.maintenance {
  background: #ffe1e1;
  border-color: #eb6268;
  color: #c33942;
}
.free {
  background: #e7f8ec;
  border: 1px dashed #279652;
  color: #27864a;
  cursor: pointer;
  transition: background-color 0.15s ease;
}
.free:hover {
  background: #d3f3db;
}
.calendar-note {
  padding: 12px 18px;
  color: #788397;
  font-size: 11px;
}
@media (max-width: 700px) {
  .calendar-toolbar {
    align-items: flex-start;
    gap: 13px;
    flex-direction: column;
  }
  .calendar-legend {
    justify-content: flex-start;
  }
  .segmented {
    width: 100%;
  }
  .segmented button {
    flex: 1;
  }
}
</style>
