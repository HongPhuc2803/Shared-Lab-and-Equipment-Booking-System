import { http, unwrapApiResponse, type ApiResponse } from '@/lib/api/http'
import type {
  CreateRestrictionInput,
  Restriction,
  RestrictionQuery,
} from './restrictions.types'

export const restrictionsApi = {
  list: async (params?: RestrictionQuery): Promise<Restriction[]> => {
    const { data } = await http.get<ApiResponse<Restriction[]>>(
      '/Restrictions',
      { params },
    )

    return unwrapApiResponse(data)
  },

  create: async (input: CreateRestrictionInput): Promise<Restriction> => {
    const { data } = await http.post<ApiResponse<Restriction>>(
      '/Restrictions',
      input,
    )

    return unwrapApiResponse(data)
  },

  remove: async (restrictionId: string): Promise<Restriction> => {
    const { data } = await http.delete<ApiResponse<Restriction>>(
      `/Restrictions/${restrictionId}`,
    )

    return unwrapApiResponse(data)
  },
}
