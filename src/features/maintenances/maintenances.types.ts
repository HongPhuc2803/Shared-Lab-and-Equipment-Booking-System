export interface Maintenance {
  id: string
  resourceId: string
  resourceName: string | null
  startTime: string
  endTime: string
  description: string | null
  cost: number | null
  status: string
  createdBy: string
}

export interface MaintenanceQuery {
  resourceId?: string
  status?: number
}

export interface CreateMaintenanceInput {
  resourceId: string
  startTime: string
  endTime: string
  description?: string | null
  cost?: number | null
}

export interface ResolveMaintenanceInput {
  cost?: number | null
}
