import { createTicket } from '../ticket'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { type CreateTicketRequest } from '@/services/internal/backend/v1/types/request/ticket'
import { type CreateTicketResponse } from '@/services/internal/backend/v1/types/response/ticket'

// internalBackendV1Client（axiosクライアント）をモックし、createTicketがBEのレスポンスをそのまま返せているかをテストする
// （実際の通信処理自体はテストしない）
// ※vi.mockはファイル先頭に巻き上げられるため、参照するモック関数はvi.hoistedで用意する
const { mockPost } = vi.hoisted(() => ({
  mockPost: vi.fn(),
}))

// internalBackendV1Client（axiosのインスタンス）を丸ごとモックに差し替える
// postメソッドだけ用意し、実際にBEへ通信が飛ばないようにする
vi.mock('@/services/internal/backend/v1/client', () => ({
  internalBackendV1Client: { post: mockPost },
}))

const mockRequest: CreateTicketRequest = {
  title: 'ログインできない',
  detail: 'パスワードを変更したらログインできなくなりました',
  visibility: 'private',
}

const mockResponse: CreateTicketResponse = {
  id: 1,
  title: mockRequest.title,
  detail: mockRequest.detail,
  visibility: mockRequest.visibility,
  status: 'new_question',
  createdByUserId: 1,
  supportUserId: null,
}

describe('createTicket', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  // ── 正常系 ────────────────────────────────────────────────────────────────
  describe('正常系', () => {
    it('POST /ticketsを正しい引数で呼び、レスポンスをそのまま返すこと', async () => {
      mockPost.mockResolvedValueOnce({ data: mockResponse })

      const result = await createTicket(mockRequest)

      expect(mockPost).toHaveBeenCalledWith('/tickets', mockRequest)
      expect(result).toEqual(mockResponse)
    })

    it('担当者(supportUserId)が設定されている場合、その値がそのまま入ること', async () => {
      mockPost.mockResolvedValueOnce({ data: { ...mockResponse, supportUserId: 2 } })

      const result = await createTicket(mockRequest)

      expect(result.supportUserId).toBe(2)
    })
  })
})
