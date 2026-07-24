import { BaseLayout } from '../BaseLayout'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'

// BaseLayoutがuseLogoutHandlerの結果をHeaderに正しく橋渡しできているかのみをテストする
// （Headerの見た目や入力イベントの中身はHeader.test.tsx、
//   ログアウト処理・エラー処理のロジックはuseLogoutHandler.test.tsが担保する）

const mockOnLogout = vi.fn()

vi.mock('@/share/hooks/handlers/useLogoutHandler', () => ({
  useLogoutHandler: () => ({
    data: { isLoggingOut: false },
    handlers: { onLogout: mockOnLogout },
  }),
}))

// Header自体の見た目はテスト対象外のため、受け取ったPropsをそのまま画面に出すダミーにする
vi.mock('@/components/organisms/Header', () => ({
  Header: ({
    data,
    handlers,
  }: {
    data: { isLoggingOut: boolean }
    handlers: { onLogout: () => Promise<void> }
  }) => (
    <div data-testid='mock-header'>
      <span data-testid='is-logging-out'>{String(data.isLoggingOut)}</span>
      <button
        onClick={() => {
          void handlers.onLogout()
        }}
      >
        logout
      </button>
    </div>
  ),
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    Outlet: () => <div data-testid='mock-outlet' />,
  }
})

// ------------------------------------------------------------------

describe('BaseLayout', () => {
  describe('正常系', () => {
    it('Headerが表示されること', () => {
      customRender(<BaseLayout />)
      expect(screen.getByTestId('mock-header')).toBeInTheDocument()
    })

    it('Outletが表示されること', () => {
      customRender(<BaseLayout />)
      expect(screen.getByTestId('mock-outlet')).toBeInTheDocument()
    })

    it('BaseLayoutがuseLogoutHandlerのdataをHeaderにそのまま渡すこと', () => {
      customRender(<BaseLayout />)
      expect(screen.getByTestId('is-logging-out')).toHaveTextContent('false')
    })

    it('BaseLayoutがuseLogoutHandlerのonLogoutをHeaderにそのまま渡すこと', () => {
      customRender(<BaseLayout />)
      fireEvent.click(screen.getByText('logout'))
      expect(mockOnLogout).toHaveBeenCalled()
    })
  })
})
