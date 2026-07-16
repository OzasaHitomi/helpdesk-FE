import { z } from 'zod'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// FE側で先に弾けるバリデーションはこちらで実施し、BEのdetail(配列)による汎用エラーに丸められないようにする
export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'メールアドレスを入力してください', abort: true })
    .regex(EMAIL_PATTERN, 'メールアドレスの形式が正しくありません'),
  password: z
    .string()
    .min(1, { message: 'パスワードを入力してください', abort: true })
    .min(8, 'パスワードは8文字以上で入力してください')
    .regex(/[A-Z]/, 'パスワードは大文字を含めてください')
    .regex(/[0-9]/, 'パスワードは数字を含めてください'),
})
