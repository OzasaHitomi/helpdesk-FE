import { z } from 'zod'

// zod: 「この値はこういう形・こういうルールであるべき」をコードで定義できるライブラリ
// z.object({...})で「フォーム全体はこういうオブジェクトである」というスキーマ（設計図）を作る
// 前後の空白のみの入力は未入力とみなしてNGにするため、trimしてからmin(1)を判定する
export const createTicketFormSchema = z.object({
  title: z
    .string()
    .trim()
    // min(1, {...}): 1文字以上必須。abort: trueにすると、この条件で失敗した時点で以降のチェック(max)を評価しない
    .min(1, { message: '要件を入力してください', abort: true })
    .max(255, { message: '要件は255文字以内で入力してください' }),
  detail: z.string().trim().min(1, { message: '詳細を入力してください', abort: true }),
  // z.enum([...]): 決められた値（ここでは'public'か'private'）以外を許さない
  visibility: z.enum(['public', 'private']),
})

// z.infer<typeof ...>: 上で定義したスキーマから型を自動で作る
// スキーマ（実行時のチェックルール）と型（コンパイル時のチェックルール）を別々に手で書くと、
// どちらかだけ直して食い違う事故が起きるので、片方から生成することで一致させる
export type CreateTicketForm = z.infer<typeof createTicketFormSchema>

// フォームの初期値（INITIAL_TICKET_FORM）は「型」ではなくビジネス定数のため、
// ../constants/initialTicketForm.ts に分離している
