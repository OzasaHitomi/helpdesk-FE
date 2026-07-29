import { useCreateTicketHandler } from '../useCreateTicketHandler'
import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { act } from '@testing-library/react'
import { type CreateTicketForm } from '../../../types/CreateTicketForm'

// mutateAsync/toaster.createのスパイを先に定義し、モジュールをまるごと差し替える
// (mutateAsyncの中身=通信処理はuseCreateTicketMutation.test.tsが担保するのでここではモックする)
// ※vi.mockはファイル先頭に巻き上げられるため、参照するモック関数はvi.hoistedで用意する
//
// mockIsPending: 通常のプリミティブなboolean変数だと「テストごとに値を書き換える」ができないため、
// { current: boolean } というオブジェクトに包んでいる（テスト内でmockIsPending.current = trueのように書き換える）
const { mockMutateAsync, mockToasterCreate, mockIsPending } = vi.hoisted(() => ({
  mockMutateAsync: vi.fn(),
  mockToasterCreate: vi.fn(),
  mockIsPending: { current: false },
}))

vi.mock('../../mutations/useCreateTicketMutation', () => ({
  useCreateTicketMutation: () => ({
    mutateAsync: mockMutateAsync,
    isPending: mockIsPending.current,
  }),
}))

vi.mock('@/components/ui/toaster', () => ({
  toaster: { create: mockToasterCreate },
}))

const mockForm: CreateTicketForm = {
  title: 'ログインできない',
  detail: 'パスワードを変更したらログインできなくなりました',
  visibility: 'public',
}

describe('useCreateTicketHandler', () => {
  afterEach(() => {
    vi.clearAllMocks()
    // mockIsPending.currentは各テストで独自に書き換えるため、次のテストに影響しないようここでも初期値に戻す
    mockIsPending.current = false
  })

  // ── 正常系 ────────────────────────────────────────────────────────────────
  describe('正常系', () => {
    it('ticketFormの初期値が非公開・空文字であること', () => {
      const { result } = customRenderHook(() => useCreateTicketHandler())

      expect(result.current.data.ticketForm).toEqual({
        title: '',
        detail: '',
        visibility: 'private',
      })
      expect(result.current.data.isDialogOpen).toBe(false)
      expect(result.current.data.fieldErrors).toEqual({})
      expect(result.current.uiState.isSubmitting).toBe(false)
    })

    it('登録処理中の場合、uiState.isSubmittingがtrueになること', () => {
      mockIsPending.current = true
      const { result } = customRenderHook(() => useCreateTicketHandler())

      expect(result.current.uiState.isSubmitting).toBe(true)
    })

    it('setTicketFormを呼ぶとticketFormが更新されること', () => {
      const { result } = customRenderHook(() => useCreateTicketHandler())

      act(() => {
        result.current.handlers.setTicketForm(mockForm)
      })

      expect(result.current.data.ticketForm).toEqual(mockForm)
    })

    it('onCloseDialogを呼ぶとisDialogOpenがfalseになること', () => {
      const { result } = customRenderHook(() => useCreateTicketHandler())

      act(() => {
        result.current.handlers.onOpenDialog()
      })
      act(() => {
        result.current.handlers.onCloseDialog()
      })

      expect(result.current.data.isDialogOpen).toBe(false)
    })

    it('onOpenDialogを呼ぶと、ticketFormが初期値にリセットされ、fieldErrorsがクリアされ、isDialogOpenがtrueになること', async () => {
      const { result } = customRenderHook(() => useCreateTicketHandler())

      // あえて一度「入力あり・エラーあり」の状態を作ってから、onOpenDialogでリセットされることを確認する
      act(() => {
        result.current.handlers.setTicketForm(mockForm)
      })
      await act(async () => {
        await result.current.handlers.onSubmitTicket({ ...mockForm, title: '   ' })
      })
      expect(result.current.data.fieldErrors).toEqual({ title: '入力してください' })

      act(() => {
        result.current.handlers.onOpenDialog()
      })

      expect(result.current.data.ticketForm).toEqual({
        title: '',
        detail: '',
        visibility: 'private',
      })
      expect(result.current.data.fieldErrors).toEqual({})
      expect(result.current.data.isDialogOpen).toBe(true)
    })

    it('登録に成功した場合、mutateAsyncが正しい引数で呼ばれ、ダイアログが閉じ、成功トーストが出ること', async () => {
      mockMutateAsync.mockResolvedValueOnce(undefined)
      const { result } = customRenderHook(() => useCreateTicketHandler())

      act(() => {
        result.current.handlers.onOpenDialog()
      })

      await act(async () => {
        await result.current.handlers.onSubmitTicket(mockForm)
      })

      expect(mockMutateAsync).toHaveBeenCalledWith(mockForm)
      expect(result.current.data.isDialogOpen).toBe(false)
      expect(mockToasterCreate).toHaveBeenCalledWith({
        type: 'success',
        title: 'チケット：ログインできない が新規登録されました',
      })
    })
  })

  // ── 異常系 ────────────────────────────────────────────────────────────────
  describe('異常系', () => {
    it('BEが403等でdetail(文字列)を返す場合、その文言のエラートーストが出て、ダイアログが閉じること', async () => {
      mockMutateAsync.mockRejectedValueOnce({
        isAxiosError: true,
        response: { data: { detail: '社員アカウントのみチケットを作成できます' } },
      })
      const { result } = customRenderHook(() => useCreateTicketHandler())

      act(() => {
        result.current.handlers.onOpenDialog()
      })

      await act(async () => {
        await result.current.handlers.onSubmitTicket(mockForm)
      })

      expect(result.current.data.isDialogOpen).toBe(false)
      expect(mockToasterCreate).toHaveBeenCalledWith({
        type: 'error',
        title: '社員アカウントのみチケットを作成できます',
      })
    })

    // typeごとの文言変換の網羅はtransformValidationErrorTypeToJa.test.tsの責務のため、
    // ここでは「locから該当フィールドへの振り分け」と「翻訳した文言がfieldErrorsに設定されること」を代表ケースで確認する
    it('BEが422でdetail(配列)を返す場合、ダイアログを閉じずに該当フィールドのエラーが設定されること', async () => {
      mockMutateAsync.mockRejectedValueOnce({
        isAxiosError: true,
        response: { data: { detail: [{ loc: ['body', 'title'], type: 'missing' }] } },
      })
      const { result } = customRenderHook(() => useCreateTicketHandler())

      act(() => {
        result.current.handlers.onOpenDialog()
      })

      await act(async () => {
        await result.current.handlers.onSubmitTicket(mockForm)
      })

      expect(result.current.data.isDialogOpen).toBe(true)
      expect(result.current.data.fieldErrors).toEqual({ title: '入力してください' })
      expect(mockToasterCreate).not.toHaveBeenCalled()
    })

    it('BEが422で複数件のdetailを返す場合、それぞれのフィールドにエラーが設定されること', async () => {
      mockMutateAsync.mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          data: {
            detail: [
              { loc: ['body', 'title'], type: 'string_too_long' },
              { loc: ['body', 'detail'], type: 'missing' },
            ],
          },
        },
      })
      const { result } = customRenderHook(() => useCreateTicketHandler())

      await act(async () => {
        await result.current.handlers.onSubmitTicket(mockForm)
      })

      expect(result.current.data.fieldErrors).toEqual({
        title: '文字数が上限を超えています',
        detail: '入力してください',
      })
    })

    it('BEが422で未知のフィールドのdetailを返す場合、汎用エラートーストが出ること', async () => {
      mockMutateAsync.mockRejectedValueOnce({
        isAxiosError: true,
        response: { data: { detail: [{ loc: ['body', 'unknown'], type: 'missing' }] } },
      })
      const { result } = customRenderHook(() => useCreateTicketHandler())

      await act(async () => {
        await result.current.handlers.onSubmitTicket(mockForm)
      })

      expect(mockToasterCreate).toHaveBeenCalledWith({
        type: 'error',
        title: '入力内容を確認してください',
      })
    })

    it('axios以外のエラーの場合、汎用エラートーストが出て、ダイアログが閉じること', async () => {
      mockMutateAsync.mockRejectedValueOnce(new Error('network error'))
      const { result } = customRenderHook(() => useCreateTicketHandler())

      act(() => {
        result.current.handlers.onOpenDialog()
      })

      await act(async () => {
        await result.current.handlers.onSubmitTicket(mockForm)
      })

      expect(result.current.data.isDialogOpen).toBe(false)
      expect(mockToasterCreate).toHaveBeenCalledWith({
        type: 'error',
        title: 'チケットの登録に失敗しました',
      })
    })
  })

  // ── FEバリデーション ────────────────────────────────────────────────────
  // BE通信を行う前に、FE側（zodスキーマ）で弾かれるケースを確認する
  describe('FEバリデーション', () => {
    it('要件が未入力の場合、titleにエラーが設定されmutateAsyncが呼ばれず、ダイアログも閉じないこと', async () => {
      const { result } = customRenderHook(() => useCreateTicketHandler())

      act(() => {
        result.current.handlers.onOpenDialog()
      })

      await act(async () => {
        await result.current.handlers.onSubmitTicket({ ...mockForm, title: '   ' })
      })

      expect(result.current.data.fieldErrors).toEqual({ title: '入力してください' })
      expect(mockMutateAsync).not.toHaveBeenCalled()
      expect(result.current.data.isDialogOpen).toBe(true)
    })

    it('詳細が未入力の場合、detailにエラーが設定されmutateAsyncが呼ばれないこと', async () => {
      const { result } = customRenderHook(() => useCreateTicketHandler())

      await act(async () => {
        await result.current.handlers.onSubmitTicket({ ...mockForm, detail: '' })
      })

      expect(result.current.data.fieldErrors).toEqual({ detail: '入力してください' })
      expect(mockMutateAsync).not.toHaveBeenCalled()
    })
  })
})
