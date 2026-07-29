import { extractErrorInfo } from '../extractErrorInfo'
import { describe, it, expect } from 'vitest'

// 純粋関数（引数だけで結果が決まり、副作用が無い関数）なので、モックは不要でそのまま呼び出して検証できる
describe('extractErrorInfo', () => {
  // ── 正常系 ────────────────────────────────────────────────────────────────
  describe('正常系', () => {
    it('axiosエラーでdetailが文字列・typeが無い場合(403/401)、detailとundefinedのtypeを返すこと', () => {
      const error = {
        isAxiosError: true,
        response: { data: { detail: '社員アカウントのみチケットを作成できます' } },
      }

      expect(extractErrorInfo(error)).toEqual({
        detail: '社員アカウントのみチケットを作成できます',
        type: undefined,
      })
    })

    it('axiosエラーでdetailが配列・typeがVALIDATION_ERRORの場合、両方をそのまま返すこと', () => {
      const error = {
        isAxiosError: true,
        response: {
          data: {
            detail: [{ loc: ['body', 'title'], type: 'missing' }],
            type: 'VALIDATION_ERROR',
          },
        },
      }

      expect(extractErrorInfo(error)).toEqual({
        detail: [{ loc: ['body', 'title'], type: 'missing' }],
        type: 'VALIDATION_ERROR',
      })
    })

    it('axiosエラーでtypeがINTERNAL_SERVER_ERRORの場合、その値をそのまま返すこと', () => {
      const error = {
        isAxiosError: true,
        response: {
          data: { detail: 'システムエラーが発生しました', type: 'INTERNAL_SERVER_ERROR' },
        },
      }

      expect(extractErrorInfo(error)).toEqual({
        detail: 'システムエラーが発生しました',
        type: 'INTERNAL_SERVER_ERROR',
      })
    })
  })

  // ── 異常系 ────────────────────────────────────────────────────────────────
  describe('異常系', () => {
    it('axios以外のエラーの場合、undefinedを返すこと', () => {
      expect(extractErrorInfo(new Error('network error'))).toBeUndefined()
    })

    it('axiosエラーだがresponseが無い場合(通信自体が失敗)、undefinedを返すこと', () => {
      const error = { isAxiosError: true, response: undefined }

      expect(extractErrorInfo(error)).toBeUndefined()
    })
  })
})
