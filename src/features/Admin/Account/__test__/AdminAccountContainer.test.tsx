import { AdminAccountContainer } from '../AdminAccountContainer'
import { AdminAccountPresentational } from '../AdminAccountPresentational'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { screen } from '@testing-library/react'
import { type AccountItemView } from '../types/AccountItemView'
import { type GetMeResponse } from '@/services/internal/backend/v1/types/response/auth'

// AdminAccountContainerがuseMeQuery/useGetUsersHandler/useActivateAccountHandler/
// useDeactivateAccountHandler/useCreateAccountHandlerの結果をAdminAccountPresentationalに
// 正しく橋渡しできているかのみをテストする
// （表示内容自体はAdminAccountPresentational.test.tsx、ロジックは各handlerのtest.tsが担保する）

const {
  mockUseMeQuery,
  mockUseGetUsersHandler,
  mockUseActivateAccountHandler,
  mockUseDeactivateAccountHandler,
} = vi.hoisted(() => ({
  mockUseMeQuery: vi.fn(),
  mockUseGetUsersHandler: vi.fn(),
  mockUseActivateAccountHandler: vi.fn(),
  mockUseDeactivateAccountHandler: vi.fn(),
}))

const mockOnSubmitAccount = vi.fn()
const mockSetAccountForm = vi.fn()
const mockOnOpenDialog = vi.fn()
const mockOnCloseDialog = vi.fn()

vi.mock('@/share/hooks/queries/useMeQuery', () => ({
  useMeQuery: mockUseMeQuery,
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

vi.mock('../hooks/handlers/useCreateAccountHandler', () => ({
  useCreateAccountHandler: () => ({
    data: {
      accountForm: { name: '', email: '', password: '', role: '' },
      isDialogOpen: false,
      fieldErrors: {},
    },
    uiState: { isSubmitting: false },
    handlers: {
      onSubmitAccount: mockOnSubmitAccount,
      setAccountForm: mockSetAccountForm,
      onOpenDialog: mockOnOpenDialog,
      onCloseDialog: mockOnCloseDialog,
    },
  }),
}))

vi.mock('../AdminAccountPresentational', () => ({
  AdminAccountPresentational: vi.fn(() => <div data-testid='mocked-account-presentational' />),
}))

const mockAdminAccountPresentational = vi.mocked(AdminAccountPresentational)

const mockMeData: GetMeResponse = { id: 1, role: 'admin' }

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
      mockUseMeQuery.mockReturnValue({ data: mockMeData })
      mockUseGetUsersHandler.mockReturnValue({
        data: { accounts: mockAccounts },
        uiState: { isFetching: false, isError: false },
      })
      mockUseActivateAccountHandler.mockReturnValue(mockActivate)
      mockUseDeactivateAccountHandler.mockReturnValue(mockDeactivate)

      customRender(<AdminAccountContainer />)

      expect(screen.getByTestId('mocked-account-presentational')).toBeInTheDocument()
    })

    it('useMeQueryのroleをPresentationalにそのまま渡すこと', () => {
      mockUseMeQuery.mockReturnValue({ data: mockMeData })
      mockUseGetUsersHandler.mockReturnValue({
        data: { accounts: mockAccounts },
        uiState: { isFetching: false, isError: false },
      })
      mockUseActivateAccountHandler.mockReturnValue(mockActivate)
      mockUseDeactivateAccountHandler.mockReturnValue(mockDeactivate)

      customRender(<AdminAccountContainer />)

      expect(mockAdminAccountPresentational.mock.calls[0]?.[0].data.role).toBe('admin')
    })

    it('useMeQueryのdataが未取得の場合、roleがundefinedのままPresentationalに渡すこと', () => {
      mockUseMeQuery.mockReturnValue({ data: undefined })
      mockUseGetUsersHandler.mockReturnValue({
        data: { accounts: mockAccounts },
        uiState: { isFetching: false, isError: false },
      })
      mockUseActivateAccountHandler.mockReturnValue(mockActivate)
      mockUseDeactivateAccountHandler.mockReturnValue(mockDeactivate)

      customRender(<AdminAccountContainer />)

      expect(mockAdminAccountPresentational.mock.calls[0]?.[0].data.role).toBeUndefined()
    })

    it('useGetUsersHandlerのaccounts、useActivateAccountHandler/useDeactivateAccountHandlerの結果をPresentationalにそのまま渡すこと', () => {
      mockUseMeQuery.mockReturnValue({ data: mockMeData })
      mockUseGetUsersHandler.mockReturnValue({
        data: { accounts: mockAccounts },
        uiState: { isFetching: false, isError: false },
      })
      mockUseActivateAccountHandler.mockReturnValue(mockActivate)
      mockUseDeactivateAccountHandler.mockReturnValue(mockDeactivate)

      customRender(<AdminAccountContainer />)

      expect(mockAdminAccountPresentational).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { accounts: mockAccounts, role: 'admin' },
          activate: mockActivate,
          deactivate: mockDeactivate,
        }),
        undefined,
      )
    })

    it('useCreateAccountHandlerの結果をcreateとしてPresentationalにそのまま渡すこと', () => {
      mockUseMeQuery.mockReturnValue({ data: mockMeData })
      mockUseGetUsersHandler.mockReturnValue({
        data: { accounts: mockAccounts },
        uiState: { isFetching: false, isError: false },
      })
      mockUseActivateAccountHandler.mockReturnValue(mockActivate)
      mockUseDeactivateAccountHandler.mockReturnValue(mockDeactivate)

      customRender(<AdminAccountContainer />)

      expect(mockAdminAccountPresentational).toHaveBeenCalledWith(
        expect.objectContaining({
          create: {
            data: {
              accountForm: { name: '', email: '', password: '', role: '' },
              isDialogOpen: false,
              fieldErrors: {},
            },
            uiState: { isSubmitting: false },
            handlers: {
              onSubmitAccount: mockOnSubmitAccount,
              setAccountForm: mockSetAccountForm,
              onOpenDialog: mockOnOpenDialog,
              onCloseDialog: mockOnCloseDialog,
            },
          },
        }),
        undefined,
      )
    })
  })
})
