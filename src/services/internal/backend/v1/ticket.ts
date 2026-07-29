import { internalBackendV1Client } from '@/services/internal/backend/v1/client'
import { type CreateTicketRequest } from '@/services/internal/backend/v1/types/request/ticket'
import { type CreateTicketResponse } from '@/services/internal/backend/v1/types/response/ticket'

const COMMON_URL = '/tickets'

// 成功時は201（登録されたチケットの内容を返す）
export const createTicket = async (body: CreateTicketRequest): Promise<CreateTicketResponse> => {
  const { data } = await internalBackendV1Client.post<CreateTicketResponse>(COMMON_URL, body)
  return data
}
