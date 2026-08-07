import { mapValidationErrorsToFiledMessage } from '../buildFieldErrorsFromApiError'
import { describe, it, expect } from 'vitest'

// 純粋関数（引数だけで結果が決まり、副作用が無い関数）なので、モックは不要でそのまま呼び出して検証できる
describe('mapValidationErrorsToFiledMessage', () => {
  // ── 正常系 ────────────────────────────────────────────────────────────────
  describe('正常系', () => {
    it('type=VALIDATION_ERRORでdetailにフィールドが含まれる場合、該当フィールドにメッセージが設定されること', () => {
      const error = {
        type: 'VALIDATION_ERROR' as const,
        detail: [{ loc: ['body', 'title'], type: 'missing' }],
      }

      expect(mapValidationErrorsToFiledMessage(error)).toEqual({
        title: '入力してください',
      })
    })
  })

  // ── 異常系 ────────────────────────────────────────────────────────────────
  describe('異常系', () => {
    it('typeがVALIDATION_ERRORでない場合、generalに汎用バリデーションメッセージが設定されること', () => {
      const error = {
        type: 'INTERNAL_SERVER_ERROR' as const,
        detail: '権限がありません',
      }

      expect(mapValidationErrorsToFiledMessage(error)).toEqual({
        general: '入力内容を確認してください',
      })
    })

    it('detailが配列でない場合、generalに汎用バリデーションメッセージが設定されること', () => {
      const error = {
        type: 'VALIDATION_ERROR' as const,
        detail: '権限がありません',
      }

      expect(mapValidationErrorsToFiledMessage(error)).toEqual({
        general: '入力内容を確認してください',
      })
    })

    it('detailが空配列の場合、generalに汎用バリデーションメッセージが設定されること', () => {
      const error = {
        type: 'VALIDATION_ERROR' as const,
        detail: [],
      }

      expect(mapValidationErrorsToFiledMessage(error)).toEqual({
        general: '入力内容を確認してください',
      })
    })

    it('locの配列が空でフィールド名が取れない場合、generalに汎用バリデーションメッセージが設定されること', () => {
      const error = {
        type: 'VALIDATION_ERROR' as const,
        detail: [{ loc: [], type: 'missing' }],
      }

      expect(mapValidationErrorsToFiledMessage(error)).toEqual({
        general: '入力内容を確認してください',
      })
    })
  })
})
