import { Routes, Route } from 'react-router-dom'
import { BaseLayout } from '@/components/templates/BaseLayout'
import { LoginRoute } from './Login/base'
import { RequireAuth } from './RequireAuth'
import { RootContainer } from '@/features/Root/RootContainer'

export const AppRouter = () => {
  return (
    <Routes>
      <Route path='/login/*' element={<LoginRoute />} />
      <Route element={<RequireAuth />}>
        <Route element={<BaseLayout />}>
          <Route path='/' element={<RootContainer />} />
          <Route path='*' element={<div>404 Not Found</div>} />
        </Route>
      </Route>
    </Routes>
  )
}
