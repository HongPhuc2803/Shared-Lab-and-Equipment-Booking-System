export interface AuthUser {
  id: number
  name: string
  email: string
  role: 'Requester' | 'LabManager' | 'Admin'
}

export interface LoginPayload {
  email: string
  password: string
  role?: 'Requester' | 'LabManager' | 'Admin'
}

export interface LoginResponse {
  accessToken: string
  refreshToken?: string
  user: AuthUser
}
