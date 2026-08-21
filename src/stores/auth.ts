import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { authApi } from '@/features/auth/auth.api'
import type { AuthUser, LoginPayload, RegisterPayload } from '@/features/auth/auth.types'
import { ApiError } from '@/lib/api/http'
import { tokenStorage } from '@/lib/api/token-storage'

const USER_KEY = 'auth.user'

function readStoredUser(): AuthUser | null {
  try {
    const value = localStorage.getItem(USER_KEY)
    return value ? (JSON.parse(value) as AuthUser) : null
  } catch {
    localStorage.removeItem(USER_KEY)
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(readStoredUser())
  const status = ref<'idle' | 'loading' | 'error'>('idle')
  const error = ref<string | null>(null)
  const isAuthenticated = computed(
    () => user.value !== null && Boolean(tokenStorage.getAccess() || tokenStorage.getRefresh()),
  )

  async function login(payload: LoginPayload) {
    status.value = 'loading'
    error.value = null
    try {
      const session = await authApi.login(payload)
      tokenStorage.set(session.accessToken, session.refreshToken)
      user.value = session.user
      localStorage.setItem(USER_KEY, JSON.stringify(session.user))
      status.value = 'idle'
      return session.user
    } catch (exception) {
      status.value = 'error'
      error.value =
        exception instanceof ApiError && exception.status === 401
          ? 'Tài khoản hoặc mật khẩu không chính xác.'
          : exception instanceof Error
            ? exception.message
            : 'Đăng nhập thất bại.'
      throw exception
    }
  }

  async function register(payload: RegisterPayload) {
    status.value = 'loading'
    error.value = null
    try {
      const registeredUser = await authApi.register(payload)
      status.value = 'idle'
      return registeredUser
    } catch (exception) {
      status.value = 'error'
      error.value = exception instanceof Error ? exception.message : 'Đăng ký thất bại.'
      throw exception
    }
  }

  async function logout() {
    const refreshToken = tokenStorage.getRefresh()
    try {
      if (refreshToken && tokenStorage.getAccess()) await authApi.logout(refreshToken)
    } finally {
      tokenStorage.clear()
      localStorage.removeItem(USER_KEY)
      user.value = null
      status.value = 'idle'
      error.value = null
    }
  }

  function clearSession() {
    tokenStorage.clear()
    localStorage.removeItem(USER_KEY)
    user.value = null
    status.value = 'idle'
    error.value = null
  }

  return { user, status, error, isAuthenticated, login, register, logout, clearSession }
})
