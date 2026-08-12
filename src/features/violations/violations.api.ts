import { http, unwrapApiResponse, type ApiResponse } from '@/lib/api/http'
import type { Violation, ViolationQuery } from './violations.types'

export const violationsApi = {
  list: async (params?: ViolationQuery): Promise<Violation[]> => {
    const { data } = await http.get<ApiResponse<Violation[]>>(
      '/Violations',
      { params },
    )

    return unwrapApiResponse(data)
  },
}
