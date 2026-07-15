import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginContainer } from '@/features/Login/Root/LoginContainer'

export const LoginRoute = () => {
  return (
    <Routes>
      <Route path='' element={<LoginContainer />} />
      <Route path='*' element={<Navigate to='/login' replace />} />
    </Routes>
  )
}
