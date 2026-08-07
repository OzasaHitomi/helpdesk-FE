import { buildFieldErrorsFromApiError } from '../buildFieldErrorsFromApiError'
import { describe, it, expect } from 'vitest'

// このロジックを使う機能を想定した、テスト用の型ガードとフォールバック文言
const TEST_FIELDS = ['title'] as const
type TestField = (typeof TEST_FIELDS)[number]
const isTestField = (field: unknown): field is TestField =>
  typeof field === 'string' && (TEST_FIELDS as readonly string[]).includes(field)
const FALLBACK_MESSAGE = 'テスト用の汎用エラーメッセージ'

// 純粋関数（引数だけで結果が決まり、副作用が無い関数）なので、モックは不要でそのまま呼び出して検証できる
describe('buildFieldErrorsFromApiError', () => {
  // ── 正常系 ────────────────────────────────────────────────────────────────
  describe('正常系', () => {
    it('BEが422で既知のフィールドのdetailを返す場合、該当フィールドにメッセージが設定されること', () => {
      const error = {
        isAxiosError: true,
        response: {
          data: {
            detail: [{ loc: ['body', 'title'], type: 'missing' }],
            type: 'VALIDATION_ERROR',
          },
        },
      }

      expect(buildFieldErrorsFromApiError(error, isTestField, FALLBACK_MESSAGE)).toEqual({
        title: '入力してください',
      })
    })

    it('BEが403等でdetail(文字列)を返す場合、generalにその文言がそのまま設定されること', () => {
      const error = {
        isAxiosError: true,
        response: { data: { detail: '権限がありません' } },
      }

      expect(buildFieldErrorsFromApiError(error, isTestField, FALLBACK_MESSAGE)).toEqual({
        general: '権限がありません',
      })
    })
  })

  // ── 異常系 ────────────────────────────────────────────────────────────────
  describe('異常系', () => {
    it('BEが422で未知のフィールドのdetailを返す場合、generalに汎用バリデーションメッセージが設定されること', () => {
      const error = {
        isAxiosError: true,
        response: {
          data: {
            detail: [{ loc: ['body', 'unknown'], type: 'missing' }],
            type: 'VALIDATION_ERROR',
          },
        },
      }

      expect(buildFieldErrorsFromApiError(error, isTestField, FALLBACK_MESSAGE)).toEqual({
        general: '入力内容を確認してください',
      })
    })

    it('BEが422でdetailが空配列の場合、generalに汎用バリデーションメッセージが設定されること', () => {
      const error = {
        isAxiosError: true,
        response: { data: { detail: [], type: 'VALIDATION_ERROR' } },
      }

      expect(buildFieldErrorsFromApiError(error, isTestField, FALLBACK_MESSAGE)).toEqual({
        general: '入力内容を確認してください',
      })
    })

    it('axios以外のエラーの場合、generalに渡されたfallbackMessageが設定されること', () => {
      expect(
        buildFieldErrorsFromApiError(new Error('network error'), isTestField, FALLBACK_MESSAGE),
      ).toEqual({
        general: FALLBACK_MESSAGE,
      })
    })
  })
})
