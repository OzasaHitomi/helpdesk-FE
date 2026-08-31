import { Navigate, Outlet } from 'react-router-dom'
import { useMeQuery } from '@/share/hooks/queries/useMeQuery'
import { LoadingPage } from '@/components/pages/LoadingPage'
import type { UserRole } from '@/share/types/userRole'

interface RequireAuthProps {
  allow?: UserRole[]
}

// 配下のルートを表示する前に、GET /auth/meでセッション（Cookie）が有効か確認するゲート役
// 有効なら配下の画面（Outlet）を表示し、無効（401）なら/loginへリダイレクトする
// allowを指定した場合は、ログイン済みユーザーのroleがallowに含まれるかも確認し、含まれなければ/403へリダイレクトする
export const RequireAuth = ({ allow }: RequireAuthProps) => {
  const { data, isLoading, isError } = useMeQuery()

  // 確認中はローディング画面を表示する（配下の画面が一瞬映ってしまうのを防ぐ）
  if (isLoading) {
    return <LoadingPage />
  }

  if (isError) {
    return <Navigate to='/login' replace />
  }

  // allow指定があるのに、ユーザー情報が未取得 or roleがallowに含まれない場合は権限外
  if (allow && (!data || !allow.includes(data.role))) {
    return <Navigate to='/403' replace />
  }

  return <Outlet />
}
