import { AdminAccountContainer } from '../AdminAccountContainer'
import { AdminAccountPresentational } from '../AdminAccountPresentational'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { screen } from '@testing-library/react'
import { type AccountItemView } from '../types/AccountItemView'

// AdminAccountContainerがuseGetUsersHandlerの結果をAdminAccountPresentationalに正しく橋渡しできているかのみをテストする
// （表示内容自体はAdminAccountPresentational.test.tsx、ロジックはuseGetUsersHandler.test.tsが担保する）

const { mockUseGetUsersHandler } = vi.hoisted(() => ({
  mockUseGetUsersHandler: vi.fn(),
}))

vi.mock('../hooks/handlers/useGetUsersHandler', () => ({
  useGetUsersHandler: mockUseGetUsersHandler,
}))

vi.mock('../AdminAccountPresentational', () => ({
  AdminAccountPresentational: vi.fn(() => <div data-testid='mocked-account-presentational' />),
}))

const mockAdminAccountPresentational = vi.mocked(AdminAccountPresentational)

const mockAccounts: AccountItemView[] = [
  { id: 1, name: '山田太郎', email: 'yamada@example.com', role: 'employee', isActive: true },
]

describe('AdminAccountContainer', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('正常系', () => {
    it('ContainerがPresentationalを表示すること', () => {
      mockUseGetUsersHandler.mockReturnValue({
        data: { accounts: mockAccounts },
        uiState: { isFetching: false, isError: false },
      })

      customRender(<AdminAccountContainer />)

      expect(screen.getByTestId('mocked-account-presentational')).toBeInTheDocument()
    })

    it('useGetUsersHandlerのaccountsをPresentationalにそのまま渡すこと', () => {
      mockUseGetUsersHandler.mockReturnValue({
        data: { accounts: mockAccounts },
        uiState: { isFetching: false, isError: false },
      })

      customRender(<AdminAccountContainer />)

      expect(mockAdminAccountPresentational).toHaveBeenCalledWith(
        { data: { accounts: mockAccounts } },
        undefined,
      )
    })
  })
})
