import { type UserRole } from '@/share/types/userRole'

// POST /admin/users に送るリクエストボディの型
export type CreateUserRequest = {
  name: string
  email: string
  password: string
  role: UserRole
}
