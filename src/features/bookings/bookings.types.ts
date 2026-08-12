export interface Booking {
  id: string
  resourceId: string
  resourceName?: string | null
  requesterId: string
  requesterName?: string | null
  priorityRuleId?: string | null
  priorityRuleName?: string | null
  startTime: string
  endTime: string
  purpose: string
  status: string
  approvedBy?: string | null
  approvedAt?: string | null
  checkInTime?: string | null
  checkOutTime?: string | null
  actualDuration?: number | null
  createdAt: string
}

export interface BookingQuery {
  page?: number
  pageSize?: number
  status?: string
  resourceId?: string
  requesterId?: string
  from?: string
  to?: string
}

export interface PaginationResponse<T> {
  items: T[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
}

export interface CreateBookingRequest {
  resourceId: string
  startTime: string
  endTime: string
  purpose: string
  priorityRuleId?: string | null
}

export interface CheckBookingConflictRequest {
  resourceId: string
  startTime: string
  endTime: string
}

export interface AvailabilitySlot {
  startTime: string
  endTime: string
  status: string
  bookingId?: string | null
}

export interface BookingConflictResponse {
  hasConflict: boolean
  conflictingBookings: Booking[]
  suggestedSlots: AvailabilitySlot[]
}
