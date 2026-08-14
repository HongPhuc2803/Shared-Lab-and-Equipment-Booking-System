import { http, unwrapApiResponse, type ApiResponse } from '@/lib/api/http'
import type {
  CreatePriorityRuleInput,
  PriorityRule,
  UpdatePriorityRuleInput,
} from './priority-rules.types'

export const priorityRulesApi = {
  list: async (): Promise<PriorityRule[]> => {
    const { data } = await http.get<ApiResponse<PriorityRule[]>>(
      '/priority-rules',
    )

    return unwrapApiResponse(data)
  },

  create: async (input: CreatePriorityRuleInput): Promise<PriorityRule> => {
    const { data } = await http.post<ApiResponse<PriorityRule>>(
      '/priority-rules',
      input,
    )

    return unwrapApiResponse(data)
  },

  update: async (
    id: string,
    input: UpdatePriorityRuleInput,
  ): Promise<PriorityRule> => {
    const { data } = await http.put<ApiResponse<PriorityRule>>(
      `/priority-rules/${id}`,
      input,
    )

    return unwrapApiResponse(data)
  },

  remove: async (id: string): Promise<void> => {
    await http.delete(`/priority-rules/${id}`)
  },
}
