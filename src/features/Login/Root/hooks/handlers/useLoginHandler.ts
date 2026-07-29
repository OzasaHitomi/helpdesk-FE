import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLoginMutation } from '../mutations/useLoginMutation'
import { type LoginForm, loginFormSchema } from '../../types/LoginForm'
import { extractErrorInfo } from '@/share/logic/extractErrorInfo'

export const useLoginHandler = () => {
  const { mutateAsync } = useLoginMutation()
  const navigate = useNavigate()

  const [loginForm, setLoginForm] = useState<LoginForm>(() => ({
    email: '',
    password: '',
  }))
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onSubmitLogin = async (data: LoginForm) => {
    setErrorMessage(null)

    const parsed = loginFormSchema.safeParse(data)
    if (!parsed.success) {
      setErrorMessage(parsed.error.issues.map((issue) => issue.message).join('\n'))
      return
    }

    try {
      await mutateAsync(data) // ログインAPIを呼ぶ
      void navigate('/') // ログイン成功したらトップページ（'/'）に移動する
    } catch (e) {
      // 401(メールアドレス/パスワード不一致)・403(利用停止中)はBEが{ detail: string }で理由を返すためそのまま画面表示に使う
      // 422(バリデーションエラー)はdetailが配列になるため、その場合は汎用メッセージにフォールバックする
      // extractErrorInfo: axiosエラーからBEのdetail・typeを取り出す共通関数（useCreateTicketHandlerと共用）
      // ここではtypeは使わず、detailの中身だけで表示文言を決める
      const info = extractErrorInfo(e)
      setErrorMessage(typeof info?.detail === 'string' ? info.detail : 'ログインに失敗しました')
    }
  }

  return {
    data: { loginForm, errorMessage },
    handlers: { onSubmitLogin, setLoginForm },
  }
}
