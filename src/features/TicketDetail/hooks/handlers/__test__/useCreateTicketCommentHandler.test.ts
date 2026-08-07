import { useCreateTicketCommentHandler } from '../useCreateTicketCommentHandler'
import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { act } from '@testing-library/react'

// mutateAsync/toaster.createのスパイを先に定義し、モジュールをまるごと差し替える
// (mutateAsyncの中身=通信処理はuseCreateTicketCommentMutation.test.tsが担保するのでここではモックする)
const { mockMutateAsync, mockToasterCreate, mockIsPending } = vi.hoisted(() => ({
  mockMutateAsync: vi.fn(),
  mockToasterCreate: vi.fn(),
  mockIsPending: { current: false },
}))

vi.mock('../../mutations/useCreateTicketCommentMutation', () => ({
  useCreateTicketCommentMutation: () => ({
    mutateAsync: mockMutateAsync,
    isPending: mockIsPending.current,
  }),
}))

vi.mock('@/components/ui/toaster', () => ({
  toaster: { create: mockToasterCreate },
}))

describe('useCreateTicketCommentHandler', () => {
  afterEach(() => {
    vi.clearAllMocks()
    mockIsPending.current = false
  })

  // ── 正常系 ────────────────────────────────────────────────────────────────
  describe('正常系', () => {
    it('contentの初期値が空文字であること', () => {
      const { result } = customRenderHook(() => useCreateTicketCommentHandler(1))

      expect(result.current.data.content).toBe('')
      expect(result.current.data.fieldErrors).toEqual({})
      expect(result.current.uiState.isSubmitting).toBe(false)
    })

    it('登録処理中の場合、uiState.isSubmittingがtrueになること', () => {
      mockIsPending.current = true
      const { result } = customRenderHook(() => useCreateTicketCommentHandler(1))

      expect(result.current.uiState.isSubmitting).toBe(true)
    })

    it('setContentを呼ぶとcontentが更新されること', () => {
      const { result } = customRenderHook(() => useCreateTicketCommentHandler(1))

      act(() => {
        result.current.handlers.setContent('質問内容')
      })

      expect(result.current.data.content).toBe('質問内容')
    })

    it('登録に成功した場合、mutateAsyncが正しい引数で呼ばれ、入力欄がクリアされ、成功トーストが出ること', async () => {
      mockMutateAsync.mockResolvedValueOnce(undefined)
      const { result } = customRenderHook(() => useCreateTicketCommentHandler(1234))

      act(() => {
        result.current.handlers.setContent('質問内容')
      })

      await act(async () => {
        await result.current.handlers.onSubmit()
      })

      expect(mockMutateAsync).toHaveBeenCalledWith({ content: '質問内容' })
      expect(result.current.data.content).toBe('')
      expect(mockToasterCreate).toHaveBeenCalledWith({
        type: 'success',
        title: 'ID:1234 質疑応答を送信しました',
      })
    })
  })

  // ── 異常系 ────────────────────────────────────────────────────────────────
  describe('異常系', () => {
    it('BEが403等でdetail(文字列)を返す場合、その文言のエラートーストが出て、入力欄は残ること', async () => {
      mockMutateAsync.mockRejectedValueOnce({
        isAxiosError: true,
        response: { data: { detail: '公開されていないチケットには投稿できません' } },
      })
      const { result } = customRenderHook(() => useCreateTicketCommentHandler(1))

      act(() => {
        result.current.handlers.setContent('質問内容')
      })

      await act(async () => {
        await result.current.handlers.onSubmit()
      })

      expect(result.current.data.content).toBe('質問内容')
      expect(mockToasterCreate).toHaveBeenCalledWith({
        type: 'error',
        title: '公開されていないチケットには投稿できません',
      })
    })

    it('BEが422でdetail(配列)を返す場合、該当フィールドのエラーが設定されトーストは出ないこと', async () => {
      mockMutateAsync.mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          data: {
            detail: [{ loc: ['body', 'content'], type: 'missing' }],
            type: 'VALIDATION_ERROR',
          },
        },
      })
      const { result } = customRenderHook(() => useCreateTicketCommentHandler(1))

      act(() => {
        result.current.handlers.setContent('質問内容')
      })

      await act(async () => {
        await result.current.handlers.onSubmit()
      })

      expect(result.current.data.fieldErrors).toEqual({ content: '入力してください' })
      expect(mockToasterCreate).not.toHaveBeenCalled()
    })

    it('BEが422で未知のフィールドのdetailを返す場合、汎用エラートーストが出ること', async () => {
      mockMutateAsync.mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          data: {
            detail: [{ loc: ['body', 'unknown'], type: 'missing' }],
            type: 'VALIDATION_ERROR',
          },
        },
      })
      const { result } = customRenderHook(() => useCreateTicketCommentHandler(1))

      act(() => {
        result.current.handlers.setContent('質問内容')
      })

      await act(async () => {
        await result.current.handlers.onSubmit()
      })

      expect(mockToasterCreate).toHaveBeenCalledWith({
        type: 'error',
        title: '入力内容を確認してください',
      })
    })

    it('axios以外のエラーの場合、汎用エラートーストが出ること', async () => {
      mockMutateAsync.mockRejectedValueOnce(new Error('network error'))
      const { result } = customRenderHook(() => useCreateTicketCommentHandler(1))

      act(() => {
        result.current.handlers.setContent('質問内容')
      })

      await act(async () => {
        await result.current.handlers.onSubmit()
      })

      expect(mockToasterCreate).toHaveBeenCalledWith({
        type: 'error',
        title: '質疑応答の送信に失敗しました',
      })
    })
  })

  // ── FEバリデーション ────────────────────────────────────────────────────
  describe('FEバリデーション', () => {
    it('未入力の場合、contentにエラーが設定されmutateAsyncが呼ばれずトーストも出ないこと', async () => {
      const { result } = customRenderHook(() => useCreateTicketCommentHandler(1))

      await act(async () => {
        await result.current.handlers.onSubmit()
      })

      expect(result.current.data.fieldErrors).toEqual({ content: '入力してください' })
      expect(mockMutateAsync).not.toHaveBeenCalled()
      expect(mockToasterCreate).not.toHaveBeenCalled()
    })

    it('空白のみの場合、contentにエラーが設定されmutateAsyncが呼ばれないこと', async () => {
      const { result } = customRenderHook(() => useCreateTicketCommentHandler(1))

      act(() => {
        result.current.handlers.setContent('   ')
      })

      await act(async () => {
        await result.current.handlers.onSubmit()
      })

      expect(result.current.data.fieldErrors).toEqual({ content: '入力してください' })
      expect(mockMutateAsync).not.toHaveBeenCalled()
    })
  })
})
