import { formatTimeToHms } from '../formatTimeToHms'
import { describe, it, expect } from 'vitest'

describe('formatTimeToHms', () => {
  describe('正常系', () => {
    it('コロン区切り・0埋めの形式に変換されること', () => {
      expect(formatTimeToHms(new Date('2026-08-04T16:12:45'))).toBe('16:12:45')
    })

    it('時・分・秒が1桁の場合、0埋めされること', () => {
      expect(formatTimeToHms(new Date('2026-08-04T01:02:03'))).toBe('01:02:03')
    })
  })
})
