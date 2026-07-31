import { createTicket, getTickets, getTicket } from '../tickets'
import { internalBackendV1Client } from '../client'
import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  type CreateTicketResponse,
  type GetTicketsResponseItemJson,
  type GetTicketResponseJson,
} from '../types/response/tickets'

// internalBackendV1Client（axiosインスタンス）のget/postをspyOnし、各関数が正しいURL・メソッド・bodyで
// 通信を呼び出しているか、レスポンスを正しく返す（createdAtは文字列からDateへ変換される）かのみを
// テストする（実際の通信は行わない）

describe('tickets', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('createTicket', () => {
    // ── 正常系 ──────────────────────────────────────────────────────────────
    describe('正常系', () => {
      it('/ticketsへbodyをPOSTし、レスポンスのdataをそのまま返すこと', async () => {
        const mockResponse: CreateTicketResponse = {
          id: 1,
          title: 'ログインできない',
          detail: 'パスワードを変更したらログインできなくなりました',
          visibility: 'private',
          status: 'new_question',
          createdByUserId: 1,
          supportUserId: null,
        }
        const postSpy = vi
          .spyOn(internalBackendV1Client, 'post')
          .mockResolvedValue({ data: mockResponse })

        const body = {
          title: 'ログインできない',
          detail: 'パスワードを変更したらログインできなくなりました',
          visibility: 'private' as const,
        }
        const result = await createTicket(body)

        expect(postSpy).toHaveBeenCalledWith('/tickets', body)
        expect(result).toEqual(mockResponse)
      })
    })
  })

  describe('getTickets', () => {
    describe('正常系', () => {
      it('/ticketsへGETし、createdAtを文字列からDateに変換したうえで返すこと', async () => {
        const mockResponseJson: GetTicketsResponseItemJson[] = [
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
        const getSpy = vi
          .spyOn(internalBackendV1Client, 'get')
          .mockResolvedValue({ data: mockResponseJson })

        const result = await getTickets()

        expect(getSpy).toHaveBeenCalledWith('/tickets')
        expect(result).toEqual([
          { ...mockResponseJson[0], createdAt: new Date('2026-07-29T00:00:00Z') },
        ])
      })
    })
  })

  describe('getTicket', () => {
    describe('正常系', () => {
      it('/tickets/{id}へGETし、createdAtを文字列からDateに変換したうえで返すこと', async () => {
        const mockResponseJson: GetTicketResponseJson = {
          id: 1,
          title: 'ログインできない',
          detail: 'パスワードを変更したらログインできなくなりました',
          visibility: 'private',
          status: 'new_question',
          createdAt: '2026-07-29T00:00:00Z',
        }
        const getSpy = vi
          .spyOn(internalBackendV1Client, 'get')
          .mockResolvedValue({ data: mockResponseJson })

        const result = await getTicket(1)

        expect(getSpy).toHaveBeenCalledWith('/tickets/1')
        expect(result).toEqual({
          ...mockResponseJson,
          createdAt: new Date('2026-07-29T00:00:00Z'),
        })
      })
    })
  })
})
