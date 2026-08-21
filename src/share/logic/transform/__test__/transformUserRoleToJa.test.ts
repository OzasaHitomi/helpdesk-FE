import { transformUserRoleToJa } from '../transformUserRoleToJa'
import { describe, it, expect } from 'vitest'

describe('transformUserRoleToJa', () => {
  describe('正常系', () => {
    it('employee を渡すと「社員」が返ること', () => {
      expect(transformUserRoleToJa('employee')).toBe('社員')
    })

    it('support を渡すと「サポート担当」が返ること', () => {
      expect(transformUserRoleToJa('support')).toBe('サポート担当')
    })

    it('admin を渡すと「管理者」が返ること', () => {
      expect(transformUserRoleToJa('admin')).toBe('管理者')
    })
  })

  describe('異常系', () => {
    it('想定外の値を渡すと空文字が返ること', () => {
      expect(transformUserRoleToJa('unknown')).toBe('')
    })
  })
})
