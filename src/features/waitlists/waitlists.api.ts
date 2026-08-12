import { http, unwrapApiResponse, type ApiResponse } from '@/lib/api/http'
import type {
  JoinWaitlistInput,
  Waitlist,
  WaitlistQuery,
} from './waitlists.types'

export const waitlistsApi = {
  list: async (params?: WaitlistQuery): Promise<Waitlist[]> => {
    const { data } = await http.get<ApiResponse<Waitlist[]>>(
      '/Waitlists',
      { params },
    )

    return unwrapApiResponse(data)
  },

  join: async (input: JoinWaitlistInput): Promise<Waitlist> => {
    const { data } = await http.post<ApiResponse<Waitlist>>(
      '/Waitlists',
      input,
    )

    return unwrapApiResponse(data)
  },

  leave: async (waitlistId: string): Promise<Waitlist> => {
    const { data } = await http.delete<ApiResponse<Waitlist>>(
      `/Waitlists/${waitlistId}`,
    )

    return unwrapApiResponse(data)
  },
}
