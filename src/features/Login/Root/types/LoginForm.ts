import { z } from 'zod'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// FE側で先に弾けるバリデーションはこちらで実施し、BEのdetail(配列)による汎用エラーに丸められないようにする
export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'メールアドレスを入力してください', abort: true })
    .regex(EMAIL_PATTERN, 'メールアドレスの形式が正しくありません'),
  password: z.string().min(1, { message: 'パスワードを入力してください', abort: true }),
})

// loginFormSchemaから型を推論し、フォームの型とバリデーションルールが乖離しないようにする
export type LoginForm = z.infer<typeof loginFormSchema>
