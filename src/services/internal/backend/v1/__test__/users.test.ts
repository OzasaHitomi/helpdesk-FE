import { getUsers, createUser } from '../users'
import { internalBackendV1Client } from '../client'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { type GetUsersResponseItem, type CreateUserResponse } from '../types/response/users'

// internalBackendV1Client（axiosインスタンス）のget/postをspyOnし、各関数が正しいURL・bodyで
// 通信を呼び出しているか、レスポンスのdataをそのまま返しているかのみをテストする（実際の通信は行わない）

describe('users', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getUsers', () => {
    // ── 正常系 ──────────────────────────────────────────────────────────────
    describe('正常系', () => {
      it('/admin/usersへGETし、レスポンスのdataをそのまま返すこと', async () => {
        const mockResponse: GetUsersResponseItem[] = [
          {
            id: 1,
            name: '山田太郎',
            email: 'yamada@example.com',
            role: 'employee',
            isActive: true,
          },
          { id: 2, name: '鈴木花子', email: 'suzuki@example.com', role: 'admin', isActive: true },
          { id: 3, name: '佐藤次郎', email: 'sato@example.com', role: 'employee', isActive: false },
        ]
        const getSpy = vi
          .spyOn(internalBackendV1Client, 'get')
          .mockResolvedValue({ data: mockResponse })

        const result = await getUsers()

        expect(getSpy).toHaveBeenCalledWith('/admin/users')
        expect(result).toEqual(mockResponse)
      })
    })
  })

  describe('createUser', () => {
    describe('正常系', () => {
      it('/admin/usersへbodyをPOSTし、レスポンスのdataをそのまま返すこと', async () => {
        const mockResponse: CreateUserResponse = {
          id: 1,
          name: '山田太郎',
          email: 'yamada@example.com',
          role: 'employee',
          isActive: true,
        }
        const postSpy = vi
          .spyOn(internalBackendV1Client, 'post')
          .mockResolvedValue({ data: mockResponse })

        const body = {
          name: '山田太郎',
          email: 'yamada@example.com',
          password: 'password123',
          role: 'employee' as const,
        }
        const result = await createUser(body)

        expect(postSpy).toHaveBeenCalledWith('/admin/users', body)
        expect(result).toEqual(mockResponse)
      })
    })
  })
})
