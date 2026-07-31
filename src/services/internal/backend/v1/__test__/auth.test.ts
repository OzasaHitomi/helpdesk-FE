import { postLogin, getMe, postLogout } from '../auth'
import { internalBackendV1Client } from '../client'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { type GetMeResponse } from '../types/response/auth'

// internalBackendV1Client（axiosインスタンス）のget/postをspyOnし、各関数が正しいURL・メソッド・bodyで
// 通信を呼び出しているか、レスポンスを正しく返しているかのみをテストする（実際の通信は行わない）

describe('auth', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('postLogin', () => {
    // ── 正常系 ──────────────────────────────────────────────────────────────
    describe('正常系', () => {
      it('/authへemail・passwordをbodyとしてPOSTすること', async () => {
        const postSpy = vi
          .spyOn(internalBackendV1Client, 'post')
          .mockResolvedValue({ data: undefined })

        await postLogin({ email: 'test@example.com', password: 'password' })

        expect(postSpy).toHaveBeenCalledWith('/auth', {
          email: 'test@example.com',
          password: 'password',
        })
      })
    })
  })

  describe('getMe', () => {
    describe('正常系', () => {
      it('/auth/meへGETし、レスポンスのdataをそのまま返すこと', async () => {
        const mockResponse: GetMeResponse = { id: 1, role: 'employee' }
        const getSpy = vi
          .spyOn(internalBackendV1Client, 'get')
          .mockResolvedValue({ data: mockResponse })

        const result = await getMe()

        expect(getSpy).toHaveBeenCalledWith('/auth/me')
        expect(result).toEqual(mockResponse)
      })
    })
  })

  describe('postLogout', () => {
    describe('正常系', () => {
      it('/auth/logoutへPOSTすること', async () => {
        const postSpy = vi
          .spyOn(internalBackendV1Client, 'post')
          .mockResolvedValue({ data: undefined })

        await postLogout()

        expect(postSpy).toHaveBeenCalledWith('/auth/logout')
      })
    })
  })
})
