export interface Restriction {
  id: string
  userId: string
  userName: string | null
  startDate: string
  endDate: string
  reason: string
  createdBy: string | null
}

export interface RestrictionQuery {
  userId?: string
  activeOnly?: boolean
}

export interface CreateRestrictionInput {
  userId: string
  startDate: string
  endDate: string
  reason: string
}
