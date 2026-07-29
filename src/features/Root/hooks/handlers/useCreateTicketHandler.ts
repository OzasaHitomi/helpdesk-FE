import { useState } from 'react'
import { useCreateTicketMutation } from '../mutations/useCreateTicketMutation'
import { createTicketFormSchema, type CreateTicketForm } from '../../types/CreateTicketForm'
import { toaster } from '@/components/ui/toaster'
import { extractErrorInfo } from '@/share/logic/extractErrorInfo'
import {
  transformValidationErrorTypeToJa,
  GENERAL_VALIDATION_ERROR_MESSAGE,
} from '@/share/logic/transform/transformValidationErrorTypeToJa'
import { type TicketFieldErrors } from '../../types/TicketFieldErrors'
import { type CreateTicketRequest } from '@/services/internal/backend/v1/types/request/ticket'

// ── 型ガード ─────────────────────────────────────────────────────────────
// CreateTicketFormのキー一覧。zodのissue.path[0]が指すフィールド名がこの中の値かどうかを判定するために使う
const TICKET_FIELDS = ['title', 'detail', 'visibility'] as const
type TicketField = (typeof TICKET_FIELDS)[number]

// path[0]が'title' | 'detail' | 'visibility'のいずれかであることを確認する型ガード
// これでtrueと判定されたブロック内では、TypeScriptがfieldをTicketField型として扱えるようになる
const isTicketField = (field: unknown): field is TicketField =>
  typeof field === 'string' && (TICKET_FIELDS as readonly string[]).includes(field)

// ── 初期値 ──────────────────────────────────────────────────────────────
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
  // ── 状態（state） ────────────────────────────────────────────────────
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

  // ── ダイアログの開閉 ──────────────────────────────────────────────────
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

  // ── チケット送信 ──────────────────────────────────────────────────────
  // 「送信」ボタンが押された時の処理
  const onSubmitTicket = async (data: CreateTicketForm) => {
    // 前回のエラー表示をいったんクリアしてから、今回の入力内容を検証する
    setFieldErrors({})

    // ── ① FE側のバリデーション（zod） ──
    // safeParseはthrowせず、成功/失敗を戻り値のsuccessで判定できる
    const parsed = createTicketFormSchema.safeParse(data)
    if (!parsed.success) {
      // path（例: ['title']）を使い、フィールドごとのエラーに詰め替える
      // FEバリデーションに失敗した場合はダイアログを閉じず、API呼び出しも行わない
      const errors: TicketFieldErrors = {}
      parsed.error.issues.forEach(({ path, message }) => {
        const field = path[0]
        // isTicketFieldでtitle/detail/visibilityのいずれかに絞り込めた場合のみ、
        // 対応するフィールドのエラーとしてそのままmessageを詰める
        if (isTicketField(field)) {
          errors[field] = message
        }
      })
      setFieldErrors(errors)
      return
    }

    // ── ② BEへの送信 ──
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
      // ── ③ 送信に失敗した場合のエラー処理 ──
      // BEが返すエラーのdetail・typeを取り出す
      const info = extractErrorInfo(e)
      const errors: TicketFieldErrors = {}

      // ③-1. ここまでで「何が起きたか」の情報だけをerrorsに詰める
      if (info?.type === 'VALIDATION_ERROR') {
        // 422(入力バリデーションエラー)。BEはloc(エラー箇所)とtype(エラー種別)のみを返すため、FE側で以下を行う
        //   1. loc（例: ['body', 'title']）の末尾から、エラーの原因になった入力フォームを特定する
        //   2. typeを翻訳dict(transformValidationErrorTypeToJa)で日本語文言に変換する
        //   3. フィールドごとの文言としてerrorsにセットする
        const detail = info.detail
        if (!Array.isArray(detail) || detail.length === 0) {
          // detailが配列でない、または空（＝BEの仕様変更などで想定外の形になった）場合は汎用メッセージにフォールバックする
          errors.general = GENERAL_VALIDATION_ERROR_MESSAGE
        } else {
          detail.forEach(({ loc, type }) => {
            const field = loc[loc.length - 1]
            const message = transformValidationErrorTypeToJa(type)
            if (isTicketField(field)) {
              errors[field] = message
            } else {
              // 想定していないフィールド名は特定の入力欄に紐付けられないため、generalに寄せる
              errors.general = GENERAL_VALIDATION_ERROR_MESSAGE
            }
          })
        }
      } else {
        // 422以外（403・500・ネットワークエラー等）
        // 403・500はBEが{ detail: string }で日本語の理由をそのまま返すため、その文言を使う
        errors.general =
          typeof info?.detail === 'string' ? info.detail : 'チケットの登録に失敗しました'
      }

      // ③-2. ここから先は「どう出力するか」だけを考える
      if (errors.general) {
        // 特定の入力欄に紐付けられないエラーは、ダイアログを閉じてトーストで通知する
        onCloseDialog()
        toaster.create({ type: 'error', title: errors.general })
        return
      }

      // フィールドごとのエラーは、ダイアログを閉じずに各入力欄の直下に表示する
      setFieldErrors(errors)
    }
  }

  // ── 画面への受け渡し ──────────────────────────────────────────────────
  return {
    // 画面の表示に使う値
    data: { ticketForm, isDialogOpen, fieldErrors },
    // 通信中かどうかなど、表示の見た目だけに関わる状態
    uiState: { isSubmitting: isPending },
    // 画面から呼び出してもらう操作
    handlers: { onSubmitTicket, setTicketForm, onOpenDialog, onCloseDialog },
  }
}
