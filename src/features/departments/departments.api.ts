import { http, unwrapApiResponse, type ApiResponse } from '@/lib/api/http'
import type { Department } from './departments.types'

export const departmentsApi = {
  list: async (): Promise<Department[]> => {
    const { data } = await http.get<ApiResponse<Department[]>>(
      '/Departments',
    )

    return unwrapApiResponse(data)
  },
}
