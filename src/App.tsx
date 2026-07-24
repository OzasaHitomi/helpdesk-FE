import { AppRouter } from './routes/router'
import { Toaster } from './components/ui/toaster'

function App() {
  return (
    <>
      <AppRouter></AppRouter>
      <Toaster />
    </>
  )
}

export default App
