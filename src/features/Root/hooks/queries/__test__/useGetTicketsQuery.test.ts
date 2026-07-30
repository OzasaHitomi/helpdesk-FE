import { useGetTicketsQuery } from '../useGetTicketsQuery'
import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import * as ticketService from '@/services/internal/backend/v1/tickets'
import { type GetTicketsResponseItem } from '@/services/internal/backend/v1/types/response/tickets'

// BEと通信する関数(getTickets)をモックし、useGetTicketsQueryがマウント時に自動でgetTicketsを呼び出し、
// 結果(成功/失敗)を正しく受け取れるかのみをテストする（getTickets自体の通信処理はテストしない）

const mockTicketsResponse: GetTicketsResponseItem[] = [
  {
    id: 1,
    title: 'ログインできない',
    visibility: 'private',
    status: 'new_question',
    createdAt: new Date('2026-07-29T00:00:00Z'),
    questionerName: '山田太郎',
    supportUserName: null,
  },
]

describe('useGetTicketsQuery', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('正常系', () => {
    it('マウント時に自動でgetTicketsが呼ばれ、成功した場合はdataに結果が反映されること', async () => {
      const getTicketsSpy = vi
        .spyOn(ticketService, 'getTickets')
        .mockResolvedValue(mockTicketsResponse)

      const { result } = customRenderHook(() => useGetTicketsQuery())

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(getTicketsSpy).toHaveBeenCalled()
      expect(result.current.data).toEqual(mockTicketsResponse)
    })
  })

  describe('異常系', () => {
    it('getTicketsが失敗した場合、isErrorがtrueになること', async () => {
      vi.spyOn(ticketService, 'getTickets').mockRejectedValue(new Error('failed'))

      const { result } = customRenderHook(() => useGetTicketsQuery())

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
    })
  })
})
