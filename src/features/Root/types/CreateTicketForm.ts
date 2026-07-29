import { z } from 'zod'

import { TicketVisibilityList } from '@/share/constants/business/ticketVisibilityType'

// zod: 「この値はこういう形・こういうルールであるべき」をコードで定義できるライブラリ
// z.object({...})で「フォーム全体はこういうオブジェクトである」というスキーマ（設計図）を作る
// 前後の空白のみの入力は未入力とみなしてNGにするため、trimしてからmin(1)を判定する
// 文字数上限などの具体的な制約はBE(CreateTicketRequest)側の責務とし、FEは未入力チェックのみ行う
// メッセージはフィールド名を含めない（各入力欄の直下に表示するため、フィールド名は文脈から自明）
export const createTicketFormSchema = z.object({
  title: z.string().trim().min(1, { message: '入力してください' }),
  detail: z.string().trim().min(1, { message: '入力してください' }),
  // z.enum([...]): 決められた値（ここでは'public'か'private'）以外を許さない
  visibility: z.enum(TicketVisibilityList, { message: '選択してください' }),
})

// z.infer<typeof ...>: 上で定義したスキーマから型を自動で作る
// スキーマ（実行時のチェックルール）と型（コンパイル時のチェックルール）を別々に手で書くと、
// どちらかだけ直して食い違う事故が起きるので、片方から生成することで一致させる
export type CreateTicketForm = z.infer<typeof createTicketFormSchema>
