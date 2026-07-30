import { formatDateToYmd } from '../formatDateToYmd'
import { describe, it, expect } from 'vitest'

describe('formatDateToYmd', () => {
  describe('正常系', () => {
    it('半角スペース区切り・0埋めの形式に変換されること', () => {
      expect(formatDateToYmd(new Date('2026-07-29T00:00:00'))).toBe('2026 07 29')
    })

    it('月・日が1桁の場合、0埋めされること', () => {
      expect(formatDateToYmd(new Date('2026-01-05T00:00:00'))).toBe('2026 01 05')
    })
  })
})
