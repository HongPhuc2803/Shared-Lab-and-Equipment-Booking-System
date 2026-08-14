import { http, unwrapApiResponse, type ApiResponse } from '@/lib/api/http'
import type { CreateUserInput, UpdateUserInput, User } from './users.types'

interface PagedUsers {
  items: User[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
}

/**
 * Users API. Backend wraps every response in ApiResponse and pages the list.
 */
export const usersApi = {
  list: async (): Promise<User[]> => {
    const { data } = await http.get<ApiResponse<PagedUsers>>('/users')
    return unwrapApiResponse(data).items
  },
  get: async (id: string): Promise<User> => {
    const { data } = await http.get<ApiResponse<User>>(`/users/${id}`)
    return unwrapApiResponse(data)
  },
  create: async (input: CreateUserInput): Promise<User> => {
    const { data } = await http.post<ApiResponse<User>>('/users', input)
    return unwrapApiResponse(data)
  },
  update: async (id: string, input: UpdateUserInput): Promise<User> => {
    const { data } = await http.put<ApiResponse<User>>(`/users/${id}`, input)
    return unwrapApiResponse(data)
  },
  remove: async (id: string): Promise<void> => {
    await http.delete(`/users/${id}`)
  },
}
