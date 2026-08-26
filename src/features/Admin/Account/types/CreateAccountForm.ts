import { z } from 'zod'

import { CreatableUserRoleList } from '@/share/constants/business/creatableUserRole'

// 前後の空白のみの入力は未入力とみなしてNGにするため、trimしてからmin(1)を判定する
// パスワードの複雑さなど具体的な制約はBE(CreateUserRequest)側の責務とし、FEは未入力チェックのみ行う
// メッセージはフィールド名を含めない（各入力欄の直下に表示するため、フィールド名は文脈から自明）
export const createAccountFormSchema = z.object({
  name: z.string().trim().min(1, { message: '入力してください' }),
  email: z.string().trim().min(1, { message: '入力してください' }),
  password: z.string().min(1, { message: '入力してください' }),
  // z.enum([...]): 決められた値（'employee'か'support'）以外を許さない。未選択（空文字）もここで弾かれる
  role: z.enum(CreatableUserRoleList, { message: '選択してください' }),
})

export type CreateAccountForm = z.infer<typeof createAccountFormSchema>

// フォームの入力中は「種別が未選択」の状態を表現する必要があるため、
// バリデーション済みの型（CreateAccountForm）とは別に、roleだけ空文字を許容した入力用の型を用意する
export type CreateAccountFormInput = Omit<CreateAccountForm, 'role'> & {
  role: CreateAccountForm['role'] | ''
}
