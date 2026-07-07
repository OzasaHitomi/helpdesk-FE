import { Outlet } from 'react-router-dom'
import { Header } from '@/components/organisms/Header'
import { Toaster } from '../ui/toaster'

export const BaseLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Toaster />
    </>
  )
}
