import { http, unwrapApiResponse } from '@/lib/api/http'
import type { ApiResponse } from '@/lib/api/http'
import type { ResourceListResult, ResourceQuery } from './resources.types'

export const resourcesApi = {
  list: async (params?: ResourceQuery) => {
    const { data } = await http.get<ApiResponse<ResourceListResult>>(
      '/Resources',
      {
        params,
      },
    )

    return unwrapApiResponse(data)
  },
}
