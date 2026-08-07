import { getTicketComments, createTicketComment } from '../ticketComments'
import { internalBackendV1Client } from '../client'
import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  type GetTicketCommentsResponseItemJson,
  type CreateTicketCommentResponse,
} from '../types/response/ticketComments'
import { type CreateTicketCommentRequest } from '../types/request/ticketComments'

// internalBackendV1Client（axiosインスタンス）のgetをspyOnし、getTicketCommentsが正しいURLで
// 通信を呼び出しているか、レスポンスを正しく返す（createdAtは文字列からDateへ変換される）かのみを
// テストする（実際の通信は行わない）

describe('ticketComments', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getTicketComments', () => {
    describe('正常系', () => {
      it('/tickets/{id}/commentsへGETし、createdAtを文字列からDateに変換したうえで返すこと', async () => {
        const mockResponseJson: GetTicketCommentsResponseItemJson[] = [
          {
            id: 1,
            content: 'ご質問ありがとうございます。確認いたします。',
            commenterName: '山田太郎',
            createdAt: '2026-08-04T16:12:45Z',
          },
        ]
        const getSpy = vi
          .spyOn(internalBackendV1Client, 'get')
          .mockResolvedValue({ data: mockResponseJson })

        const result = await getTicketComments(1)

        expect(getSpy).toHaveBeenCalledWith('/tickets/1/comments')
        expect(result).toEqual([
          { ...mockResponseJson[0], createdAt: new Date('2026-08-04T16:12:45Z') },
        ])
      })
    })
  })

  describe('createTicketComment', () => {
    describe('正常系', () => {
      it('/tickets/{id}/commentsへ、bodyを付けてPOSTし、レスポンスをそのまま返すこと', async () => {
        const mockRequest: CreateTicketCommentRequest = {
          content: 'ありがとうございます、解決しました。',
        }
        const mockResponse: CreateTicketCommentResponse = {
          id: 2,
          ticketId: 1,
          content: mockRequest.content,
          createdByUserId: 1,
        }
        const postSpy = vi
          .spyOn(internalBackendV1Client, 'post')
          .mockResolvedValue({ data: mockResponse })

        const result = await createTicketComment(1, mockRequest)

        expect(postSpy).toHaveBeenCalledWith('/tickets/1/comments', mockRequest)
        expect(result).toEqual(mockResponse)
      })
    })
  })
})
