import { getTicketComments } from '../ticketComments'
import { internalBackendV1Client } from '../client'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { type GetTicketCommentsResponseItemJson } from '../types/response/ticketComments'

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
})
