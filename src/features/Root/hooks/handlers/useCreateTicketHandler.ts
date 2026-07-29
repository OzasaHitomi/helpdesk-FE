import { useState } from 'react'
import { useCreateTicketMutation } from '../mutations/useCreateTicketMutation'
import { createTicketFormSchema, type CreateTicketForm } from '../../types/CreateTicketForm'
import { toaster } from '@/components/ui/toaster'
import { extractErrorDetail } from '@/share/logic/extractErrorDetail'
import {
  transformValidationErrorTypeToJa,
  GENERAL_VALIDATION_ERROR_MESSAGE,
} from '@/share/logic/transform/transformValidationErrorTypeToJa'
import { type TicketFieldErrors } from '../../types/TicketFieldErrors'
import { type CreateTicketRequest } from '@/services/internal/backend/v1/types/request/ticket'

// ダイアログの初期表示・再オープン時のリセットに使う初期値
// 公開設定は非公開をデフォルトにする（社内向けの質問は非公開が既定の運用のため）
// このフック内の初期state / onOpenDialogでのリセットの2箇所で参照するため定数化している
const INITIAL_TICKET_FORM: CreateTicketForm = {
  title: '',
  detail: '',
  visibility: 'private',
}

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
  // フィールドごとのバリデーションエラー。各入力欄の直下に表示するため、フィールド単位で持つ
  const [fieldErrors, setFieldErrors] = useState<TicketFieldErrors>({})

  // ダイアログを開く処理
  // 「開く」だけでなく「前回の入力内容とエラー表示を消す」こともここでまとめて行う
  const onOpenDialog = () => {
    // 開くたびに前回入力した内容とエラー表示をリセットする
    setTicketForm({ ...INITIAL_TICKET_FORM })
    setFieldErrors({})
    setIsDialogOpen(true)
  }

  // ダイアログを閉じる処理（フォームの入力内容はあえてリセットしない＝閉じた瞬間に消えると分かりにくいため）
  const onCloseDialog = () => {
    setIsDialogOpen(false)
  }

  // 「送信」ボタンが押された時の処理
  const onSubmitTicket = async (data: CreateTicketForm) => {
    // 前回のエラー表示をいったんクリアしてから、今回の入力内容を検証する
    setFieldErrors({})

    // zodのスキーマ（createTicketFormSchema）でFE側の入力チェックを行う
    // safeParseはthrowせず、成功/失敗を戻り値のsuccessで判定できる
    const parsed = createTicketFormSchema.safeParse(data)
    if (!parsed.success) {
      // issue.path（例: ['title']）を使い、フィールドごとのエラーに詰め替える
      // FEバリデーションに失敗した場合はダイアログを閉じず、API呼び出しも行わない
      const errors: TicketFieldErrors = {}
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0]
        if (field === 'title') {
          errors.title = issue.message
        } else if (field === 'detail') {
          errors.detail = issue.message
        } else if (field === 'visibility') {
          errors.visibility = issue.message
        }
      })
      setFieldErrors(errors)
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
      // BEが返すエラーのdetailを取り出す（文字列 or バリデーションエラーの配列 or undefined）
      const detail = extractErrorDetail(e)

      if (Array.isArray(detail)) {
        // 422(入力バリデーションエラー)はダイアログを閉じず、各フィールドの直下にエラーを表示する
        // BEはloc(エラー箇所)とtype(エラー種別)のみを返すため、FE側で以下を行う
        //   1. loc（例: ['body', 'title']）の末尾から、エラーの原因になった入力フォームを特定する
        //   2. typeを翻訳dict(transformValidationErrorTypeToJa)で日本語文言に変換する
        //   3. フィールドごとの文言としてfieldErrorsにセットし、各入力欄の直下に表示させる
        const errors: TicketFieldErrors = {}

        if (detail.length === 0) {
          // 配列が空（＝BEの仕様変更などで想定外の形になった）場合は汎用メッセージにフォールバックする
          errors.general = GENERAL_VALIDATION_ERROR_MESSAGE
        }

        detail.forEach((item) => {
          const field = item.loc[item.loc.length - 1]
          const message = transformValidationErrorTypeToJa(item.type)
          if (field === 'title') {
            errors.title = message
          } else if (field === 'detail') {
            errors.detail = message
          } else if (field === 'visibility') {
            errors.visibility = message
          } else {
            // 想定していないフィールド名は特定の入力欄に紐付けられないため、generalに寄せる
            errors.general = GENERAL_VALIDATION_ERROR_MESSAGE
          }
        })

        setFieldErrors(errors)
        if (errors.general) {
          // 特定の入力欄に紐付けられないエラーはトーストで通知する
          toaster.create({ type: 'error', title: errors.general })
        }
        return
      }

      // 422以外（403・500・ネットワークエラー等）は一覧画面に戻し、トースターで理由を通知する
      // 403・500はBEが{ detail: string }で日本語の理由をそのまま返すため、その文言を使う
      onCloseDialog()
      const message = typeof detail === 'string' ? detail : 'チケットの登録に失敗しました'
      toaster.create({ type: 'error', title: message })
    }
  }

  return {
    // 画面の表示に使う値
    data: { ticketForm, isDialogOpen, fieldErrors },
    // 通信中かどうかなど、表示の見た目だけに関わる状態
    uiState: { isSubmitting: isPending },
    // 画面から呼び出してもらう操作
    handlers: { onSubmitTicket, setTicketForm, onOpenDialog, onCloseDialog },
  }
}
