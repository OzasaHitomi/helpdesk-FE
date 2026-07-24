import { Header } from '../Header'
import { customRender } from '@/tests/helpers/customRender'
import { SYSTEM_NAME } from '@/share/constants/business/systemName'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'

// Headerが受け取ったdata/handlersを正しく表示・呼び出しできるかのみをテストする
// （ログアウト自体のロジックはuseLogoutHandler.test.tsが担保する）
const mockOnLogout = vi.fn()

describe('Header', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('正常系', () => {
    it('Headerが表示されること', () => {
      customRender(<Header data={{ isLoggingOut: false }} handlers={{ onLogout: mockOnLogout }} />)
      // 期待するものを書く
      expect(screen.getByRole('heading', { name: SYSTEM_NAME })).toBeInTheDocument()
    })

    it('システム名のリンク先がTopページ（/）であること', () => {
      customRender(<Header data={{ isLoggingOut: false }} handlers={{ onLogout: mockOnLogout }} />)
      expect(screen.getByRole('link', { name: SYSTEM_NAME })).toHaveAttribute('href', '/')
    })

    it('Ticketが表示されること', () => {
      customRender(<Header data={{ isLoggingOut: false }} handlers={{ onLogout: mockOnLogout }} />)
      expect(screen.getByText('Ticket')).toBeInTheDocument()
    })

    it('Ticketのリンク先がTopページ（/）であること', () => {
      customRender(<Header data={{ isLoggingOut: false }} handlers={{ onLogout: mockOnLogout }} />)
      expect(screen.getByRole('link', { name: 'Ticket' })).toHaveAttribute('href', '/')
    })

    it('Logoutが表示されること', () => {
      customRender(<Header data={{ isLoggingOut: false }} handlers={{ onLogout: mockOnLogout }} />)
      expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument()
    })

    it('LogoutをクリックするとハンドラーのonLogoutが呼ばれること', () => {
      customRender(<Header data={{ isLoggingOut: false }} handlers={{ onLogout: mockOnLogout }} />)
      fireEvent.click(screen.getByRole('button', { name: 'Logout' }))
      expect(mockOnLogout).toHaveBeenCalled()
    })

    it('isLoggingOutがtrueの場合、Logoutボタンが無効化されること', () => {
      customRender(<Header data={{ isLoggingOut: true }} handlers={{ onLogout: mockOnLogout }} />)
      expect(screen.getByRole('button', { name: 'Logout' })).toBeDisabled()
    })
  })
})
