import { http, unwrapApiResponse, type ApiResponse } from '@/lib/api/http'
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserListResult,
  UserQuery,
} from './users.types'

export const usersApi = {
  list: async (params?: UserQuery): Promise<UserListResult> => {
    const { data } = await http.get<ApiResponse<UserListResult>>(
      '/Users',
      { params },
    )

    return unwrapApiResponse(data)
  },

  listAll: async (params?: Omit<UserQuery, 'page' | 'pageSize'>): Promise<User[]> => {
    const items: User[] = []
    let page = 1
    let hasNext = true

    while (hasNext) {
      const { data } = await http.get<ApiResponse<UserListResult>>('/Users', {
        params: { ...params, page, pageSize: 100 },
      })
      const result = unwrapApiResponse(data)
      items.push(...result.items)
      hasNext = result.hasNext
      page += 1
    }

    return items
  },

  getById: async (id: string): Promise<User> => {
    const { data } = await http.get<ApiResponse<User>>(
      `/Users/${id}`,
    )

    return unwrapApiResponse(data)
  },

  create: async (input: CreateUserInput): Promise<User> => {
    const { data } = await http.post<ApiResponse<User>>(
      '/Users',
      input,
    )

    return unwrapApiResponse(data)
  },

  update: async (
    id: string,
    input: UpdateUserInput,
  ): Promise<User> => {
    const { data } = await http.put<ApiResponse<User>>(
      `/Users/${id}`,
      input,
    )

    return unwrapApiResponse(data)
  },

  remove: async (id: string): Promise<void> => {
    await http.delete(`/Users/${id}`)
  },
}
