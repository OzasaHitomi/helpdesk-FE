import { transformTicketVisibilityToJa } from '../transformTicketVisibilityToJa'
import { describe, it, expect } from 'vitest'

describe('transformTicketVisibilityToJa', () => {
  describe('正常系', () => {
    it('public を渡すと「公開」が返ること', () => {
      expect(transformTicketVisibilityToJa('public')).toBe('公開')
    })

    it('private を渡すと「非公開」が返ること', () => {
      expect(transformTicketVisibilityToJa('private')).toBe('非公開')
    })
  })

  describe('異常系', () => {
    it('想定外の値を渡すと空文字が返ること', () => {
      expect(transformTicketVisibilityToJa('unknown')).toBe('')
    })
  })
})
