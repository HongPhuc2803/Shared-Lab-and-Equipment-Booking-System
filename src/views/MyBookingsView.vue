<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { bookingsApi } from '@/features/bookings/bookings.api'
import { waitlistsApi } from '@/features/waitlists/waitlists.api'

import type { Booking } from '@/features/bookings/bookings.types'
import type { Waitlist } from '@/features/waitlists/waitlists.types'

const route = useRoute()

const tab = ref(route.query.tab === 'waitlist' ? 'waitlist' : 'upcoming')

const bookings = ref<Booking[]>([])
const waitlists = ref<Waitlist[]>([])

const loading = ref(false)
const waitlistLoading = ref(false)
const error = ref('')
const waitlistError = ref('')

async function loadBookings() {
  loading.value = true
  error.value = ''

  try {
    const response = await bookingsApi.list({
      page: 1,
      pageSize: 100,
    })

    bookings.value = response.items
  } catch (err) {
    console.error('BOOKINGS API ERROR:', err)
    error.value = 'Không thể tải danh sách đặt lịch.'
  } finally {
    loading.value = false
  }
}

async function loadWaitlists() {
  waitlistLoading.value = true
  waitlistError.value = ''

  try {
    waitlists.value = await waitlistsApi.list({
      activeOnly: true,
    })
  } catch (err) {
    console.error('WAITLIST API ERROR:', err)
    waitlistError.value = 'Không thể tải danh sách hàng đợi.'
  } finally {
    waitlistLoading.value = false
  }
}

async function leaveWaitlist(waitlistId: string) {
  try {
    await waitlistsApi.leave(waitlistId)

    waitlists.value = waitlists.value.filter(
      (item) => item.id !== waitlistId,
    )
  } catch (err) {
    console.error('LEAVE WAITLIST ERROR:', err)
    waitlistError.value = 'Không thể rời hàng đợi.'
  }
}

const upcomingBookings = computed(() => {
  const now = new Date()

  return bookings.value.filter(
    (booking) =>
      new Date(booking.endTime) >= now &&
      booking.status !== 'Cancelled' &&
      booking.status !== 'Completed',
  )
})

const historyBookings = computed(() => {
  const now = new Date()

  return bookings.value.filter(
    (booking) =>
      new Date(booking.endTime) < now ||
      booking.status === 'Cancelled' ||
      booking.status === 'Completed',
  )
})

function formatDay(date: string) {
  return new Date(date).getDate().toString().padStart(2, '0')
}

function formatMonth(date: string) {
  return (new Date(date).getMonth() + 1).toString().padStart(2, '0')
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('vi-VN')
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function statusText(status: string) {
  switch (status) {
    case 'Approved':
      return 'Đã duyệt'
    case 'Pending':
      return 'Chờ duyệt'
    case 'Cancelled':
      return 'Đã hủy'
    case 'Completed':
      return 'Hoàn tất'
    default:
      return status
  }
}

function statusClass(status: string) {
  return status === 'Approved' || status === 'Completed'
    ? 'badge-green'
    : 'badge-yellow'
}

function waitlistStatusText(status: string) {
  switch (status) {
    case 'Waiting':
      return 'Đang chờ'
    case 'Notified':
      return 'Đã thông báo'
    case 'Converted':
      return 'Đã chuyển booking'
    case 'Expired':
      return 'Đã hết hạn'
    default:
      return status
  }
}

onMounted(async () => {
  await Promise.all([
    loadBookings(),
    loadWaitlists(),
  ])
})
</script>

<template>
  <div>
    <div class="tabs">
      <button
        class="tab"
        :class="{ active: tab === 'upcoming' }"
        @click="tab = 'upcoming'"
      >
        Sắp tới
        <span class="badge badge-blue">
          {{ upcomingBookings.length }}
        </span>
      </button>

      <button
        class="tab"
        :class="{ active: tab === 'history' }"
        @click="tab = 'history'"
      >
        Lịch sử
      </button>

      <button
        class="tab"
        :class="{ active: tab === 'waitlist' }"
        @click="tab = 'waitlist'"
      >
        Hàng đợi Waitlist

        <span
          v-if="waitlists.length > 0"
          class="badge badge-yellow"
        >
          {{ waitlists.length }}
        </span>
      </button>
    </div>

    <div
      v-if="tab !== 'waitlist' && loading"
      class="panel empty"
    >
      Đang tải danh sách đặt lịch...
    </div>

    <div
      v-else-if="tab !== 'waitlist' && error"
      class="panel empty"
    >
      {{ error }}
    </div>

    <div
      v-else-if="tab === 'upcoming'"
      class="booking-list"
    >
      <div
        v-if="upcomingBookings.length === 0"
        class="panel empty"
      >
        <strong>Chưa có lịch đặt sắp tới</strong>
      </div>

      <article
        v-for="b in upcomingBookings"
        :key="b.id"
        class="booking-card panel"
      >
        <div class="date-tile">
          <strong>{{ formatDay(b.startTime) }}</strong>

          <span>
            THÁNG {{ formatMonth(b.startTime) }}
          </span>
        </div>

        <div class="booking-info">
          <div>
            <span
              class="badge"
              :class="statusClass(b.status)"
            >
              {{ statusText(b.status) }}
            </span>

            <small>{{ b.id }}</small>
          </div>

          <h3>
            {{ b.resourceName ?? 'Tài nguyên' }}
          </h3>

          <p>
            {{ formatTime(b.startTime) }}
            -
            {{ formatTime(b.endTime) }}
            ·
            {{ b.purpose }}
          </p>
        </div>

        <div class="booking-actions">
          <RouterLink
            class="btn"
            :to="`/bookings/${b.id}/report-issue`"
          >
            Báo sự cố
          </RouterLink>
        </div>
      </article>
    </div>

    <div
      v-else-if="tab === 'history'"
      class="booking-list"
    >
      <div
        v-if="historyBookings.length === 0"
        class="panel empty"
      >
        <strong>Chưa có lịch sử đặt phòng</strong>
      </div>

      <article
        v-for="b in historyBookings"
        :key="b.id"
        class="booking-card panel"
      >
        <div class="date-tile">
          <strong>{{ formatDay(b.startTime) }}</strong>

          <span>
            THÁNG {{ formatMonth(b.startTime) }}
          </span>
        </div>

        <div class="booking-info">
          <div>
            <span
              class="badge"
              :class="statusClass(b.status)"
            >
              {{ statusText(b.status) }}
            </span>

            <small>{{ b.id }}</small>
          </div>

          <h3>
            {{ b.resourceName ?? 'Tài nguyên' }}
          </h3>

          <p>
            {{ formatTime(b.startTime) }}
            -
            {{ formatTime(b.endTime) }}
            ·
            {{ b.purpose }}
          </p>
        </div>
      </article>
    </div>

    <div v-else>
      <div
        v-if="waitlistLoading"
        class="panel empty"
      >
        Đang tải hàng đợi...
      </div>

      <div
        v-else-if="waitlistError"
        class="panel empty"
      >
        {{ waitlistError }}
      </div>

      <div
        v-else-if="waitlists.length === 0"
        class="panel empty"
      >
        <strong>Bạn chưa tham gia hàng đợi nào.</strong>
      </div>

      <div
        v-else
        class="waitlist-list"
      >
        <div
          v-for="(item, index) in waitlists"
          :key="item.id"
          class="panel waitlist"
        >
          <div class="queue-number">
            #{{ index + 1 }}
          </div>

          <div>
            <span class="badge badge-yellow">
              {{ waitlistStatusText(item.status) }}
            </span>

            <h2>
              {{ item.resourceName ?? 'Tài nguyên' }}
            </h2>

            <p>
              Khung giờ
              {{ formatDate(item.desiredStart) }}
              ·
              {{ formatTime(item.desiredStart) }}
              -
              {{ formatTime(item.desiredEnd) }}
            </p>

            <small>
              Bạn sẽ nhận thông báo khi có chỗ trống.
            </small>
          </div>

          <button
            class="btn btn-danger"
            @click="leaveWaitlist(item.id)"
          >
            Rời hàng đợi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.booking-list,
.waitlist-list {
  display: grid;
  gap: 12px;
}

.booking-card {
  display: flex;
  align-items: center;
  padding: 18px;
  gap: 18px;
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
  flex: none;
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

.empty {
  padding: 25px;
  text-align: center;
  color: #758094;
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

  .waitlist button {
    width: 100%;
  }
}
</style>
