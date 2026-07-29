import {
  transformValidationErrorTypeToJa,
  GENERAL_VALIDATION_ERROR_MESSAGE,
} from '../transformValidationErrorTypeToJa'
import { describe, it, expect } from 'vitest'

// 純粋関数なのでモックは不要。typeごとに期待する日本語文言が返るかを確認する
describe('transformValidationErrorTypeToJa', () => {
  // ── 正常系 ────────────────────────────────────────────────────────────────
  describe('正常系', () => {
    it('missingの場合、未入力の文言を返すこと', () => {
      expect(transformValidationErrorTypeToJa('missing')).toBe('入力してください')
    })

    it('string_too_shortの場合、未入力の文言を返すこと', () => {
      expect(transformValidationErrorTypeToJa('string_too_short')).toBe('入力してください')
    })

    it('string_too_longの場合、文字数超過の文言を返すこと', () => {
      expect(transformValidationErrorTypeToJa('string_too_long')).toBe('文字数が上限を超えています')
    })

    it('enumの場合、未選択の文言を返すこと', () => {
      expect(transformValidationErrorTypeToJa('enum')).toBe('選択してください')
    })
  })

  // ── 異常系（想定外の入力に対するフォールバック） ─────────────────────────
  describe('異常系', () => {
    it('未知のtypeの場合、フォールバック文言を返すこと', () => {
      expect(transformValidationErrorTypeToJa('unknown_type')).toBe(
        GENERAL_VALIDATION_ERROR_MESSAGE,
      )
    })

    it('空文字の場合、フォールバック文言を返すこと', () => {
      expect(transformValidationErrorTypeToJa('')).toBe(GENERAL_VALIDATION_ERROR_MESSAGE)
    })
  })
})
