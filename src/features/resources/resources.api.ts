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

  listAll: async (params?: Omit<ResourceQuery, 'page' | 'pageSize'>): Promise<Resource[]> => {
    const items: Resource[] = []
    let page = 1
    let hasNext = true

    while (hasNext) {
      const { data } = await http.get<ApiResponse<ResourceListResult>>('/Resources', {
        params: { ...params, page, pageSize: 100 },
      })
      const result = unwrapApiResponse(data)
      items.push(...result.items)
      hasNext = result.hasNext
      page += 1
    }

    return items
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
