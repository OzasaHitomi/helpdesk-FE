import { type UserRole } from '@/share/types/userRole'

// Record<K, V>: キーがK型、値がV型のオブジェクトを表す型。UserRoleの全パターンを網羅しないとエラーになる
const UserRoleJaMap: Record<UserRole, string> = {
  employee: '社員',
  support: 'サポート担当',
  admin: '管理者',
}

// 渡された文字列がUserRoleの値として妥当かどうかを判定する
const isUserRole = (role: string): role is UserRole => role in UserRoleJaMap

// UserRoleの値を日本語表示用の文字列に変換する(不正な値の場合は空文字を返す)
export const transformUserRoleToJa = (role: string): string =>
  isUserRole(role) ? UserRoleJaMap[role] : ''
