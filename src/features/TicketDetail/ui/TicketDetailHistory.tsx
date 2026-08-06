import { EmptyState, Show, Stack, Table, Text, VStack } from '@chakra-ui/react'
import { LuInbox } from 'react-icons/lu'
import { type TicketCommentView } from '../types/TicketCommentView'
import { formatDateToYmd } from '@/share/logic/format/formatDateToYmd'
import { formatTimeToHms } from '@/share/logic/format/formatTimeToHms'

interface TicketDetailHistoryProps {
  data: {
    comments: TicketCommentView[]
  }
}

// 対応履歴を表示する専用コンポーネント（見た目専用）
// デモ画面同様、見出し(列名)は持たせず、横幅いっぱいの罫線で区切られた行のみで構成する
// 表示順(降順)はBE側(GET /tickets/{id}/comments)で保証済みのため、FE側では並び替えない
export const TicketDetailHistory = ({ data }: TicketDetailHistoryProps) => {
  return (
    <Stack gap={4}>
      {/* 対応履歴が0件の場合、チケット一覧(RootPresentational)の0件時と同様に空状態を表示する */}
      <Show when={data.comments.length === 0}>
        <EmptyState.Root>
          <EmptyState.Content>
            <EmptyState.Indicator>
              <LuInbox />
            </EmptyState.Indicator>
            <VStack textAlign={'center'}>
              <EmptyState.Title>対応履歴がありません</EmptyState.Title>
              <EmptyState.Description>
                対応が行われると、ここに履歴が表示されます
              </EmptyState.Description>
            </VStack>
          </EmptyState.Content>
        </EmptyState.Root>
      </Show>
      <Show when={data.comments.length !== 0}>
        <Table.Root variant={'line'} borderTopWidth={'1px'}>
          <Table.Body>
            {data.comments.map((comment) => (
              <Table.Row key={comment.id}>
                {/* 対応日：同じセル内で日付(空白区切り)と時刻(秒まで)を改行して表示する */}
                <Table.Cell verticalAlign={'middle'} whiteSpace={'nowrap'} textAlign={'center'}>
                  <Stack gap={0}>
                    <Text as={'span'}>{formatDateToYmd(comment.createdAt)}</Text>
                    <Text as={'span'}>{formatTimeToHms(comment.createdAt)}</Text>
                  </Stack>
                </Table.Cell>
                {/* 対応者 */}
                <Table.Cell verticalAlign={'middle'} whiteSpace={'nowrap'}>
                  {comment.commenterName}
                </Table.Cell>
                {/* 質疑応答内容：全文表示のため折り返し・改行を保持し、行の中心に揃えて表示する */}
                <Table.Cell verticalAlign={'middle'} whiteSpace={'pre-wrap'} textAlign={'left'}>
                  {comment.content}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Show>
    </Stack>
  )
}
