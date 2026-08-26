import { type UserRole } from '@/share/types/userRole'

// GET /admin/users のレスポンス型（Itemは配列の1要素）
// BE(Pydantic)はalias_generator=to_camelでcamelCaseとして返すため、FEもcamelCaseで受け取る
export type GetUsersResponseItem = {
  id: number
  name: string
  email: string
  role: UserRole
  isActive: boolean
}

// POST /admin/users のレスポンス型（発行されたアカウントの内容を返す）
export type CreateUserResponse = {
  id: number
  name: string
  email: string
  role: UserRole
  isActive: boolean
}
