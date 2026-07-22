import { Navigate, Outlet } from 'react-router-dom'
import { useMeQuery } from '@/features/Auth/hooks/queries/useMeQuery'

// 配下のルートを表示する前に、GET /auth/meでセッション（Cookie）が有効か確認するゲート役
// 有効なら配下の画面（Outlet）を表示し、無効（401）なら/loginへリダイレクトする
export const RequireAuth = () => {
  const { isLoading, isError } = useMeQuery()

  // 確認中は何も表示しない（配下の画面が一瞬映ってしまうのを防ぐ）
  if (isLoading) {
    return null
  }

  if (isError) {
    return <Navigate to='/login' replace />
  }

  return <Outlet />
}
