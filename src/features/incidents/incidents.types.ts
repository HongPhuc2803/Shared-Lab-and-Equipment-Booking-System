export interface Incident {
  id: string
  resourceId: string
  resourceName: string | null
  bookingId: string | null
  reportedBy: string
  reportedByName: string | null
  description: string
  imageUrl: string | null
  status: string
  reportedAt: string
}

export interface IncidentQuery {
  status?: number
  resourceId?: string
}

export interface CreateIncidentInput {
  resourceId: string
  bookingId?: string | null
  description: string
  imageUrl?: string | null
}
