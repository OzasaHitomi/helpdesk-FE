import { type UserRole } from '@/share/types/userRole'

// アカウント発行時にBEが許可しているアカウント種別（'admin'は発行不可のため含まない）
// 種別選択のプルダウンをmapで並べるための値の実体を持ったリスト
export const CreatableUserRoleList = ['employee', 'support'] as const satisfies readonly UserRole[]

// UserRoleの一部（adminを除いたサブセット）を表す型なので手書きせず、
// 配列(CreatableUserRoleList)の方を真実の源とし、そこから型を導出してズレを防ぐ
export type CreatableUserRole = (typeof CreatableUserRoleList)[number]
