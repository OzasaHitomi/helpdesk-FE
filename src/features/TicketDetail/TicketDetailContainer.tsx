import { useParams } from 'react-router-dom'
import { TicketDetailPresentational } from './TicketDetailPresentational'
import { useGetTicketHandler } from './hooks/handlers/useGetTicketHandler'
import { useMeQuery } from '@/share/hooks/queries/useMeQuery'

// Container: 各hookを呼び出して値を集め、Presentational（見た目）に橋渡しするだけの層
// ここにロジックは書かず、「誰から何を受け取って、誰にそのまま渡すか」だけに専念する
export const TicketDetailContainer = () => {
  // ルートパラメータ(/tickets/:id)からチケットIDを取得する
  const { id } = useParams<{ id: string }>()
  const { data, uiState } = useGetTicketHandler(Number(id))
  const { data: meData } = useMeQuery()

  return (
    <TicketDetailPresentational
      data={{ role: meData?.role, ticket: data.ticket }}
      uiState={{ isLoading: uiState.isLoading, isError: uiState.isError }}
    />
  )
}
