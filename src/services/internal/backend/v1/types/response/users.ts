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

// PUT /admin/users/{id}/deactivate のレスポンス型
export type DeactivateUserResponse = {
  id: number
  name: string
  email: string
  role: UserRole
  isActive: boolean
}
