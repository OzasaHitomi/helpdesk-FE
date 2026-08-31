import { Routes, Route, Navigate } from 'react-router-dom'
import { AdminAccountContainer } from '@/features/Admin/Account/AdminAccountContainer'

export const AdminRoute = () => {
  return (
    <Routes>
      <Route path='accounts' element={<AdminAccountContainer />} />
      <Route path='*' element={<Navigate to='/404' replace />} />
    </Routes>
  )
}
