import { Routes, Route } from 'react-router-dom'
import { BaseLayout } from '@/components/templates/BaseLayout'
import { LoginRoute } from './Login/base'
import { RootContainer } from '@/features/Root/RootContainer'
import { RequireAuth } from './RequireAuth'

export const AppRouter = () => {
  return (
    <Routes>
      <Route path='/login/*' element={<LoginRoute />} />
      {/* /login以外は全てRequireAuthで保護し、未ログイン時は/loginへ戻す */}
      <Route element={<RequireAuth />}>
        <Route element={<BaseLayout />}>
          <Route path='/' element={<RootContainer />} />
          <Route path='*' element={<div>404 Not Found</div>} />
        </Route>
      </Route>
    </Routes>
  )
}
