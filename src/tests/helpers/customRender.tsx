import { render } from '@testing-library/react'
import { CustomRenderProvider } from '@/tests/providers/customRenderProvider'

export const customRender = (ui: React.ReactElement) => {
  return render(<CustomRenderProvider>{ui}</CustomRenderProvider>)
}
