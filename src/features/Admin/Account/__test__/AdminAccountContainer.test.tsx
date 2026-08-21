import { AdminAccountContainer } from '../AdminAccountContainer'
import { AdminAccountPresentational } from '../AdminAccountPresentational'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { screen } from '@testing-library/react'
import { type AccountItemView } from '../types/AccountItemView'

// AdminAccountContainerがuseGetUsersHandlerの結果をAdminAccountPresentationalに正しく橋渡しできているかのみをテストする
// （表示内容自体はAdminAccountPresentational.test.tsx、ロジックはuseGetUsersHandler.test.tsが担保する）

const { mockUseGetUsersHandler, mockUseActivateAccountHandler, mockUseDeactivateAccountHandler } =
  vi.hoisted(() => ({
    mockUseGetUsersHandler: vi.fn(),
    mockUseActivateAccountHandler: vi.fn(),
    mockUseDeactivateAccountHandler: vi.fn(),
  }))

vi.mock('../hooks/handlers/useGetUsersHandler', () => ({
  useGetUsersHandler: mockUseGetUsersHandler,
}))

vi.mock('../hooks/handlers/useActivateAccountHandler', () => ({
  useActivateAccountHandler: mockUseActivateAccountHandler,
}))

vi.mock('../hooks/handlers/useDeactivateAccountHandler', () => ({
  useDeactivateAccountHandler: mockUseDeactivateAccountHandler,
}))

vi.mock('../AdminAccountPresentational', () => ({
  AdminAccountPresentational: vi.fn(() => <div data-testid='mocked-account-presentational' />),
}))

const mockAdminAccountPresentational = vi.mocked(AdminAccountPresentational)

const mockAccounts: AccountItemView[] = [
  { id: 1, name: '山田太郎', email: 'yamada@example.com', role: 'employee', isActive: true },
]

const mockActivate = {
  uiState: { isSubmitting: false },
  handlers: { onClick: vi.fn() },
}

const mockDeactivate = {
  uiState: { isSubmitting: false },
  handlers: { onClick: vi.fn() },
}

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
      mockUseActivateAccountHandler.mockReturnValue(mockActivate)
      mockUseDeactivateAccountHandler.mockReturnValue(mockDeactivate)

      customRender(<AdminAccountContainer />)

      expect(screen.getByTestId('mocked-account-presentational')).toBeInTheDocument()
    })

    it('useGetUsersHandlerのaccounts、useActivateAccountHandler/useDeactivateAccountHandlerの結果をPresentationalにそのまま渡すこと', () => {
      mockUseGetUsersHandler.mockReturnValue({
        data: { accounts: mockAccounts },
        uiState: { isFetching: false, isError: false },
      })
      mockUseActivateAccountHandler.mockReturnValue(mockActivate)
      mockUseDeactivateAccountHandler.mockReturnValue(mockDeactivate)

      customRender(<AdminAccountContainer />)

      expect(mockAdminAccountPresentational).toHaveBeenCalledWith(
        {
          data: { accounts: mockAccounts },
          activate: mockActivate,
          deactivate: mockDeactivate,
        },
        undefined,
      )
    })
  })
})
