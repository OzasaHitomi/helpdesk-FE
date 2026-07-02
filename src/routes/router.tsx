import { Routes, Route } from 'react-router-dom'

export const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<div>TOP PAGE</div>} />
      <Route path='*' element={<div>404 Not Found</div>} />
    </Routes>
  )
}


