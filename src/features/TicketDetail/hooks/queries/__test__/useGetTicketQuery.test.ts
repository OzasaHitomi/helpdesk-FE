import { useGetTicketQuery } from '../useGetTicketQuery'
import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import * as ticketService from '@/services/internal/backend/v1/tickets'
import { type GetTicketResponse } from '@/services/internal/backend/v1/types/response/tickets'

// BEと通信する関数(getTicket)をモックし、useGetTicketQueryがマウント時に自動でgetTicketを呼び出し、
// 結果(成功/失敗)を正しく受け取れるかのみをテストする（getTicket自体の通信処理はテストしない）

const mockTicketResponse: GetTicketResponse = {
  id: 1,
  title: 'ログインできない',
  detail: 'パスワードを変更したらログインできなくなりました',
  visibility: 'private',
  status: 'new_question',
  createdByUserId: 1,
  supportUserId: null,
  supportUserName: null,
  createdAt: new Date('2026-07-29T00:00:00Z'),
}

describe('useGetTicketQuery', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('正常系', () => {
    it('マウント時に自動でgetTicketがidを引数に呼ばれ、成功した場合はdataに結果が反映されること', async () => {
      const getTicketSpy = vi
        .spyOn(ticketService, 'getTicket')
        .mockResolvedValue(mockTicketResponse)

      const { result } = customRenderHook(() => useGetTicketQuery(1))

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(getTicketSpy).toHaveBeenCalledWith(1)
      expect(result.current.data).toEqual(mockTicketResponse)
    })
  })

  describe('異常系', () => {
    it('getTicketが失敗した場合、isErrorがtrueになること', async () => {
      vi.spyOn(ticketService, 'getTicket').mockRejectedValue(new Error('failed'))

      const { result } = customRenderHook(() => useGetTicketQuery(1))

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
    })

    it('idがNaNの場合、getTicketが呼ばれないこと', () => {
      const getTicketSpy = vi
        .spyOn(ticketService, 'getTicket')
        .mockResolvedValue(mockTicketResponse)

      customRenderHook(() => useGetTicketQuery(Number('abc')))

      expect(getTicketSpy).not.toHaveBeenCalled()
    })
  })
})
