import { useGetTicketCommentsQuery } from '../useGetTicketCommentsQuery'
import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import * as ticketCommentsService from '@/services/internal/backend/v1/ticketComments'
import { type GetTicketCommentsResponseItem } from '@/services/internal/backend/v1/types/response/ticketComments'

// BEと通信する関数(getTicketComments)をモックし、useGetTicketCommentsQueryがマウント時に自動で
// getTicketCommentsを呼び出し、結果(成功/失敗)を正しく受け取れるかのみをテストする
// （getTicketComments自体の通信処理はテストしない）

const mockCommentsResponse: GetTicketCommentsResponseItem[] = [
  {
    id: 1,
    content: 'ご質問ありがとうございます。確認いたします。',
    commenterName: '山田太郎',
    createdAt: new Date('2026-08-04T16:12:45Z'),
  },
]

describe('useGetTicketCommentsQuery', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('正常系', () => {
    it('マウント時に自動でgetTicketCommentsがidを引数に呼ばれ、成功した場合はdataに結果が反映されること', async () => {
      const getTicketCommentsSpy = vi
        .spyOn(ticketCommentsService, 'getTicketComments')
        .mockResolvedValue(mockCommentsResponse)

      const { result } = customRenderHook(() => useGetTicketCommentsQuery(1))

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(getTicketCommentsSpy).toHaveBeenCalledWith(1)
      expect(result.current.data).toEqual(mockCommentsResponse)
    })
  })

  describe('異常系', () => {
    it('getTicketCommentsが失敗した場合、isErrorがtrueになること', async () => {
      vi.spyOn(ticketCommentsService, 'getTicketComments').mockRejectedValue(new Error('failed'))

      const { result } = customRenderHook(() => useGetTicketCommentsQuery(1))

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
    })

    it('idがNaNの場合、getTicketCommentsが呼ばれないこと', () => {
      const getTicketCommentsSpy = vi
        .spyOn(ticketCommentsService, 'getTicketComments')
        .mockResolvedValue(mockCommentsResponse)

      customRenderHook(() => useGetTicketCommentsQuery(Number('abc')))

      expect(getTicketCommentsSpy).not.toHaveBeenCalled()
    })
  })
})
