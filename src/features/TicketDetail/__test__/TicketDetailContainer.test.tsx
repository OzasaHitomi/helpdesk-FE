import { TicketDetailContainer } from '../TicketDetailContainer'
import { TicketDetailPresentational } from '../TicketDetailPresentational'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen } from '@testing-library/react'
import { type TicketDetailView } from '../types/TicketDetailView'
import { type GetMeResponse } from '@/services/internal/backend/v1/types/response/auth'

// TicketDetailContainerがuseParams/useGetTicketHandler/useMeQueryの結果をTicketDetailPresentationalに
// 正しく橋渡しできているかのみをテストする
// （表示内容自体はTicketDetailPresentational.test.tsx、通信・詰め替えはuseGetTicketHandler.test.tsが担保する）

const { mockUseGetTicketHandler, mockUseMeQuery } = vi.hoisted(() => ({
  mockUseGetTicketHandler: vi.fn(),
  mockUseMeQuery: vi.fn(),
}))

vi.mock('../hooks/handlers/useGetTicketHandler', () => ({
  useGetTicketHandler: mockUseGetTicketHandler,
}))

vi.mock('@/share/hooks/queries/useMeQuery', () => ({
  useMeQuery: mockUseMeQuery,
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
  }
})

// TicketDetailPresentational自体の見た目はテスト対象外のため、受け取ったPropsのみ検証できればよい
vi.mock('../TicketDetailPresentational', () => ({
  TicketDetailPresentational: vi.fn(() => (
    <div data-testid='mocked-ticket-detail-presentational' />
  )),
}))

const mockTicketDetailPresentational = vi.mocked(TicketDetailPresentational)

const mockTicket: TicketDetailView = {
  id: 1,
  title: 'ログインできない',
  detail: 'パスワードを変更したらログインできなくなりました',
  visibility: 'private',
  status: 'new_question',
  createdAt: new Date('2026-07-29T00:00:00Z'),
}

const mockMeData: GetMeResponse = { id: 1, role: 'support' }

describe('TicketDetailContainer', () => {
  beforeEach(() => {
    mockUseMeQuery.mockReturnValue({ data: mockMeData })
    mockUseGetTicketHandler.mockReturnValue({
      data: { ticket: mockTicket },
      uiState: { isLoading: false, isError: false },
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  // Container層は「橋渡し」しかしないため、正常系のみで異常系(準正常系)は無い
  describe('正常系', () => {
    it('ContainerがPresentationalを表示すること', () => {
      customRender(<TicketDetailContainer />)

      expect(screen.getByTestId('mocked-ticket-detail-presentational')).toBeInTheDocument()
    })

    it('ルートパラメータのidを数値に変換してuseGetTicketHandlerに渡すこと', () => {
      customRender(<TicketDetailContainer />)

      expect(mockUseGetTicketHandler).toHaveBeenCalledWith(1)
    })

    it('useGetTicketHandlerのticketをPresentationalにそのまま渡すこと', () => {
      customRender(<TicketDetailContainer />)

      expect(mockTicketDetailPresentational.mock.calls[0]?.[0].data.ticket).toEqual(mockTicket)
    })

    it('useMeQueryのroleをPresentationalにそのまま渡すこと', () => {
      customRender(<TicketDetailContainer />)

      expect(mockTicketDetailPresentational.mock.calls[0]?.[0].data.role).toBe('support')
    })

    it('useMeQueryのdataが未取得の場合、roleがundefinedのままPresentationalに渡すこと', () => {
      mockUseMeQuery.mockReturnValue({ data: undefined })

      customRender(<TicketDetailContainer />)

      expect(mockTicketDetailPresentational.mock.calls[0]?.[0].data.role).toBeUndefined()
    })

    it('useGetTicketHandlerのuiStateをPresentationalにそのまま渡すこと', () => {
      mockUseGetTicketHandler.mockReturnValue({
        data: { ticket: mockTicket },
        uiState: { isLoading: true, isError: false },
      })

      customRender(<TicketDetailContainer />)

      expect(mockTicketDetailPresentational).toHaveBeenCalledWith(
        expect.objectContaining({ uiState: { isLoading: true, isError: false } }),
        undefined,
      )
    })
  })
})
