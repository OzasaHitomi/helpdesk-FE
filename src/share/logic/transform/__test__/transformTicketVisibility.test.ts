import { transformTicketVisibilityJa } from '../transformTicketVisibility'
import { describe, it, expect } from 'vitest'
import { type TicketVisibility } from '@/share/types/ticketVisibility'

describe('transformTicketVisibilityJa', () => {
  describe('正常系', () => {
    it('public を渡すと「公開」が返ること', () => {
      expect(transformTicketVisibilityJa('public')).toBe('公開')
    })

    it('private を渡すと「非公開」が返ること', () => {
      expect(transformTicketVisibilityJa('private')).toBe('非公開')
    })
  })

  describe('異常系', () => {
    it('想定外の値を渡すと空文字が返ること', () => {
      expect(transformTicketVisibilityJa('' as TicketVisibility)).toBe('')
    })
  })
})
