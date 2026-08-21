export type UserRole = 'Requester' | 'LabManager' | 'Admin'

export interface AuthUser {
  id: string
  fullName: string
  email: string
  role: UserRole
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  fullName: string
  email: string
  password: string
  departmentId?: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: AuthUser
}

export interface RegisterResponse extends AuthUser {
  status: string
  createdAt: string
}
