import { internalBackendV1Client } from '@/services/internal/backend/v1/client'
import {
  type GetTicketCommentsResponseItem,
  type GetTicketCommentsResponseItemJson,
  type CreateTicketCommentResponse,
} from '@/services/internal/backend/v1/types/response/ticketComments'
import { type CreateTicketCommentRequest } from '@/services/internal/backend/v1/types/request/ticketComments'

// 成功時は200（対応履歴一覧を返す。BE側で対応日時の降順にソート済み）
export const getTicketComments = async (
  ticketId: number,
): Promise<GetTicketCommentsResponseItem[]> => {
  const response = await internalBackendV1Client.get<GetTicketCommentsResponseItemJson[]>(
    `/tickets/${String(ticketId)}/comments`,
  )

  return response.data.map((d): GetTicketCommentsResponseItem => ({
    ...d,
    createdAt: new Date(d.createdAt),
  }))
}

// 成功時は201（登録された質疑応答の内容を返す）
export const createTicketComment = async (
  ticketId: number,
  body: CreateTicketCommentRequest,
): Promise<CreateTicketCommentResponse> => {
  const { data } = await internalBackendV1Client.post<CreateTicketCommentResponse>(
    `/tickets/${String(ticketId)}/comments`,
    body,
  )
  return data
}
