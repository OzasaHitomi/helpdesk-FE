import { createTicket, getTickets } from '../tickets'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { type CreateTicketRequest } from '@/services/internal/backend/v1/types/request/tickets'
import {
  type CreateTicketResponse,
  type GetTicketsResponseItem,
  type GetTicketsResponseItemJson,
} from '@/services/internal/backend/v1/types/response/tickets'

// internalBackendV1Client（axiosクライアント）をモックし、createTicket/getTicketsがBEのレスポンスをそのまま返せているかをテストする
// （実際の通信処理自体はテストしない）
// ※vi.mockはファイル先頭に巻き上げられるため、参照するモック関数はvi.hoistedで用意する
const { mockPost, mockGet } = vi.hoisted(() => ({
  mockPost: vi.fn(),
  mockGet: vi.fn(),
}))

// internalBackendV1Client（axiosのインスタンス）を丸ごとモックに差し替える
// post/getメソッドだけ用意し、実際にBEへ通信が飛ばないようにする
vi.mock('@/services/internal/backend/v1/client', () => ({
  internalBackendV1Client: { post: mockPost, get: mockGet },
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

// 通信で受け取るのは文字列型のcreatedAt（Json）
const mockTicketsResponseJson: GetTicketsResponseItemJson[] = [
  {
    id: 1,
    title: 'ログインできない',
    visibility: 'private',
    status: 'new_question',
    createdAt: '2026-07-29T00:00:00Z',
    questionerName: '山田太郎',
    supportUserName: null,
  },
]

const mockTicketsResponse: GetTicketsResponseItem[] = [
  {
    ...mockTicketsResponseJson[0],
    createdAt: new Date(mockTicketsResponseJson[0].createdAt),
  },
]

describe('getTickets', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  // ── 正常系 ────────────────────────────────────────────────────────────────
  describe('正常系', () => {
    it('GET /ticketsを呼び、createdAtをDate型に変換して返すこと', async () => {
      mockGet.mockResolvedValueOnce({ data: mockTicketsResponseJson })

      const result = await getTickets()

      expect(mockGet).toHaveBeenCalledWith('/tickets')
      expect(result).toEqual(mockTicketsResponse)
    })
  })
})
