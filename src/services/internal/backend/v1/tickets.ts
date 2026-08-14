import { internalBackendV1Client } from '@/services/internal/backend/v1/client'
import { type CreateTicketRequest } from '@/services/internal/backend/v1/types/request/tickets'
import {
  type CreateTicketResponse,
  type GetTicketsResponseItem,
  type GetTicketsResponseItemJson,
  type GetTicketResponse,
  type GetTicketResponseJson,
  type UnassignTicketResponse,
  type UnassignTicketResponseJson,
} from '@/services/internal/backend/v1/types/response/tickets'

const COMMON_URL = '/tickets'

// 成功時は201（登録されたチケットの内容を返す）
export const createTicket = async (body: CreateTicketRequest): Promise<CreateTicketResponse> => {
  const { data } = await internalBackendV1Client.post<CreateTicketResponse>(COMMON_URL, body)
  return data
}

// 成功時は200（チケット一覧を返す。アカウント種別による絞り込みはBE側で実施済み）
export const getTickets = async (): Promise<GetTicketsResponseItem[]> => {
  // getの後は通信で受け取るものの型指定（date型のものが文字列型として受け取られている）
  const response = await internalBackendV1Client.get<GetTicketsResponseItemJson[]>(COMMON_URL)

  // -> date型として扱いたいものを文字列型からdate型に変換する
  return response.data.map((d): GetTicketsResponseItem => ({
    ...d,
    createdAt: new Date(d.createdAt),
  }))
}

// 成功時は200（チケット詳細を返す。質問者・担当者名は現時点の画面要件に無いため含まれない）
export const getTicket = async (id: number): Promise<GetTicketResponse> => {
  const response = await internalBackendV1Client.get<GetTicketResponseJson>(
    `${COMMON_URL}/${String(id)}`,
  )

  return { ...response.data, createdAt: new Date(response.data.createdAt) }
}

// 成功時は200（担当解除後のチケット情報を返す。FE側では値を使わない）
export const unassignTicket = async (id: number): Promise<UnassignTicketResponse> => {
  const response = await internalBackendV1Client.delete<UnassignTicketResponseJson>(
    `${COMMON_URL}/${String(id)}/assign`,
  )

  return { ...response.data, updatedAt: new Date(response.data.updatedAt) }
}
