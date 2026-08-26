import { deactivateUser } from '../users'
import { internalBackendV1Client } from '../client'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { type DeactivateUserResponse } from '../types/response/users'

// internalBackendV1Client（axiosインスタンス）のputをspyOnし、deactivateUserが正しいURL・メソッドで
// 通信を呼び出しているか、レスポンスを正しく返すかのみをテストする（実際の通信は行わない）

describe('users', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('deactivateUser', () => {
    describe('正常系', () => {
      it('/admin/users/{id}/deactivateへPUTし、レスポンスのdataをそのまま返すこと', async () => {
        const mockResponse: DeactivateUserResponse = {
          id: 1,
          name: '山田太郎',
          email: 'yamada@example.com',
          role: 'employee',
          isActive: false,
        }
        const putSpy = vi
          .spyOn(internalBackendV1Client, 'put')
          .mockResolvedValue({ data: mockResponse })

        const result = await deactivateUser(1)

        expect(putSpy).toHaveBeenCalledWith('/admin/users/1/deactivate')
        expect(result).toEqual(mockResponse)
      })
    })
  })
})
