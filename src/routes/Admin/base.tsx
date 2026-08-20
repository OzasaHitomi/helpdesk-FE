import { Routes, Route } from 'react-router-dom'
import { AdminAccountContainer } from '@/features/Admin/Account/AdminAccountContainer'
import { RootContainer } from '@/features/Root/RootContainer'

export const AdminRoute = () => {
  return (
    <Routes>
      <Route path='accounts/*' element={<AdminAccountContainer />} />
      <Route path='*' element={<RootContainer />} />
    </Routes>
  )
}
