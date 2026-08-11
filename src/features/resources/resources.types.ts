export type ResourceType = 'Room' | 'Equipment'

export type ResourceStatus = 'Available' | 'Maintenance' | 'Inactive'

export interface Resource {
  id: string
  name: string
  type: ResourceType
  specifications: string | null
  imageUrl: string | null
  usageRules: string | null
  departmentId: string
  departmentName: string
  labManagerId: string
  labManagerName: string
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
