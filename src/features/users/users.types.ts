export type UserRole = 'Admin' | 'LabManager' | 'Requester'
export type UserStatus = 'Active' | 'Restricted' | 'Disabled'

export interface User {
  id: string
  fullName: string
  email: string
  role: UserRole
  status: UserStatus
  createdAt: string
}

export interface CreateUserInput {
  fullName: string
  email: string
  password: string
  role: UserRole
}

export interface UpdateUserInput {
  fullName: string
  role: UserRole
  status: UserStatus
}
