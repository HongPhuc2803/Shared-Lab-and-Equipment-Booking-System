import { http, unwrapApiResponse, type ApiResponse } from '@/lib/api/http'
import type {
  CreateIncidentInput,
  Incident,
  IncidentQuery,
} from './incidents.types'

export const incidentsApi = {
  list: async (params?: IncidentQuery): Promise<Incident[]> => {
    const { data } = await http.get<ApiResponse<Incident[]>>(
      '/Incidents',
      { params },
    )

    return unwrapApiResponse(data)
  },

  create: async (input: CreateIncidentInput): Promise<Incident> => {
    const { data } = await http.post<ApiResponse<Incident>>(
      '/Incidents',
      input,
    )

    return unwrapApiResponse(data)
  },
}
