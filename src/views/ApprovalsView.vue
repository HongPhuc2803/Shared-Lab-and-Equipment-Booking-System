<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { bookingsApi } from '@/features/bookings/bookings.api'
import type { Booking } from '@/features/bookings/bookings.types'

const tab = ref('Tất cả')
const rows = ref<Booking[]>([])
const loading = ref(false)
const error = ref('')
const toast = ref('')

async function loadBookings() {
  loading.value = true
  error.value = ''

  try {
    const response = await bookingsApi.list({
      page: 1,
      pageSize: 100,
    })

    rows.value = response.items
  } catch (err) {
    console.error('APPROVALS LOAD ERROR:', err)
    error.value = 'Không thể tải danh sách yêu cầu.'
  } finally {
    loading.value = false
  }
}

const visible = computed(() => {
  return rows.value.filter((booking) => {
    if (tab.value === 'Tất cả') {
      return true
    }

    if (tab.value === 'Ưu tiên cao') {
      return booking.priorityRuleName != null
    }

    if (tab.value === 'Hôm nay') {
      const today = new Date()
      const start = new Date(booking.startTime)

      return (
        start.getDate() === today.getDate() &&
        start.getMonth() === today.getMonth() &&
        start.getFullYear() === today.getFullYear()
      )
    }

    return true
  })
})

async function approve(booking: Booking) {
  try {
    const updated = await bookingsApi.approve(booking.id)

    const index = rows.value.findIndex(
      (item) => item.id === booking.id,
    )

    if (index !== -1) {
      rows.value[index] = updated
    }

    toast.value = `Đã duyệt yêu cầu ${booking.id}`

    setTimeout(() => {
      toast.value = ''
    }, 1800)
  } catch (err) {
    console.error('APPROVE BOOKING ERROR:', err)
    error.value = 'Không thể duyệt yêu cầu.'
  }
}

async function reject(booking: Booking) {
  try {
    const updated = await bookingsApi.reject(
      booking.id,
      'Rejected by manager',
    )

    const index = rows.value.findIndex(
      (item) => item.id === booking.id,
    )

    if (index !== -1) {
      rows.value[index] = updated
    }

    toast.value = `Đã từ chối yêu cầu ${booking.id}`

    setTimeout(() => {
      toast.value = ''
    }, 1800)
  } catch (err) {
    console.error('REJECT BOOKING ERROR:', err)
    error.value = 'Không thể từ chối yêu cầu.'
  }
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleString('vi-VN')
}

function statusText(status: string) {
  switch (status) {
    case 'Pending':
      return 'Chờ duyệt'

    case 'Approved':
      return 'Đã duyệt'

    case 'Rejected':
      return 'Từ chối'

    case 'Cancelled':
      return 'Đã hủy'

    case 'Completed':
      return 'Hoàn tất'

    default:
      return status
  }
}

function statusClass(status: string) {
  if (status === 'Approved') {
    return 'badge-green'
  }

  if (status === 'Rejected') {
    return 'badge-red'
  }

  return 'badge-yellow'
}

function priorityText(booking: Booking) {
  return booking.priorityRuleName ?? 'Thường'
}

function priorityClass(booking: Booking) {
  return booking.priorityRuleName
    ? 'badge-red'
    : 'badge-gray'
}

onMounted(loadBookings)
</script>

<template>
  <div>
    <div class="tabs">
      <button
        v-for="t in ['Tất cả', 'Ưu tiên cao', 'Hôm nay']"
        :key="t"
        class="tab"
        :class="{ active: tab === t }"
        @click="tab = t"
      >
        {{ t }}
      </button>
    </div>

    <div
      v-if="error"
      class="notice notice-danger"
    >
      {{ error }}
    </div>

    <div
      v-if="loading"
      class="panel empty"
    >
      Đang tải danh sách yêu cầu...
    </div>

    <div
      v-else
      class="panel table-wrap"
    >
      <table class="data-table">
        <thead>
          <tr>
            <th>Người yêu cầu</th>
            <th>Phòng/Thiết bị</th>
            <th>Thời gian</th>
            <th>Mục đích</th>
            <th>Ưu tiên</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="visible.length === 0">
            <td
              colspan="7"
              class="empty-cell"
            >
              Không có yêu cầu.
            </td>
          </tr>

          <tr
            v-for="r in visible"
            :key="r.id"
          >
            <td>
              <strong>
                {{ r.requesterName ?? 'Người dùng' }}
              </strong>

              <br />

              <small>{{ r.id }}</small>
            </td>

            <td>
              {{ r.resourceName ?? '-' }}
            </td>

            <td>
              {{ formatDateTime(r.startTime) }}
              -
              {{ formatDateTime(r.endTime) }}
            </td>

            <td>
              {{ r.purpose }}
            </td>

            <td>
              <span
                class="badge"
                :class="priorityClass(r)"
              >
                {{ priorityText(r) }}
              </span>
            </td>

            <td>
              <span
                class="badge"
                :class="statusClass(r.status)"
              >
                {{ statusText(r.status) }}
              </span>
            </td>

            <td>
              <div
                v-if="r.status === 'Pending'"
                class="row-actions"
              >
                <button
                  class="btn btn-primary btn-sm"
                  @click="approve(r)"
                >
                  Duyệt
                </button>

                <button
                  class="btn btn-sm"
                  @click="reject(r)"
                >
                  Từ chối
                </button>
              </div>

              <span
                v-else
                class="muted"
              >
                Đã xử lý
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="toast"
      class="toast"
    >
      {{ toast }}
    </div>
  </div>
</template>

<style scoped>
.empty {
  padding: 25px;
  text-align: center;
  color: #7f899a;
}

.empty-cell {
  text-align: center;
  color: #7f899a;
}

.row-actions {
  display: flex;
  gap: 7px;
}
</style>
