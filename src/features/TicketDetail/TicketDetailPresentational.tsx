import { EmptyState, Heading, Stack, VStack } from '@chakra-ui/react'
import { LuCircleAlert } from 'react-icons/lu'
import { TicketDetailInfo } from './ui/TicketDetailInfo'
import { TicketDetailHistory } from './ui/TicketDetailHistory'
import { LoadingPage } from '@/components/pages/LoadingPage'
import { type TicketDetailView } from './types/TicketDetailView'
import { type TicketCommentView } from './types/TicketCommentView'
import { type UserRole } from '@/share/types/userRole'

interface TicketDetailPresentationalProps {
  data: {
    role: UserRole | undefined
    ticket: TicketDetailView | undefined
    comments: TicketCommentView[]
  }
  uiState: {
    isLoading: boolean
    isError: boolean
  }
}

// Presentational: 実際の画面表示を担当する層
// Containerから受け取ったdata/uiStateをそのまま子コンポーネントに渡すだけで、
// 自分で通信したりstateを持ったりはしない
export const TicketDetailPresentational = ({ data, uiState }: TicketDetailPresentationalProps) => {
  // 初回取得中は配下の画面が一瞬映ってしまうのを防ぐため、ローディング画面を表示する
  // （キャッシュがある状態の再取得は対象外にするため、isFetchingではなくisLoadingで判定する）
  if (uiState.isLoading) {
    return <LoadingPage />
  }

  // 取得失敗(存在しないIDなど)の場合は、その旨だけを表示する
  if (uiState.isError || !data.ticket) {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <LuCircleAlert />
          </EmptyState.Indicator>
          <VStack textAlign={'center'}>
            <EmptyState.Title>チケットの取得に失敗しました</EmptyState.Title>
            <EmptyState.Description>
              URLが正しいか確認するか、時間をおいて再度お試しください
            </EmptyState.Description>
          </VStack>
        </EmptyState.Content>
      </EmptyState.Root>
    )
  }

  return (
    <Stack gap={6}>
      <Heading size={'lg'}>{`ID：${String(data.ticket.id)}`}</Heading>
      <TicketDetailInfo data={{ ticket: data.ticket, role: data.role }} />
      <TicketDetailHistory data={{ comments: data.comments }} />
    </Stack>
  )
}
