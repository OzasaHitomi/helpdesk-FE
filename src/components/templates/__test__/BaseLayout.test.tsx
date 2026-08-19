import { BaseLayout } from '../BaseLayout'
import { Header } from '@/components/organisms/Header'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen } from '@testing-library/react'
import { type GetMeResponse } from '@/services/internal/backend/v1/types/response/auth'

// BaseLayoutがuseMeQuery・useLogoutHandlerの結果をHeaderに正しく橋渡しできているかのみをテストする
// （Headerの見た目や入力イベントの中身はHeader.test.tsx、
//   ログアウト処理・エラー処理のロジックはuseLogoutHandler.test.tsが担保する）

const mockOnLogout = vi.fn()

const { mockUseMeQuery } = vi.hoisted(() => ({
  mockUseMeQuery: vi.fn(),
}))

vi.mock('@/share/hooks/queries/useMeQuery', () => ({
  useMeQuery: mockUseMeQuery,
}))

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

const mockMeData: GetMeResponse = { id: 1, role: 'admin' }

// ------------------------------------------------------------------

describe('BaseLayout', () => {
  beforeEach(() => {
    mockUseMeQuery.mockReturnValue({ data: mockMeData })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('正常系', () => {
    it('Outletが表示されること', () => {
      customRender(<BaseLayout />)
      expect(screen.getByTestId('mock-outlet')).toBeInTheDocument()
    })

    it('BaseLayoutがuseMeQueryのroleをHeaderにそのまま渡すこと', () => {
      customRender(<BaseLayout />)
      expect(mockHeader.mock.calls[0]?.[0].data.role).toBe('admin')
    })

    it('useMeQueryのdataが未取得の場合、roleがundefinedのままHeaderに渡すこと', () => {
      mockUseMeQuery.mockReturnValue({ data: undefined })
      customRender(<BaseLayout />)
      expect(mockHeader.mock.calls[0]?.[0].data.role).toBeUndefined()
    })

    it('BaseLayoutがuseLogoutHandlerのdataをHeaderにそのまま渡すこと', () => {
      customRender(<BaseLayout />)
      expect(mockHeader.mock.calls[0]?.[0].data.isLoggingOut).toBe(false)
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
