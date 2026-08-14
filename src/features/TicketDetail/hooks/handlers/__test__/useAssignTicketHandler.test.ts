import { useAssignTicketHandler } from '../useAssignTicketHandler'
import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { act } from '@testing-library/react'
import { type TicketDetailView } from '../../../types/TicketDetailView'

// mutateAsync/toaster.createのスパイを先に定義し、モジュールをまるごと差し替える
// (mutateAsyncの中身=通信処理はuseAssignTicketToSelfMutation.test.tsが担保するのでここではモックする)
const { mockMutateAsync, mockToasterCreate, mockIsPending } = vi.hoisted(() => ({
  mockMutateAsync: vi.fn(),
  mockToasterCreate: vi.fn(),
  mockIsPending: { current: false },
}))

vi.mock('../../mutations/useAssignTicketToSelfMutation', () => ({
  useAssignTicketToSelfMutation: () => ({
    mutateAsync: mockMutateAsync,
    isPending: mockIsPending.current,
  }),
}))

vi.mock('@/components/ui/toaster', () => ({
  toaster: { create: mockToasterCreate },
}))

const baseTicket: TicketDetailView = {
  id: 1,
  title: 'ログインできない',
  detail: 'パスワードを変更したらログインできなくなりました',
  visibility: 'private',
  status: 'new_question',
  supportUserId: null,
  supportUserName: null,
  createdAt: new Date('2026-07-29T00:00:00Z'),
}

describe('useAssignTicketHandler', () => {
  afterEach(() => {
    vi.clearAllMocks()
    mockIsPending.current = false
  })

  // ── ボタン表示の出し分け ────────────────────────────────────────────────
  describe('isAssignableToMeの出し分け', () => {
    it('サポート担当かつ新規質問かつ担当者未割り当ての場合、isAssignableToMeがtrueになること', () => {
      const { result } = customRenderHook(() => useAssignTicketHandler(1, baseTicket, 'support'))

      expect(result.current.data.isAssignableToMe).toBe(true)
    })

    it('サポート担当かつ担当者が既に割り当て済みの場合、isAssignableToMeがfalseになること', () => {
      const ticket = { ...baseTicket, status: 'assigned' as const, supportUserId: 10 }
      const { result } = customRenderHook(() => useAssignTicketHandler(1, ticket, 'support'))

      expect(result.current.data.isAssignableToMe).toBe(false)
    })

    it('roleがemployeeの場合、担当者未割り当てでもisAssignableToMeがfalseになること', () => {
      const { result } = customRenderHook(() => useAssignTicketHandler(1, baseTicket, 'employee'))

      expect(result.current.data.isAssignableToMe).toBe(false)
    })

    it('ticketが未取得(undefined)の場合、isAssignableToMeがfalseになること', () => {
      const { result } = customRenderHook(() => useAssignTicketHandler(1, undefined, 'support'))

      expect(result.current.data.isAssignableToMe).toBe(false)
    })

    it('handlers.onClickは常に関数として返されること', () => {
      const ticket = { ...baseTicket, status: 'assigned' as const, supportUserId: 10 }
      const { result } = customRenderHook(() => useAssignTicketHandler(1, ticket, 'support'))

      expect(result.current.handlers.onClick).toBeInstanceOf(Function)
    })
  })

  describe('登録処理中の状態', () => {
    it('登録処理中の場合、uiState.isSubmittingがtrueになること', () => {
      mockIsPending.current = true
      const { result } = customRenderHook(() => useAssignTicketHandler(1, baseTicket, 'support'))

      expect(result.current.uiState.isSubmitting).toBe(true)
    })
  })

  // ── onClick(担当者になる)の挙動 ──────────────────────────────────────────
  describe('担当者になるボタンの操作', () => {
    it('登録に成功した場合、mutateAsyncが呼ばれ、成功トーストが出ること', async () => {
      mockMutateAsync.mockResolvedValueOnce(undefined)
      const { result } = customRenderHook(() => useAssignTicketHandler(1, baseTicket, 'support'))

      await act(async () => {
        await result.current.handlers.onClick()
      })

      expect(mockMutateAsync).toHaveBeenCalled()
      expect(mockToasterCreate).toHaveBeenCalledWith({
        type: 'success',
        title: '担当者に設定されました',
      })
    })

    it('BEが422 BUSINESS_ERRORを返す場合、detailの文言のエラートーストが出ること', async () => {
      mockMutateAsync.mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          data: { detail: 'すでに担当者が設定されています', type: 'BUSINESS_ERROR' },
        },
      })
      const { result } = customRenderHook(() => useAssignTicketHandler(1, baseTicket, 'support'))

      await act(async () => {
        await result.current.handlers.onClick()
      })

      expect(mockToasterCreate).toHaveBeenCalledWith({
        type: 'error',
        title: 'すでに担当者が設定されています',
      })
    })

    it('BEが403等でdetail(文字列)を返す場合、その文言のエラートーストが出ること', async () => {
      mockMutateAsync.mockRejectedValueOnce({
        isAxiosError: true,
        response: { data: { detail: '担当者を設定する権限がありません' } },
      })
      const { result } = customRenderHook(() => useAssignTicketHandler(1, baseTicket, 'support'))

      await act(async () => {
        await result.current.handlers.onClick()
      })

      expect(mockToasterCreate).toHaveBeenCalledWith({
        type: 'error',
        title: '担当者を設定する権限がありません',
      })
    })

    it('axios以外のエラーの場合、汎用エラートーストが出ること', async () => {
      mockMutateAsync.mockRejectedValueOnce(new Error('network error'))
      const { result } = customRenderHook(() => useAssignTicketHandler(1, baseTicket, 'support'))

      await act(async () => {
        await result.current.handlers.onClick()
      })

      expect(mockToasterCreate).toHaveBeenCalledWith({
        type: 'error',
        title: '担当者の設定に失敗しました',
      })
    })
  })
})
