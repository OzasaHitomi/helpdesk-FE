import { type UserRole } from '@/share/types/userRole'

// FEが使いやすいような型定義
// サービス層のレスポンス型(GetUsersResponseItem)をUI層が直接参照しないよう、
// 画面表示に必要な項目だけを持つView用の型として分離しておく
export type AccountItemView = {
  id: number
  name: string
  email: string
  role: UserRole
  isActive: boolean
}
