import { Outlet } from 'react-router-dom'
import { Container } from '@chakra-ui/react'
import { Header } from '@/components/organisms/Header'
import { useMeQuery } from '@/share/hooks/queries/useMeQuery'
import { useLogoutHandler } from './hooks/handlers/useLogoutHandler'

export const BaseLayout = () => {
  const { data: meData } = useMeQuery()
  const { data, handlers } = useLogoutHandler()

  return (
    <>
      <Header
        data={{ role: meData?.role, isLoggingOut: data.isLoggingOut }}
        handlers={{ onLogout: handlers.onLogout }}
      />
      {/* 保護された各ページの中身が、Header(@/components/organisms/Header)のContainerより
          横幅が広くならないよう、同じmaxW・左右paddingを指定して幅を揃える */}
      <Container maxW={'8xl'} px={{ base: 4, sm: 6, md: 12, lg: 20, xl: 32 }} py={8}>
        <Outlet />
      </Container>
    </>
  )
}
