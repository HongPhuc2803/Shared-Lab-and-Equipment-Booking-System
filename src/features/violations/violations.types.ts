export interface Violation {
  id: string
  userId: string
  userName: string | null
  bookingId: string | null
  type: string
  recordedAt: string
  note: string | null
}

export interface ViolationQuery {
  userId?: string
  type?: string
}
