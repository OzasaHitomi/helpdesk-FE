import { Routes, Route } from 'react-router-dom'
import { BaseLayout } from '@/components/templates/BaseLayout'

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<BaseLayout />}>
        <Route path='/' element={<div>TOP PAGE</div>} />
        <Route path='*' element={<div>404 Not Found</div>} />
      </Route>
    </Routes>
  )
}
