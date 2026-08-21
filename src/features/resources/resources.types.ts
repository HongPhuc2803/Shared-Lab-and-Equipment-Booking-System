export type ResourceType = 'Room' | 'Equipment'

export type ResourceStatus = 'Available' | 'UnderMaintenance' | 'Disabled'

export interface Resource {
  id: string
  name: string
  type: ResourceType
  specifications: string | null
  imageUrl: string | null
  usageRules: string | null
  departmentId: string | null
  departmentName: string | null
  labManagerId: string | null
  labManagerName: string | null
  status: ResourceStatus
  createdAt: string
}

export interface ResourceListResult {
  items: Resource[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
}

export interface ResourceQuery {
  page?: number
  pageSize?: number
  type?: number
  departmentId?: string
  status?: number
  keyword?: string
}

export interface CreateResourceInput {
  name: string
  type: number
  specifications?: string | null
  imageUrl?: string | null
  usageRules?: string | null
  departmentId?: string | null
  labManagerId?: string | null
}

export interface UpdateResourceInput {
  name: string
  type: number
  specifications?: string | null
  imageUrl?: string | null
  usageRules?: string | null
  departmentId?: string | null
  labManagerId?: string | null
  status: number
}
