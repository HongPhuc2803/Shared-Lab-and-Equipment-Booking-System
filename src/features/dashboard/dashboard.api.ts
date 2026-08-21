import { http, unwrapApiResponse, type ApiResponse } from '@/lib/api/http'
import type {
  MaintenanceReport,
  MaintenanceReportQuery,
  UsageDashboard,
  UsageDashboardQuery,
} from './dashboard.types'

export const dashboardApi = {
  usage: async (params?: UsageDashboardQuery): Promise<UsageDashboard> => {
    const { data } = await http.get<ApiResponse<UsageDashboard>>(
      '/Dashboard/usage',
      { params },
    )

    return unwrapApiResponse(data)
  },

  maintenanceReport: async (
    params?: MaintenanceReportQuery,
  ): Promise<MaintenanceReport> => {
    const { data } = await http.get<ApiResponse<MaintenanceReport>>(
      '/Dashboard/maintenance-report',
      { params },
    )

    return unwrapApiResponse(data)
  },
}
