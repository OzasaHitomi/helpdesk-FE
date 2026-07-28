import { resolveTicketValidationErrorMessage } from '../resolveTicketValidationErrorMessage'
import { describe, it, expect } from 'vitest'

// 純粋関数なのでモックは不要。フィールド名(loc)とtype(missing/string_too_long等)の組み合わせごとに、
// 期待する日本語メッセージが返るかを1つずつ確認する
describe('resolveTicketValidationErrorMessage', () => {
  // ── 正常系 ────────────────────────────────────────────────────────────────
  describe('正常系', () => {
    it('titleが未入力の場合、要件用のメッセージを返すこと', () => {
      expect(
        resolveTicketValidationErrorMessage([{ loc: ['body', 'title'], type: 'missing' }]),
      ).toBe('要件を入力してください')
    })

    it('titleが長すぎる場合、文字数用のメッセージを返すこと', () => {
      expect(
        resolveTicketValidationErrorMessage([{ loc: ['body', 'title'], type: 'string_too_long' }]),
      ).toBe('要件は255文字以内で入力してください')
    })

    it('detailが未入力の場合、詳細用のメッセージを返すこと', () => {
      expect(
        resolveTicketValidationErrorMessage([
          { loc: ['body', 'detail'], type: 'string_too_short' },
        ]),
      ).toBe('詳細を入力してください')
    })

    it('visibilityが不正な場合、公開設定用のメッセージを返すこと', () => {
      expect(
        resolveTicketValidationErrorMessage([{ loc: ['body', 'visibility'], type: 'enum' }]),
      ).toBe('公開設定を選択してください')
    })
  })

  // ── 異常系（想定外の入力に対するフォールバック） ─────────────────────────
  describe('異常系', () => {
    it('未知のフィールドの場合、汎用メッセージを返すこと', () => {
      expect(
        resolveTicketValidationErrorMessage([{ loc: ['body', 'unknown'], type: 'missing' }]),
      ).toBe('入力内容を確認してください')
    })

    it('配列が空の場合、汎用メッセージを返すこと', () => {
      expect(resolveTicketValidationErrorMessage([])).toBe('入力内容を確認してください')
    })
  })
})
