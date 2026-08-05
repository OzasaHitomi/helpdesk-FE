import { internalBackendV1Client } from '@/services/internal/backend/v1/client'
import {
  type GetTicketCommentsResponseItem,
  type GetTicketCommentsResponseItemJson,
} from '@/services/internal/backend/v1/types/response/ticketComments'

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
