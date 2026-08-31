import { Routes, Route, Navigate } from 'react-router-dom'
import { BaseLayout } from '@/components/templates/BaseLayout'
import { LoginRoute } from './Login/base'
import { AdminRoute } from './Admin/base'
import { RootContainer } from '@/features/Root/RootContainer'
import { TicketDetailContainer } from '@/features/TicketDetail/TicketDetailContainer'
import { RequireAuth } from './RequireAuth'
import { NotFoundPageContainer } from '@/features/Error/404/NotFoundPageContainer'
import { ForbiddenPageContainer } from '@/features/Error/403/ForbiddenPageContainer'

export const AppRouter = () => {
  return (
    <Routes>
      <Route path='/login/*' element={<LoginRoute />} />
      {/* /login以外は全てRequireAuthで保護し、未ログイン時は/loginへ戻す */}
      <Route element={<RequireAuth />}>
        <Route element={<BaseLayout />}>
          <Route path='/' element={<RootContainer />} />
          <Route path='/tickets/:id' element={<TicketDetailContainer />} />
          <Route element={<RequireAuth allow={['admin']} />}>
            <Route path='/admin/*' element={<AdminRoute />} />
          </Route>
          <Route path='/404' element={<NotFoundPageContainer />} />
          <Route path='/403' element={<ForbiddenPageContainer />} />
          <Route path='*' element={<Navigate to='/404' replace />} />
        </Route>
      </Route>
    </Routes>
  )
}
