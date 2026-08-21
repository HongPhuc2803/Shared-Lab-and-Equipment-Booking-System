import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { bookingsApi } from '@/features/bookings/bookings.api'
import type { Booking } from '@/features/bookings/bookings.types'
import { http } from '@/lib/api/http'

export const useBookingsStore = defineStore('bookings', () => {
  const items = ref<Booking[]>([])
  const waitlistPosition = ref(2)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const upcoming = computed(() => items.value.filter((item) => item.status !== 'Cancelled'))

  async function fetchBookings() {
    loading.value = true
    error.value = null
    try {
      items.value = await bookingsApi.listAll()
    } catch (err: any) {
      error.value = err.message || 'Không thể tải danh sách đặt lịch.'
    } finally {
      loading.value = false
    }
  }

  async function cancel(id: string) {
    try {
      await http.post(`/Bookings/${id}/cancel`)
      await fetchBookings()
    } catch (err: any) {
      error.value = err.message || 'Không thể hủy lịch đặt.'
      throw err
    }
  }

  async function checkIn(id: string) {
    try {
      await http.post(`/Bookings/${id}/checkin`)
      await fetchBookings()
    } catch (err: any) {
      error.value = err instanceof Error ? err.message : 'Không thể check-in.'
      throw err
    }
  }

  return { items, upcoming, waitlistPosition, loading, error, fetchBookings, cancel, checkIn }
})
