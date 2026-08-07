import { useState } from 'react'
import { useCreateTicketCommentMutation } from '../mutations/useCreateTicketCommentMutation'
import { createTicketCommentFormSchema } from '../../types/CreateTicketCommentForm'
import { toaster } from '@/components/ui/toaster'
import { mapValidationErrorsToFiledMessage } from '@/share/logic/buildFieldErrorsFromApiError'
import { type TicketCommentFieldErrors } from '../../types/TicketCommentFieldErrors'
import { type CreateTicketCommentRequest } from '@/services/internal/backend/v1/types/request/ticketComments'
import { extractErrorInfo } from '@/share/logic/extractErrorInfo'

// ── 型ガード ─────────────────────────────────────────────────────────────
// contentという値だけを持つ、変更できない配列を作る
const TICKET_COMMENT_FIELDS = ['content'] as const
// 配列の型に対して[number]を書く -> 「この配列の要素の型を取り出す」
type TicketCommentField = (typeof TICKET_COMMENT_FIELDS)[number]

// path[0]が'content'であることを確認する型ガード
// 渡された値が、許可された項目名（今回は content）かどうかを確認する関数
const isTicketCommentField = (field: unknown): field is TicketCommentField =>
  typeof field === 'string' && (TICKET_COMMENT_FIELDS as readonly string[]).includes(field)

// 質疑応答（対応履歴への投稿）フォームの状態とロジックをまとめたカスタムフック
export const useCreateTicketCommentHandler = (ticketId: number) => {
  // ── 状態（state） ────────────────────────────────────────────────────
  // mutateAsync: 実際にBEへPOSTするための関数
  // isPending: 通信中かどうか（trueの間は送信ボタンを無効化して二重送信を防ぐ）
  const { mutateAsync, isPending } = useCreateTicketCommentMutation(ticketId)

  const [content, setContent] = useState('')
  // フィールドごとのバリデーションエラー。入力欄の直下に表示するため、フィールド単位で持つ
  const [fieldErrors, setFieldErrors] = useState<TicketCommentFieldErrors>({})

  // ── コメント送信 ──────────────────────────────────────────────────────
  // 「送信」ボタンが押された時の処理
  const onSubmit = async () => {
    // 前回のエラー表示をいったんクリアしてから、今回の入力内容を検証する
    setFieldErrors({})

    // ── ① FE側のバリデーション（zod） ──
    const parsed = createTicketCommentFormSchema.safeParse({ content })
    if (!parsed.success) {
      const errors: TicketCommentFieldErrors = {}
      parsed.error.issues.forEach(({ path, message }) => {
        const field = path[0]
        if (isTicketCommentField(field)) {
          errors[field] = message
        }
      })
      setFieldErrors(errors)
      return
    }

    // ── ② BEへの送信 ──
    const requestData: CreateTicketCommentRequest = { ...parsed.data }

    try {
      // BEへPOSTし、成功したら入力欄をクリアして成功トーストを表示する
      await mutateAsync(requestData)
      setContent('')
      toaster.create({
        type: 'success',
        title: `ID:${String(ticketId)} 質疑応答を送信しました`,
      })
    } catch (e) {
      const info = extractErrorInfo(e)
      if (info == undefined) {
        toaster.create({ type: 'error', title: '質疑応答の送信に失敗しました' })
      } else if (info.type === 'VALIDATION_ERROR') {
        // 関数化
        // errors = {content: 'xxxxxxxx', nara: "ssss",  general: "aaaaaaa"}
        const errors = mapValidationErrorsToFiledMessage(info)
        setFieldErrors(errors)
      } else {
        const title = typeof info.detail === 'string' ? info.detail : 'システムエラーが発生しました'
        toaster.create({ type: 'error', title: title })
      }
    }
  }

  // ── 画面への受け渡し ──────────────────────────────────────────────────
  return {
    // 画面の表示に使う値
    data: { content, fieldErrors },
    // 通信中かどうかなど、表示の見た目だけに関わる状態
    uiState: { isSubmitting: isPending },
    // 画面から呼び出してもらう操作
    handlers: { setContent, onSubmit },
  }
}
