// POST /tickets/{id}/comments に送るリクエストボディの型
export type CreateTicketCommentRequest = {
  content: string
}
