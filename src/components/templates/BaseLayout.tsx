import { Outlet } from 'react-router-dom'
import { Header } from '@/components/organisms/Header'
import { useLogoutHandler } from '@/share/hooks/handlers/useLogoutHandler'

export const BaseLayout = () => {
  const { data, handlers } = useLogoutHandler()

  return (
    <>
      <Header
        data={{ isLoggingOut: data.isLoggingOut }}
        handlers={{ onLogout: handlers.onLogout }}
      />
      <Outlet />
    </>
  )
}
