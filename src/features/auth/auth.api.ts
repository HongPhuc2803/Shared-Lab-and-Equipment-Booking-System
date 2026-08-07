import { http, unwrapApiResponse, type ApiResponse } from '@/lib/api/http'
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from './auth.types'

export const authApi = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await http.post<ApiResponse<LoginResponse>>('/auth/login', payload)
    return unwrapApiResponse(data)
  },

  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const { data } = await http.post<ApiResponse<RegisterResponse>>('/auth/register', payload)
    return unwrapApiResponse(data)
  },

  async logout(refreshToken: string): Promise<void> {
    await http.post<ApiResponse<null>>('/auth/logout', { refreshToken })
  },
}
