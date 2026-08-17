import { useGetTicketHandler } from '../useGetTicketHandler'
import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { type GetTicketResponse } from '@/services/internal/backend/v1/types/response/tickets'

// 通信(useGetTicketQuery)はモックし、handlerが担当する
// 「View型への詰め替え」「未取得時のundefined」のみをテストする

const { mockUseGetTicketQuery } = vi.hoisted(() => ({
  mockUseGetTicketQuery: vi.fn(),
}))

vi.mock('../../queries/useGetTicketQuery', () => ({
  useGetTicketQuery: mockUseGetTicketQuery,
}))

const mockTicketResponse: GetTicketResponse = {
  id: 1,
  title: 'ログインできない',
  detail: 'パスワードを変更したらログインできなくなりました',
  visibility: 'private',
  status: 'new_question',
  supportUserId: null,
  supportUserName: null,
  createdAt: new Date('2026-07-29T00:00:00Z'),
}

describe('useGetTicketHandler', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('正常系', () => {
    it('取得したチケットがView型に詰め替えられて返されること', () => {
      mockUseGetTicketQuery.mockReturnValue({
        data: mockTicketResponse,
        isLoading: false,
        isError: false,
      })

      const { result } = customRenderHook(() => useGetTicketHandler(1, 'support', 1))

      expect(result.current.data.ticket).toEqual({
        ...mockTicketResponse,
        isAssignableToMe: true,
        isUnassignableByMe: false,
        isStatusEditableByMe: false,
      })
    })

    it('roleがsupport以外の場合、isAssignableToMeがfalseになること', () => {
      mockUseGetTicketQuery.mockReturnValue({
        data: mockTicketResponse,
        isLoading: false,
        isError: false,
      })

      const { result } = customRenderHook(() => useGetTicketHandler(1, 'employee', 1))

      expect(result.current.data.ticket?.isAssignableToMe).toBe(false)
    })

    it('uiStateにisLoading/isErrorがそのまま渡されること', () => {
      mockUseGetTicketQuery.mockReturnValue({
        data: mockTicketResponse,
        isLoading: true,
        isError: false,
      })

      const { result } = customRenderHook(() => useGetTicketHandler(1, 'support', 1))

      expect(result.current.uiState).toEqual({ isLoading: true, isError: false })
    })
  })

  // ── isUnassignableByMeの判定 ─────────────────────────────────────────────
  describe('担当解除ボタンの表示可否(isUnassignableByMe)', () => {
    it('roleがsupport・ステータスがassigned・自身が担当者の場合、trueになること', () => {
      mockUseGetTicketQuery.mockReturnValue({
        data: { ...mockTicketResponse, status: 'assigned', supportUserId: 1 },
        isLoading: false,
        isError: false,
      })

      const { result } = customRenderHook(() => useGetTicketHandler(1, 'support', 1))

      expect(result.current.data.ticket?.isUnassignableByMe).toBe(true)
    })

    it('ステータスがin_progress・自身が担当者の場合、trueになること', () => {
      mockUseGetTicketQuery.mockReturnValue({
        data: { ...mockTicketResponse, status: 'in_progress', supportUserId: 1 },
        isLoading: false,
        isError: false,
      })

      const { result } = customRenderHook(() => useGetTicketHandler(1, 'support', 1))

      expect(result.current.data.ticket?.isUnassignableByMe).toBe(true)
    })

    it('roleがsupport以外の場合、falseになること', () => {
      mockUseGetTicketQuery.mockReturnValue({
        data: { ...mockTicketResponse, status: 'assigned', supportUserId: 1 },
        isLoading: false,
        isError: false,
      })

      const { result } = customRenderHook(() => useGetTicketHandler(1, 'employee', 1))

      expect(result.current.data.ticket?.isUnassignableByMe).toBe(false)
    })

    it('ステータスがassigned/in_progress以外の場合、falseになること', () => {
      mockUseGetTicketQuery.mockReturnValue({
        data: { ...mockTicketResponse, status: 'resolved', supportUserId: 1 },
        isLoading: false,
        isError: false,
      })

      const { result } = customRenderHook(() => useGetTicketHandler(1, 'support', 1))

      expect(result.current.data.ticket?.isUnassignableByMe).toBe(false)
    })

    it('担当者が自分以外の場合、falseになること', () => {
      mockUseGetTicketQuery.mockReturnValue({
        data: { ...mockTicketResponse, status: 'assigned', supportUserId: 2 },
        isLoading: false,
        isError: false,
      })

      const { result } = customRenderHook(() => useGetTicketHandler(1, 'support', 1))

      expect(result.current.data.ticket?.isUnassignableByMe).toBe(false)
    })
  })

  // ── isStatusEditableByMeの判定 ───────────────────────────────────────────
  describe('ステータス変更の編集可否(isStatusEditableByMe)', () => {
    it('roleがadminの場合、自身が担当者でなくてもtrueになること', () => {
      mockUseGetTicketQuery.mockReturnValue({
        data: { ...mockTicketResponse, status: 'assigned', supportUserId: 2 },
        isLoading: false,
        isError: false,
      })

      const { result } = customRenderHook(() => useGetTicketHandler(1, 'admin', 1))

      expect(result.current.data.ticket?.isStatusEditableByMe).toBe(true)
    })

    it('roleがsupportで自身が担当者の場合、trueになること', () => {
      mockUseGetTicketQuery.mockReturnValue({
        data: { ...mockTicketResponse, status: 'assigned', supportUserId: 1 },
        isLoading: false,
        isError: false,
      })

      const { result } = customRenderHook(() => useGetTicketHandler(1, 'support', 1))

      expect(result.current.data.ticket?.isStatusEditableByMe).toBe(true)
    })

    it('roleがsupportで自身が担当者でない場合、falseになること', () => {
      mockUseGetTicketQuery.mockReturnValue({
        data: { ...mockTicketResponse, status: 'assigned', supportUserId: 2 },
        isLoading: false,
        isError: false,
      })

      const { result } = customRenderHook(() => useGetTicketHandler(1, 'support', 1))

      expect(result.current.data.ticket?.isStatusEditableByMe).toBe(false)
    })

    it('roleがemployeeかつ自身が担当者でない場合、falseになること', () => {
      mockUseGetTicketQuery.mockReturnValue({
        data: { ...mockTicketResponse, status: 'assigned', supportUserId: 2 },
        isLoading: false,
        isError: false,
      })

      const { result } = customRenderHook(() => useGetTicketHandler(1, 'employee', 1))

      expect(result.current.data.ticket?.isStatusEditableByMe).toBe(false)
    })
  })

  describe('準正常系', () => {
    it('dataが未取得(undefined)の場合、ticketがundefinedを返すこと', () => {
      mockUseGetTicketQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      })

      const { result } = customRenderHook(() => useGetTicketHandler(1, 'support', 1))

      expect(result.current.data.ticket).toBeUndefined()
    })
  })
})
