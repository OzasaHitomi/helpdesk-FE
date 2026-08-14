import { TicketDetailContainer } from '../TicketDetailContainer'
import { TicketDetailPresentational } from '../TicketDetailPresentational'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen } from '@testing-library/react'
import { type TicketDetailView } from '../types/TicketDetailView'
import { type TicketCommentView } from '../types/TicketCommentView'
import { type GetMeResponse } from '@/services/internal/backend/v1/types/response/auth'

// TicketDetailContainerがuseParams/useGetTicketHandler/useGetTicketCommentsHandler/useMeQueryの結果を
// TicketDetailPresentationalに正しく橋渡しできているかのみをテストする
// （表示内容自体はTicketDetailPresentational.test.tsx、通信・詰め替えはuseGetTicketHandler.test.tsが担保する）

const {
  mockUseGetTicketHandler,
  mockUseGetTicketCommentsHandler,
  mockUseCreateTicketCommentHandler,
  mockUseAssignTicketHandler,
  mockUseMeQuery,
} = vi.hoisted(() => ({
  mockUseGetTicketHandler: vi.fn(),
  mockUseGetTicketCommentsHandler: vi.fn(),
  mockUseCreateTicketCommentHandler: vi.fn(),
  mockUseAssignTicketHandler: vi.fn(),
  mockUseMeQuery: vi.fn(),
}))

vi.mock('../hooks/handlers/useGetTicketHandler', () => ({
  useGetTicketHandler: mockUseGetTicketHandler,
}))

vi.mock('../hooks/handlers/useGetTicketCommentsHandler', () => ({
  useGetTicketCommentsHandler: mockUseGetTicketCommentsHandler,
}))

vi.mock('../hooks/handlers/useCreateTicketCommentHandler', () => ({
  useCreateTicketCommentHandler: mockUseCreateTicketCommentHandler,
}))

vi.mock('../hooks/handlers/useAssignTicketHandler', () => ({
  useAssignTicketHandler: mockUseAssignTicketHandler,
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
  supportUserId: null,
  supportUserName: null,
  createdAt: new Date('2026-07-29T00:00:00Z'),
}

const mockMeData: GetMeResponse = { id: 1, role: 'support' }

const mockAssignment = {
  data: { isAssignableToMe: true },
  uiState: { isSubmitting: false },
  handlers: { onClick: vi.fn() },
}

const mockComments: TicketCommentView[] = [
  {
    id: 1,
    content: 'ご質問ありがとうございます。確認いたします。',
    commenterName: '山田太郎',
    createdAt: new Date('2026-08-04T16:12:45Z'),
  },
]

const mockCommentForm = {
  data: { content: '', fieldErrors: {} },
  uiState: { isSubmitting: false },
  handlers: { setContent: vi.fn(), onSubmit: vi.fn() },
}

describe('TicketDetailContainer', () => {
  beforeEach(() => {
    mockUseMeQuery.mockReturnValue({ data: mockMeData })
    mockUseGetTicketHandler.mockReturnValue({
      data: { ticket: mockTicket },
      uiState: { isLoading: false, isError: false },
    })
    mockUseGetTicketCommentsHandler.mockReturnValue({
      data: { comments: mockComments },
      uiState: { isLoading: false, isError: false },
    })
    mockUseCreateTicketCommentHandler.mockReturnValue(mockCommentForm)
    mockUseAssignTicketHandler.mockReturnValue(mockAssignment)
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

    it('useGetTicketCommentsHandlerのcommentsをPresentationalにそのまま渡すこと', () => {
      customRender(<TicketDetailContainer />)

      expect(mockTicketDetailPresentational.mock.calls[0]?.[0].data.comments).toEqual(mockComments)
    })

    it('ルートパラメータのidを数値に変換してuseCreateTicketCommentHandlerに渡すこと', () => {
      customRender(<TicketDetailContainer />)

      expect(mockUseCreateTicketCommentHandler).toHaveBeenCalledWith(1)
    })

    it('useCreateTicketCommentHandlerの戻り値をそのままcommentFormとしてPresentationalに渡すこと', () => {
      customRender(<TicketDetailContainer />)

      expect(mockTicketDetailPresentational.mock.calls[0]?.[0].commentForm).toEqual(mockCommentForm)
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

    it('ルートパラメータのid・ticket・meDataのroleをuseAssignTicketHandlerに渡すこと', () => {
      customRender(<TicketDetailContainer />)

      expect(mockUseAssignTicketHandler).toHaveBeenCalledWith(1, mockTicket, 'support')
    })

    it('useAssignTicketHandlerの戻り値をそのままassignmentとしてPresentationalに渡すこと', () => {
      customRender(<TicketDetailContainer />)

      expect(mockTicketDetailPresentational.mock.calls[0]?.[0].assignment).toEqual(mockAssignment)
    })

    it('useGetTicketHandlerがisLoading=trueの場合、uiState.isLoadingがtrueになること', () => {
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

    it('useGetTicketCommentsHandlerがisLoading=trueの場合も、uiState.isLoadingがtrueになること', () => {
      mockUseGetTicketCommentsHandler.mockReturnValue({
        data: { comments: mockComments },
        uiState: { isLoading: true, isError: false },
      })

      customRender(<TicketDetailContainer />)

      expect(mockTicketDetailPresentational).toHaveBeenCalledWith(
        expect.objectContaining({ uiState: { isLoading: true, isError: false } }),
        undefined,
      )
    })

    it('useGetTicketCommentsHandlerがisError=trueの場合も、uiState.isErrorがtrueになること', () => {
      mockUseGetTicketCommentsHandler.mockReturnValue({
        data: { comments: [] },
        uiState: { isLoading: false, isError: true },
      })

      customRender(<TicketDetailContainer />)

      expect(mockTicketDetailPresentational).toHaveBeenCalledWith(
        expect.objectContaining({ uiState: { isLoading: false, isError: true } }),
        undefined,
      )
    })
  })
})
