import { http, unwrapApiResponse, type ApiResponse } from '@/lib/api/http'
import type {
  CreateResourceInput,
  Resource,
  ResourceListResult,
  ResourceQuery,
  UpdateResourceInput,
} from './resources.types'

export const resourcesApi = {
  list: async (params?: ResourceQuery): Promise<ResourceListResult> => {
    const { data } = await http.get<ApiResponse<ResourceListResult>>(
      '/Resources',
      { params },
    )

    return unwrapApiResponse(data)
  },

  getById: async (id: string): Promise<Resource> => {
    const { data } = await http.get<ApiResponse<Resource>>(
      `/Resources/${id}`,
    )

    return unwrapApiResponse(data)
  },

  create: async (input: CreateResourceInput): Promise<Resource> => {
    const { data } = await http.post<ApiResponse<Resource>>(
      '/Resources',
      input,
    )

    return unwrapApiResponse(data)
  },

  update: async (
    id: string,
    input: UpdateResourceInput,
  ): Promise<Resource> => {
    const { data } = await http.put<ApiResponse<Resource>>(
      `/Resources/${id}`,
      input,
    )

    return unwrapApiResponse(data)
  },

  remove: async (id: string): Promise<void> => {
    await http.delete(`/Resources/${id}`)
  },
}
