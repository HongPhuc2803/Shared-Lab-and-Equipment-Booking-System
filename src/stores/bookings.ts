import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { bookings as seedBookings } from '@/data/mock'

export const useBookingsStore = defineStore('bookings', () => {
  const items = ref(seedBookings.map((item) => ({ ...item })))
  const waitlistPosition = ref(2)
  const upcoming = computed(() => items.value.filter((item) => item.status !== 'Đã hủy'))
  function cancel(id: string) {
    const item = items.value.find((row) => row.id === id)
    if (item) item.status = 'Đã hủy'
  }
  function checkIn(id: string) {
    const item = items.value.find((row) => row.id === id)
    if (item) item.status = 'Đã check-in'
  }
  return { items, upcoming, waitlistPosition, cancel, checkIn }
})
