import { type UserRole } from '@/share/types/userRole'

// GET /auth/me のレスポンス型。ログイン中のユーザー情報（id・role）が返る
export type GetMeResponse = {
  id: number
  role: UserRole
}
