import { extractErrorDetail } from '../extractErrorDetail'
import { describe, it, expect } from 'vitest'

// 純粋関数（引数だけで結果が決まり、副作用が無い関数）なので、モックは不要でそのまま呼び出して検証できる
describe('extractErrorDetail', () => {
  // ── 正常系 ────────────────────────────────────────────────────────────────
  describe('正常系', () => {
    it('axiosエラーでdetailが文字列の場合、その文字列を返すこと', () => {
      const error = {
        isAxiosError: true,
        response: { data: { detail: '社員アカウントのみチケットを作成できます' } },
      }

      expect(extractErrorDetail(error)).toBe('社員アカウントのみチケットを作成できます')
    })

    it('axiosエラーでdetailが配列の場合、その配列を返すこと', () => {
      const error = {
        isAxiosError: true,
        response: { data: { detail: [{ loc: ['body', 'title'], type: 'missing' }] } },
      }

      expect(extractErrorDetail(error)).toEqual([{ loc: ['body', 'title'], type: 'missing' }])
    })
  })

  // ── 異常系 ────────────────────────────────────────────────────────────────
  describe('異常系', () => {
    it('axios以外のエラーの場合、undefinedを返すこと', () => {
      expect(extractErrorDetail(new Error('network error'))).toBeUndefined()
    })
  })
})
