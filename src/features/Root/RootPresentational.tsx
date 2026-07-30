import { HStack, Heading, Stack } from '@chakra-ui/react'
import { CreateTicketDialog } from './ui/CreateTicketDialog'
import { TicketsTable } from './ui/TicketsTable'
import { type CreateTicketForm } from './types/CreateTicketForm'
import { type TicketFieldErrors } from '@/features/Root/types/TicketFieldErrors'
import { type UserRole } from '@/share/types/userRole'
import { type TicketItemView } from './types/TicketItemView'

interface RootPresentationalProps {
  data: {
    role: UserRole | undefined
    ticketForm: CreateTicketForm
    isDialogOpen: boolean
    fieldErrors: TicketFieldErrors
    tickets: TicketItemView[]
  }
  uiState: {
    isSubmitting: boolean
  }
  handlers: {
    onSubmitTicket: (data: CreateTicketForm) => Promise<void>
    setTicketForm: (data: CreateTicketForm) => void
    onOpenDialog: () => void
    onCloseDialog: () => void
  }
}

// Presentational: 実際の画面表示を担当する層
// Containerから受け取ったdata/uiState/handlersをそのまま子コンポーネントに渡すだけで、
// 自分で通信したりstateを持ったりはしない
export const RootPresentational = ({ data, uiState, handlers }: RootPresentationalProps) => {
  return (
    <Stack gap={4}>
      <HStack justifyContent={'space-between'}>
        <Heading size={'lg'}>Tickets</Heading>
        {/* チケットの新規作成は社員アカウントのみ許可されているため、社員以外にはボタンを表示しない */}
        {data.role === 'employee' && (
          <CreateTicketDialog
            data={{
              ticketForm: data.ticketForm,
              isDialogOpen: data.isDialogOpen,
              fieldErrors: data.fieldErrors,
            }}
            uiState={{ isSubmitting: uiState.isSubmitting }}
            handlers={{
              onSubmitTicket: handlers.onSubmitTicket,
              setTicketForm: handlers.setTicketForm,
              onOpenDialog: handlers.onOpenDialog,
              onCloseDialog: handlers.onCloseDialog,
            }}
          />
        )}
      </HStack>
      <TicketsTable tickets={data.tickets} />
    </Stack>
  )
}
