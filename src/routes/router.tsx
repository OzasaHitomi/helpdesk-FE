import { Routes, Route } from 'react-router-dom'
import { BaseLayout } from '@/components/templates/BaseLayout'
import { LoginRoute } from './Login/base'
import { AdminRoute } from './Admin/base'
import { RootContainer } from '@/features/Root/RootContainer'
import { TicketDetailContainer } from '@/features/TicketDetail/TicketDetailContainer'
import { RequireAuth } from './RequireAuth'
import { NotFoundPage } from '@/components/pages/NotFoundPage'

export const AppRouter = () => {
  return (
    <Routes>
      <Route path='/login/*' element={<LoginRoute />} />
      {/* /login以外は全てRequireAuthで保護し、未ログイン時は/loginへ戻す */}
      <Route element={<RequireAuth />}>
        <Route element={<BaseLayout />}>
          <Route path='/' element={<RootContainer />} />
          <Route path='/tickets/:id' element={<TicketDetailContainer />} />
          <Route path='/admin/*' element={<AdminRoute />} />
          <Route path='*' element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
