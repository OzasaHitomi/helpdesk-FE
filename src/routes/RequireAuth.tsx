import { Outlet } from 'react-router-dom'

// 未ログイン時のリダイレクトなど、実際の認証判定は別タスクで実装する
export const RequireAuth = () => {
  return <Outlet />
}
