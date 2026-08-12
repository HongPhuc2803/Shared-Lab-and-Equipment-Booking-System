import { http, unwrapApiResponse, type ApiResponse } from '@/lib/api/http'
import type {
  CreateMaintenanceInput,
  Maintenance,
  MaintenanceQuery,
  ResolveMaintenanceInput,
} from './maintenances.types'

export const maintenancesApi = {
  list: async (params?: MaintenanceQuery): Promise<Maintenance[]> => {
    const { data } = await http.get<ApiResponse<Maintenance[]>>(
      '/Maintenances',
      { params },
    )

    return unwrapApiResponse(data)
  },

  create: async (input: CreateMaintenanceInput): Promise<Maintenance> => {
    const { data } = await http.post<ApiResponse<Maintenance>>(
      '/Maintenances',
      input,
    )

    return unwrapApiResponse(data)
  },

  resolve: async (
    maintenanceId: string,
    input?: ResolveMaintenanceInput,
  ): Promise<Maintenance> => {
    const { data } = await http.post<ApiResponse<Maintenance>>(
      `/Maintenances/${maintenanceId}/resolve`,
      input ?? {},
    )

    return unwrapApiResponse(data)
  },
}
