<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { resources } from '@/data/mock'
const route = useRoute(),
  router = useRouter()
const view = ref('Tuần')
const week = ref(32)
const resource = computed(
  () => resources.find((r) => r.id === Number(route.params.id)) ?? resources[0],
)
const days = ['T2 03/08', 'T3 04/08', 'T4 05/08', 'T5 06/08', 'T6 07/08', 'T7 08/08', 'CN 09/08']
const slots = [
  { day: 0, start: 1, h: 2, type: 'booked', label: 'Đã đặt' },
  { day: 1, start: 3, h: 2, type: 'booked', label: 'Đã đặt' },
  { day: 2, start: 2, h: 2, type: 'free', label: '+ Đặt lịch' },
  { day: 3, start: 0, h: 2, type: 'maintenance', label: 'Bảo trì' },
  { day: 5, start: 5, h: 2, type: 'booked', label: 'Đã đặt' },
]
function selectSlot() {
  router.push({
    path: '/bookings/new',
    query: { resource: resource.value.id, start: '2026-08-05T09:00', end: '2026-08-05T11:00' },
  })
}
</script>
<template>
  <div class="calendar-panel panel">
    <div class="calendar-toolbar">
      <div class="segmented">
        <button
          v-for="v in ['Ngày', 'Tuần', 'Tháng']"
          :key="v"
          :class="{ active: view === v }"
          @click="view = v"
        >
          {{ v }}
        </button>
      </div>
      <div class="week-nav">
        <button class="icon-button" @click="week--">‹</button
        ><strong>Tuần {{ week }} · 03/08 - 09/08</strong
        ><button class="icon-button" @click="week++">›</button>
      </div>
    </div>
    <div class="calendar-legend">
      <span><i class="blue"></i>Đã đặt</span><span><i class="red"></i>Bảo trì</span
      ><span><i class="green"></i>Khả dụng</span>
    </div>
    <div class="calendar-scroll">
      <div class="calendar-grid">
        <div class="corner"></div>
        <div v-for="d in days" :key="d" class="day-head">{{ d }}</div>
        <template v-for="h in 9" :key="h"
          ><div class="time">{{ String(h + 7).padStart(2, '0') }}:00</div>
          <div v-for="d in 7" :key="d" class="cell"></div></template
        ><button
          v-for="(s, i) in slots"
          :key="i"
          class="slot"
          :class="s.type"
          :style="{ gridColumn: String(s.day + 2), gridRow: `${s.start + 2} / span ${s.h}` }"
          @click="s.type === 'free' && selectSlot()"
        >
          {{ s.label }}
        </button>
      </div>
    </div>
    <p class="calendar-note">
      Chọn một khung giờ khả dụng để tạo yêu cầu cho <strong>{{ resource.name }}</strong
      >.
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
.calendar-legend {
  display: flex;
  gap: 20px;
  justify-content: flex-end;
  padding: 11px 18px;
  font-size: 10px;
  color: #6f7a8d;
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
}
.calendar-grid {
  display: grid;
  grid-template-columns: 65px repeat(7, minmax(115px, 1fr));
  grid-template-rows: 42px repeat(9, 55px);
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
.day-head {
  display: grid;
  place-items: center;
  font-size: 11px;
  font-weight: 700;
  background: #f8f9fb;
}
.time {
  text-align: right;
  padding: 8px;
  color: #9099a8;
  font-size: 9px;
}
.slot {
  z-index: 2;
  margin: 3px;
  border-radius: 5px;
  border: 1px solid;
  font-size: 10px;
  font-weight: 700;
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
}
.calendar-note {
  padding: 0 18px 15px;
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
