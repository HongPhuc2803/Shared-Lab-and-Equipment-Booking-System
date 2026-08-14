export interface Waitlist {
  id: string
  resourceId: string
  resourceName: string | null
  requesterId: string
  desiredStart: string
  desiredEnd: string
  status: string
  notifiedAt: string | null
  createdAt: string
}

export interface WaitlistQuery {
  activeOnly?: boolean
}

export interface JoinWaitlistInput {
  resourceId: string
  desiredStart: string
  desiredEnd: string
}
