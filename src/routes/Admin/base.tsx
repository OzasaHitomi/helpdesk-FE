import { Routes, Route } from 'react-router-dom'
import { AdminAccountContainer } from '@/features/Admin/Account/AdminAccountContainer'
import { NotFoundPage } from '@/components/pages/NotFoundPage'

export const AdminRoute = () => {
  return (
    <Routes>
      <Route path='accounts' element={<AdminAccountContainer />} />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  )
}
