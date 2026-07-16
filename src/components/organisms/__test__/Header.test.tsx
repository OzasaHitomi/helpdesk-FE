import { Header } from '../Header'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'

// navigateのスパイを先に定義し、react-router-domのuseNavigateのみ差し替える
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

afterEach(() => {
  vi.clearAllMocks()
})

// customRender(<Header />)
describe('Header', () => {
  describe('正常系', () => {
    it('Headerが表示されること', () => {
      customRender(<Header />)
      // 期待するものを書く
      expect(screen.getByRole('heading', { name: 'Novel HELPDESK' })).toBeInTheDocument()
    })

    it("システム名をクリックした場合、Topページ（'/'）に遷移すること", () => {
      customRender(<Header />)

      fireEvent.click(screen.getByRole('heading', { name: 'Novel HELPDESK' }))

      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })
})
