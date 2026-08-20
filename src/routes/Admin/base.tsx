import { Routes, Route } from 'react-router-dom'
import { AccountContainer } from '@/features/Admin/Account/AccountContainer'
import { RootContainer } from '@/features/Root/RootContainer'

export const AdminRoute = () => {
  return (
    <Routes>
      <Route path='accounts/*' element={<AccountContainer />} />
      <Route path='*' element={<RootContainer />} />
    </Routes>
  )
}
