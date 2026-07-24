import { BaseLayout } from '../BaseLayout'
import { Header } from '@/components/organisms/Header'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'

// BaseLayoutがuseLogoutHandlerの結果をHeaderに正しく橋渡しできているかのみをテストする
// （Headerの見た目や入力イベントの中身はHeader.test.tsx、
//   ログアウト処理・エラー処理のロジックはuseLogoutHandler.test.tsが担保する）

const mockOnLogout = vi.fn()

vi.mock('../hooks/handlers/useLogoutHandler', () => ({
  useLogoutHandler: () => ({
    data: { isLoggingOut: false },
    handlers: { onLogout: mockOnLogout },
  }),
}))

// Header自体の見た目はテスト対象外のため、受け取ったPropsのみ検証できればよい
vi.mock('@/components/organisms/Header', () => ({
  Header: vi.fn(() => null),
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    Outlet: () => <div data-testid='mock-outlet' />,
  }
})

const mockHeader = vi.mocked(Header)

// ------------------------------------------------------------------

describe('BaseLayout', () => {
  describe('正常系', () => {
    it('Outletが表示されること', () => {
      customRender(<BaseLayout />)
      expect(screen.getByTestId('mock-outlet')).toBeInTheDocument()
    })

    it('BaseLayoutがuseLogoutHandlerのdataをHeaderにそのまま渡すこと', () => {
      customRender(<BaseLayout />)
      expect(mockHeader).toHaveBeenCalledWith(
        expect.objectContaining({ data: { isLoggingOut: false } }),
        undefined,
      )
    })

    it('BaseLayoutがuseLogoutHandlerのonLogoutをHeaderにそのまま渡すこと', () => {
      customRender(<BaseLayout />)
      expect(mockHeader).toHaveBeenCalledWith(
        expect.objectContaining({ handlers: { onLogout: mockOnLogout } }),
        undefined,
      )
    })
  })
})
