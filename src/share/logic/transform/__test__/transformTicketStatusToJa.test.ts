import { transformTicketStatusToJa } from '../transformTicketStatusToJa'
import { describe, it, expect } from 'vitest'

describe('transformTicketStatusToJa', () => {
  describe('正常系', () => {
    it('new_question を渡すと「新規質問」が返ること', () => {
      expect(transformTicketStatusToJa('new_question')).toBe('新規質問')
    })

    it('assigned を渡すと「担当者割り当て済み」が返ること', () => {
      expect(transformTicketStatusToJa('assigned')).toBe('担当者割り当て済み')
    })

    it('in_progress を渡すと「対応中」が返ること', () => {
      expect(transformTicketStatusToJa('in_progress')).toBe('対応中')
    })

    it('resolved を渡すと「解決済み」が返ること', () => {
      expect(transformTicketStatusToJa('resolved')).toBe('解決済み')
    })

    it('closed を渡すと「クローズ」が返ること', () => {
      expect(transformTicketStatusToJa('closed')).toBe('クローズ')
    })
  })

  describe('異常系', () => {
    it('想定外の値を渡すと空文字が返ること', () => {
      expect(transformTicketStatusToJa('unknown')).toBe('')
    })
  })
})
