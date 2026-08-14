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
