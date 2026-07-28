import { useState } from 'react'
import { useCreateTicketMutation } from '../mutations/useCreateTicketMutation'
import { createTicketFormSchema, type CreateTicketForm } from '../../types/CreateTicketForm'
import { INITIAL_TICKET_FORM } from '../../constants/initialTicketForm'
import { toaster } from '@/components/ui/toaster'
import { extractErrorDetail } from '@/share/logic/extractErrorDetail'
import { resolveTicketValidationErrorMessage } from '../../logic/resolveTicketValidationErrorMessage'
import { type CreateTicketRequest } from '@/services/internal/backend/v1/types/request/ticket'

// チケット新規登録ダイアログの状態とロジックをまとめたカスタムフック
export const useCreateTicketHandler = () => {
  // mutateAsync: 実際にBEへPOSTするための関数
  // isPending: 通信中かどうか（trueの間は送信ボタンを無効化して二重送信を防ぐ）
  const { mutateAsync, isPending } = useCreateTicketMutation()

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  // フォームの入力値。初期値はINITIAL_TICKET_FORMをコピーして使う
  // （INITIAL_TICKET_FORMをそのまま渡すと、複数箇所で同じオブジェクトを共有してしまうため、スプレッドでコピーする）
  const [ticketForm, setTicketForm] = useState<CreateTicketForm>(() => ({
    ...INITIAL_TICKET_FORM,
  }))
  // バリデーションエラーやBEエラーの文言。エラーが無い時はnull
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // ダイアログを開く処理
  // 「開く」だけでなく「前回の入力内容とエラー表示を消す」こともここでまとめて行う
  const onOpenDialog = () => {
    // 開くたびに前回入力した内容とエラー表示をリセットする
    setTicketForm({ ...INITIAL_TICKET_FORM })
    setErrorMessage(null)
    setIsDialogOpen(true)
  }

  // ダイアログを閉じる処理（フォームの入力内容はあえてリセットしない＝閉じた瞬間に消えると分かりにくいため）
  const onCloseDialog = () => {
    setIsDialogOpen(false)
  }

  // 「送信」ボタンが押された時の処理
  const onSubmitTicket = async (data: CreateTicketForm) => {
    // 前回のエラー表示をいったんクリアしてから、今回の入力内容を検証する
    setErrorMessage(null)

    // zodのスキーマ（createTicketFormSchema）でFE側の入力チェックを行う
    // safeParseはthrowせず、成功/失敗を戻り値のsuccessで判定できる
    const parsed = createTicketFormSchema.safeParse(data)
    if (!parsed.success) {
      // FEバリデーションに失敗した場合はダイアログを閉じず、API呼び出しも行わない
      setErrorMessage(parsed.error.issues.map((issue) => issue.message).join('\n'))
      return
    }

    // FEのフォーム型からBEへのリクエスト型へ明示的に詰め替える
    // （現状は構造が一致しているが、Request側にフィールドが増えても暗黙に依存しないようにするため）
    const requestData: CreateTicketRequest = { ...parsed.data }

    try {
      // BEへPOSTし、成功したらダイアログを閉じて成功トーストを表示する
      await mutateAsync(requestData)
      onCloseDialog()
      toaster.create({
        type: 'success',
        title: `チケット：${requestData.title} が新規登録されました`,
      })
    } catch (e) {
      // 登録に失敗した場合も一覧画面に戻し、トースターで理由を通知する
      onCloseDialog()

      // BEが返すエラーのdetailを取り出す（文字列 or バリデーションエラーの配列 or undefined）
      // 403・500はBEが{ detail: string }で日本語の理由をそのまま返すため、その文言を使う
      // 422はdetailが配列になるため、resolveTicketValidationErrorMessageで日本語文言に変換する
      const detail = extractErrorDetail(e)

      const message =
        typeof detail === 'string'
          ? detail
          : Array.isArray(detail)
            ? resolveTicketValidationErrorMessage(detail)
            : 'チケットの登録に失敗しました'

      toaster.create({ type: 'error', title: message })
    }
  }

  return {
    // 画面の表示に使う値
    data: { ticketForm, isDialogOpen, errorMessage },
    // 通信中かどうかなど、表示の見た目だけに関わる状態
    uiState: { isSubmitting: isPending },
    // 画面から呼び出してもらう操作
    handlers: { onSubmitTicket, setTicketForm, onOpenDialog, onCloseDialog },
  }
}
