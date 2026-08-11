import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { env } from '@/config/env'
import type { LoginResponse } from '@/features/auth/auth.types'
import { tokenStorage } from './token-storage'

export interface ApiResponse<T> {
  statusCode: number
  isSuccess: boolean
  errorMessages: string[]
  result: T | null
}

export class ApiError extends Error {
  readonly status: number
  readonly messages: string[]

  constructor(status: number, messages: string[] = []) {
    super(messages[0] ?? `Yêu cầu thất bại (${status || 'không thể kết nối máy chủ'}).`)
    this.name = 'ApiError'
    this.status = status
    this.messages = messages
  }
}

export function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.isSuccess || response.result === null) {
    throw new ApiError(response.statusCode, response.errorMessages)
  }
  return response.result
}

export const http: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.getAccess()
  if (token) config.headers.set('Authorization', `Bearer ${token}`)
  return config
})

let refreshing: Promise<void> | null = null

async function refreshSession(): Promise<void> {
  const refreshToken = tokenStorage.getRefresh()
  if (!refreshToken) throw new Error('No refresh token')

  const { data } = await axios.post<ApiResponse<LoginResponse>>(
    `${env.apiBaseUrl}/auth/refresh`,
    { refreshToken },
    { timeout: 15_000 },
  )
  const session = unwrapApiResponse(data)
  tokenStorage.set(session.accessToken, session.refreshToken)
}

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined
    const isAuthRequest = original?.url?.startsWith('/auth/') ?? false

    if (
      error.response?.status === 401 &&
      original &&
      !original._retried &&
      !isAuthRequest &&
      tokenStorage.getRefresh()
    ) {
      original._retried = true
      try {
        refreshing ??= refreshSession().finally(() => (refreshing = null))
        await refreshing
        return http(original)
      } catch {
        tokenStorage.clear()
        window.dispatchEvent(new CustomEvent('auth:logout'))
      }
    }

    const body = error.response?.data
    throw new ApiError(
      error.response?.status ?? 0,
      body?.errorMessages ?? [error.message || 'Không thể kết nối đến máy chủ.'],
    )
  },
)
