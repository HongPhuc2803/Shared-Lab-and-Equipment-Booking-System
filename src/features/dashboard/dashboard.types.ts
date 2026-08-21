export interface ResourceUsage {
  resourceId: string
  resourceName: string | null
  departmentName: string | null
  bookedMinutes: number
  actualMinutes: number
  usagePercent: number
}

export interface DepartmentUsage {
  departmentId: string
  departmentName: string | null
  bookedMinutes: number
  actualMinutes: number
  usagePercent: number
}

export interface UsageDashboard {
  from: string
  to: string
  overallUsagePercent: number
  totalBookedMinutes: number
  totalActualMinutes: number
  byResource: ResourceUsage[]
  byDepartment: DepartmentUsage[]
}

export interface UsageDashboardQuery {
  from?: string
  to?: string
  resourceId?: string
  departmentId?: string
}

export interface MaintenanceItem {
  id: string
  resourceId: string
  resourceName: string | null
  startTime: string
  endTime: string
  description: string
  cost: number | null
  status: string
  createdBy: string
}

export interface MaintenanceCostByResource {
  resourceId: string
  resourceName: string | null
  maintenanceCount: number
  totalCost: number | null
}

export interface MaintenanceReport {
  from: string
  to: string
  totalCount: number
  totalCost: number | null
  items: MaintenanceItem[]
  byResource: MaintenanceCostByResource[]
}

export interface MaintenanceReportQuery {
  from?: string
  to?: string
  resourceId?: string
}
