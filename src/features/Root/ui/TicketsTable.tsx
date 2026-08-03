import { Table, Link } from '@chakra-ui/react'
import { type TicketItemView } from '../types/TicketItemView'
import { transformTicketVisibilityToJa } from '@/share/logic/transform/transformTicketVisibilityToJa'
import { transformTicketStatusToJa } from '@/share/logic/transform/transformTicketStatusToJa'
import { formatDateToYmd } from '@/share/logic/format/formatDateToYmd'

interface TicketsTableProps {
  tickets: TicketItemView[]
}

export const TicketsTable = ({ tickets }: TicketsTableProps) => {
  return (
    <Table.Root variant={'line'}>
      <Table.Header>
        <Table.Row bg={'gray.200'}>
          <Table.ColumnHeader textAlign={'center'}>質問日</Table.ColumnHeader>
          <Table.ColumnHeader textAlign={'center'}>タイトル</Table.ColumnHeader>
          <Table.ColumnHeader textAlign={'center'}>公開状況</Table.ColumnHeader>
          <Table.ColumnHeader textAlign={'center'}>ステータス</Table.ColumnHeader>
          <Table.ColumnHeader textAlign={'center'}>質問者</Table.ColumnHeader>
          <Table.ColumnHeader textAlign={'center'}>サポート担当</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {tickets.map((ticket) => {
          return (
            <Table.Row key={ticket.id}>
              <Table.Cell textAlign={'center'}>{formatDateToYmd(ticket.createdAt)}</Table.Cell>
              <Table.Cell>
                {/* ↓タイトルクリックで該当チケットの詳細画面(/tickets/:id)に遷移する */}
                <Link href={`/tickets/${String(ticket.id)}`}>{ticket.title}</Link>
              </Table.Cell>
              <Table.Cell textAlign={'center'}>
                {transformTicketVisibilityToJa(ticket.visibility)}
              </Table.Cell>
              <Table.Cell textAlign={'center'}>
                {transformTicketStatusToJa(ticket.status)}
              </Table.Cell>
              <Table.Cell textAlign={'center'}>{ticket.questionerName}</Table.Cell>
              <Table.Cell textAlign={'center'}>{ticket.supportUserName ?? '-'}</Table.Cell>
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table.Root>
  )
}
