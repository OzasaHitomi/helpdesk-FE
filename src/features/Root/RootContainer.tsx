import { RootPresentational } from './RootPresentational'
import { useMeQuery } from '@/share/hooks/queries/useMeQuery'
import { useCreateTicketHandler } from './hooks/handlers/useCreateTicketHandler'

// Container: 各hookを呼び出して値を集め、Presentational（見た目）に橋渡しするだけの層
// ここにロジックは書かず、「誰から何を受け取って、誰にそのまま渡すか」だけに専念する
export const RootContainer = () => {
  const { data: meData } = useMeQuery()
  // useCreateTicketHandlerが返すdata/uiState/handlersを、名前が被らないようリネームして受け取る
  const {
    data: createTicketData,
    uiState: createTicketUiState,
    handlers: createTicketHandlers,
  } = useCreateTicketHandler()

  return (
    <RootPresentational
      data={{
        role: meData?.role,
        ticketForm: createTicketData.ticketForm,
        isDialogOpen: createTicketData.isDialogOpen,
        errorMessage: createTicketData.errorMessage,
      }}
      uiState={{ isSubmitting: createTicketUiState.isSubmitting }}
      handlers={{
        onSubmitTicket: createTicketHandlers.onSubmitTicket,
        setTicketForm: createTicketHandlers.setTicketForm,
        onOpenDialog: createTicketHandlers.onOpenDialog,
        onCloseDialog: createTicketHandlers.onCloseDialog,
      }}
    />
  )
}
