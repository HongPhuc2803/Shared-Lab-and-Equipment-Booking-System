export interface User {
  id: string
  fullName: string
  email: string
  role: string
  status: string
  createdAt: string
}

export interface UserQuery {
  page?: number
  pageSize?: number
  role?: number
  status?: number
  departmentId?: string
  keyword?: string
}

export interface UserListResult {
  items: User[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
}

export interface CreateUserInput {
  fullName: string
  email: string
  password: string
  role: number
  departmentId?: string | null
}

export interface UpdateUserInput {
  fullName: string
  role: number
  status: number
  departmentId?: string | null
}
