import { RootContainer } from '../RootContainer'
import { RootPresentational } from '../RootPresentational'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { screen } from '@testing-library/react'
import { type GetMeResponse } from '@/services/internal/backend/v1/types/response/auth'

// RootContainerがuseMeQuery/useCreateTicketHandlerの結果をRootPresentationalに正しく橋渡しできているかのみをテストする
// （表示内容自体はRootPresentational.test.tsx、ロジックはuseCreateTicketHandler.test.ts/useMeQuery.test.tsが担保する）

const { mockUseMeQuery } = vi.hoisted(() => ({
  mockUseMeQuery: vi.fn(),
}))

const mockOnSubmitTicket = vi.fn()
const mockSetTicketForm = vi.fn()
const mockOnOpenDialog = vi.fn()
const mockOnCloseDialog = vi.fn()

vi.mock('@/share/hooks/queries/useMeQuery', () => ({
  useMeQuery: mockUseMeQuery,
}))

vi.mock('../hooks/handlers/useCreateTicketHandler', () => ({
  useCreateTicketHandler: () => ({
    data: {
      ticketForm: { title: '', detail: '', visibility: 'private' },
      isDialogOpen: false,
      errorMessage: null,
    },
    uiState: { isSubmitting: false },
    handlers: {
      onSubmitTicket: mockOnSubmitTicket,
      setTicketForm: mockSetTicketForm,
      onOpenDialog: mockOnOpenDialog,
      onCloseDialog: mockOnCloseDialog,
    },
  }),
}))

// RootPresentational自体の見た目はテスト対象外のため、受け取ったPropsのみ検証できればよい
vi.mock('../RootPresentational', () => ({
  RootPresentational: vi.fn(() => <div data-testid='mocked-root-presentational' />),
}))

const mockRootPresentational = vi.mocked(RootPresentational)

const mockMeData: GetMeResponse = { id: 1, role: 'employee' }

describe('RootContainer', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  // Container層は「橋渡し」しかしないため、正常系のみで異常系(準正常系)は無い
  // ── 正常系 ────────────────────────────────────────────────────────────────
  describe('正常系', () => {
    it('ContainerがPresentationalを表示すること', () => {
      mockUseMeQuery.mockReturnValue({ data: mockMeData })
      customRender(<RootContainer />)
      expect(screen.getByTestId('mocked-root-presentational')).toBeInTheDocument()
    })

    it('useMeQueryのroleをRootPresentationalにそのまま渡すこと', () => {
      mockUseMeQuery.mockReturnValue({ data: mockMeData })
      customRender(<RootContainer />)
      expect(mockRootPresentational.mock.calls[0]?.[0].data.role).toBe('employee')
    })

    it('useMeQueryのdataが未取得の場合、roleがundefinedのままRootPresentationalに渡すこと', () => {
      mockUseMeQuery.mockReturnValue({ data: undefined })
      customRender(<RootContainer />)
      expect(mockRootPresentational.mock.calls[0]?.[0].data.role).toBeUndefined()
    })

    it('useCreateTicketHandlerのhandlersをRootPresentationalにそのまま渡すこと', () => {
      mockUseMeQuery.mockReturnValue({ data: mockMeData })
      customRender(<RootContainer />)
      expect(mockRootPresentational).toHaveBeenCalledWith(
        expect.objectContaining({
          handlers: {
            onSubmitTicket: mockOnSubmitTicket,
            setTicketForm: mockSetTicketForm,
            onOpenDialog: mockOnOpenDialog,
            onCloseDialog: mockOnCloseDialog,
          },
        }),
        undefined,
      )
    })

    it('useCreateTicketHandlerのuiStateをRootPresentationalにそのまま渡すこと', () => {
      mockUseMeQuery.mockReturnValue({ data: mockMeData })
      customRender(<RootContainer />)
      expect(mockRootPresentational).toHaveBeenCalledWith(
        expect.objectContaining({ uiState: { isSubmitting: false } }),
        undefined,
      )
    })
  })
})
