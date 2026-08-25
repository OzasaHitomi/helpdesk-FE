import { useState } from 'react'
import { useCreateAccountMutation } from '../mutations/useCreateAccountMutation'
import { createAccountFormSchema, type CreateAccountFormInput } from '../../types/CreateAccountForm'
import { toaster } from '@/components/ui/toaster'
import { mapValidationErrorsToFiledMessage } from '@/share/logic/buildFieldErrorsFromApiError'
import { extractErrorInfo } from '@/share/logic/extractErrorInfo'
import { type AccountFieldErrors } from '../../types/AccountFieldErrors'
import { type CreateUserRequest } from '@/services/internal/backend/v1/types/request/users'

// ── 型ガード ─────────────────────────────────────────────────────────────
// CreateAccountFormInputのキー一覧。zodのissue.path[0]が指すフィールド名がこの中の値かどうかを判定するために使う
const ACCOUNT_FIELDS = ['name', 'email', 'password', 'role'] as const
type AccountField = (typeof ACCOUNT_FIELDS)[number]

// path[0]が'name' | 'email' | 'password' | 'role'のいずれかであることを確認する型ガード
// これでtrueと判定されたブロック内では、TypeScriptがfieldをAccountField型として扱えるようになる
const isAccountField = (field: unknown): field is AccountField =>
  typeof field === 'string' && (ACCOUNT_FIELDS as readonly string[]).includes(field)

// ── 初期値 ──────────────────────────────────────────────────────────────
// ダイアログの初期表示・再オープン時のリセットに使う初期値
// 種別は必ず自分で選ばせるため、初期値は未選択（空文字）にする
// このフック内の初期state / onOpenDialogでのリセットの2箇所で参照するため定数化している
const INITIAL_ACCOUNT_FORM: CreateAccountFormInput = {
  name: '',
  email: '',
  password: '',
  role: '',
}

// アカウント新規登録ダイアログの状態とロジックをまとめたカスタムフック
export const useCreateAccountHandler = () => {
  // ── 状態（state） ────────────────────────────────────────────────────
  // mutateAsync: 実際にBEへPOSTするための関数
  // isPending: 通信中かどうか（trueの間は送信ボタンを無効化して二重送信を防ぐ）
  const { mutateAsync, isPending } = useCreateAccountMutation()

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  // フォームの入力値。初期値はINITIAL_ACCOUNT_FORMをコピーして使う
  // （INITIAL_ACCOUNT_FORMをそのまま渡すと、複数箇所で同じオブジェクトを共有してしまうため、スプレッドでコピーする）
  const [accountForm, setAccountForm] = useState<CreateAccountFormInput>(() => ({
    ...INITIAL_ACCOUNT_FORM,
  }))
  // フィールドごとのバリデーションエラー。各入力欄の直下に表示するため、フィールド単位で持つ
  const [fieldErrors, setFieldErrors] = useState<AccountFieldErrors>({})

  // ── ダイアログの開閉 ──────────────────────────────────────────────────
  // ダイアログを開く処理
  // 「開く」だけでなく「前回の入力内容とエラー表示を消す」こともここでまとめて行う
  const onOpenDialog = () => {
    // 開くたびに前回入力した内容とエラー表示をリセットする
    setAccountForm({ ...INITIAL_ACCOUNT_FORM })
    setFieldErrors({})
    setIsDialogOpen(true)
  }

  // ダイアログを閉じる処理（フォームの入力内容はあえてリセットしない＝閉じた瞬間に消えると分かりにくいため）
  const onCloseDialog = () => {
    setIsDialogOpen(false)
  }

  // ── アカウント登録 ────────────────────────────────────────────────────
  // 「登録」ボタンが押された時の処理
  const onSubmitAccount = async (data: CreateAccountFormInput) => {
    // 前回のエラー表示をいったんクリアしてから、今回の入力内容を検証する
    setFieldErrors({})

    // ── ① FE側のバリデーション（zod） ──
    // safeParseはthrowせず、成功/失敗を戻り値のsuccessで判定できる
    const parsed = createAccountFormSchema.safeParse(data)
    if (!parsed.success) {
      // path（例: ['name']）を使い、フィールドごとのエラーに詰め替える
      // FEバリデーションに失敗した場合はダイアログを閉じず、API呼び出しも行わない
      const errors: AccountFieldErrors = {}
      parsed.error.issues.forEach(({ path, message }) => {
        const field = path[0]
        // isAccountFieldでname/email/password/roleのいずれかに絞り込めた場合のみ、
        // 対応するフィールドのエラーとしてそのままmessageを詰める
        if (isAccountField(field)) {
          errors[field] = message
        }
      })
      setFieldErrors(errors)
      return
    }

    // ── ② BEへの送信 ──
    // FEのフォーム型からBEへのリクエスト型へ明示的に詰め替える
    // （現状は構造が一致しているが、Request側にフィールドが増えても暗黙に依存しないようにするため）
    const requestData: CreateUserRequest = { ...parsed.data }

    try {
      // BEへPOSTし、成功したらダイアログを閉じて成功トーストを表示する
      await mutateAsync(requestData)
      onCloseDialog()
      toaster.create({
        type: 'success',
        title: `アカウントの新規登録に成功しました`,
      })
    } catch (e) {
      const info = extractErrorInfo(e)
      if (info == undefined) {
        toaster.create({ type: 'error', title: 'アカウントの発行に失敗しました' })
      } else if (info.type === 'VALIDATION_ERROR') {
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
    data: { accountForm, isDialogOpen, fieldErrors },
    // 通信中かどうかなど、表示の見た目だけに関わる状態
    uiState: { isSubmitting: isPending },
    // 画面から呼び出してもらう操作
    handlers: { onSubmitAccount, setAccountForm, onOpenDialog, onCloseDialog },
  }
}
