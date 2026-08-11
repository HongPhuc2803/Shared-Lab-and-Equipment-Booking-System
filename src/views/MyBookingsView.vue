<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { bookings } from '@/data/mock'
const route = useRoute()
const tab = ref(route.query.tab === 'waitlist' ? 'waitlist' : 'upcoming')
const checked = ref<string[]>([])
const cancelled = ref<string[]>([])
function check(id: string) {
  checked.value.push(id)
}
function cancel(id: string) {
  cancelled.value.push(id)
}
</script>
<template>
  <div>
    <div class="tabs">
      <button class="tab" :class="{ active: tab === 'upcoming' }" @click="tab = 'upcoming'">
        Sắp tới <span class="badge badge-blue">2</span></button
      ><button class="tab" :class="{ active: tab === 'history' }" @click="tab = 'history'">
        Lịch sử</button
      ><button class="tab" :class="{ active: tab === 'waitlist' }" @click="tab = 'waitlist'">
        Hàng đợi Waitlist
      </button>
    </div>
    <div v-if="tab === 'upcoming'" class="booking-list">
      <article
        v-for="b in bookings"
        :key="b.id"
        class="booking-card panel"
        :class="{ cancelled: cancelled.includes(b.id) }"
      >
        <div class="date-tile">
          <strong>{{ b.date.slice(0, 2) }}</strong
          ><span>THÁNG 08</span>
        </div>
        <div class="booking-info">
          <div>
            <span class="badge" :class="b.status === 'Đã duyệt' ? 'badge-green' : 'badge-yellow'">{{
              cancelled.includes(b.id) ? 'Đã hủy' : b.status
            }}</span
            ><small>{{ b.id }}</small>
          </div>
          <h3>{{ b.resource }}</h3>
          <p>{{ b.time }} · {{ b.purpose }}</p>
          <strong class="countdown">{{ b.countdown }}</strong>
        </div>
        <div class="booking-actions">
          <button
            v-if="b.status === 'Đã duyệt' && !checked.includes(b.id) && !cancelled.includes(b.id)"
            class="btn btn-primary"
            @click="check(b.id)"
          >
            Check-in</button
          ><span v-if="checked.includes(b.id)" class="badge badge-green">✓ Đã check-in</span
          ><RouterLink class="btn" :to="`/bookings/${b.id}/report-issue`">Báo sự cố</RouterLink
          ><button v-if="!cancelled.includes(b.id)" class="btn btn-danger" @click="cancel(b.id)">
            Hủy lịch
          </button>
        </div>
      </article>
    </div>
    <div v-else-if="tab === 'waitlist'" class="panel waitlist">
      <div class="queue-number">#2</div>
      <div>
        <span class="badge badge-yellow">Đang chờ</span>
        <h2>Phòng Lab AI & Robotics</h2>
        <p>Khung giờ 10/08/2026 · 13:00 - 15:00</p>
        <small>Bạn sẽ nhận thông báo ngay khi có chỗ trống.</small>
      </div>
      <button class="btn btn-danger">Rời hàng đợi</button>
    </div>
    <div v-else class="panel empty">
      <strong>Chưa có lịch sử đặt phòng</strong>Các lịch đã hoàn tất sẽ xuất hiện tại đây.
    </div>
  </div>
</template>
<style scoped>
.booking-list {
  display: grid;
  gap: 12px;
}
.booking-card {
  display: flex;
  align-items: center;
  padding: 18px;
  gap: 18px;
}
.booking-card.cancelled {
  opacity: 0.55;
}
.date-tile {
  width: 66px;
  height: 66px;
  border-radius: 6px;
  background: #edf1ff;
  color: #3157d5;
  display: grid;
  place-items: center;
  align-content: center;
  flex: none;
}
.date-tile strong {
  font-size: 22px;
}
.date-tile span {
  font-size: 8px;
  font-weight: 800;
}
.booking-info {
  flex: 1;
}
.booking-info > div {
  display: flex;
  align-items: center;
  gap: 8px;
}
.booking-info small {
  color: #929aa9;
  font-size: 9px;
}
.booking-info h3 {
  margin: 8px 0 4px;
  font-size: 15px;
}
.booking-info p {
  margin: 0;
  color: #687487;
  font-size: 11px;
}
.countdown {
  display: block;
  color: #3157d5;
  font-size: 10px;
  margin-top: 8px;
}
.booking-actions {
  display: flex;
  gap: 7px;
  align-items: center;
}
.waitlist {
  display: flex;
  align-items: center;
  padding: 25px;
  gap: 20px;
}
.queue-number {
  width: 75px;
  height: 75px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #fff2cc;
  color: #8d6600;
  font-weight: 800;
  font-size: 25px;
}
.waitlist > div:nth-child(2) {
  flex: 1;
}
.waitlist h2 {
  font-size: 16px;
  margin: 10px 0 5px;
}
.waitlist p,
.waitlist small {
  color: #758094;
  font-size: 11px;
}
@media (max-width: 750px) {
  .booking-card,
  .waitlist {
    align-items: flex-start;
    flex-wrap: wrap;
  }
  .booking-info {
    min-width: calc(100% - 90px);
  }
  .booking-actions {
    width: 100%;
    flex-wrap: wrap;
  }
}
</style>
