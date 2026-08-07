import { z } from 'zod'

// 前後の空白のみの入力は未入力とみなしてNGにするため、trimしてからmin(1)を判定する
// 文字数上限などの具体的な制約はBE(CreateTicketCommentRequest)側の責務とし、FEは未入力チェックのみ行う
export const createTicketCommentFormSchema = z.object({
  content: z.string().trim().min(1, { message: '入力してください' }),
})

export type CreateTicketCommentForm = z.infer<typeof createTicketCommentFormSchema>
