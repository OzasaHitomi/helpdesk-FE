import { Navigate, Outlet } from 'react-router-dom'
import { useMeQuery } from '@/share/hooks/queries/useMeQuery'
import { LoadingPage } from '@/components/pages/LoadingPage'

// 配下のルートを表示する前に、GET /auth/meでセッション（Cookie）が有効か確認するゲート役
// 有効なら配下の画面（Outlet）を表示し、無効（401）なら/loginへリダイレクトする
export const RequireAuth = () => {
  const { isLoading, isError } = useMeQuery()

  // 確認中はローディング画面を表示する（配下の画面が一瞬映ってしまうのを防ぐ）
  if (isLoading) {
    return <LoadingPage />
  }

  if (isError) {
    return <Navigate to='/login' replace />
  }

  return <Outlet />
}
