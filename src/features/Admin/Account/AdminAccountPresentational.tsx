import { Heading, HStack, Stack, Show, EmptyState, VStack } from '@chakra-ui/react'
import { LuInbox } from 'react-icons/lu'
import { AccountsTable } from './ui/AccountsTable'
import { CreateAccountDialog } from './ui/CreateAccountDialog'
import { type AccountItemView } from './types/AccountItemView'
import { type AccountFieldErrors } from './types/AccountFieldErrors'
import { type CreateAccountFormInput } from './types/CreateAccountForm'
import { type UserRole } from '@/share/types/userRole'

interface AdminAccountPresentationalProps {
  data: {
    accounts: AccountItemView[]
    role: UserRole | undefined
  }
  activate: {
    uiState: { isSubmitting: boolean }
    handlers: { onClick: () => Promise<void> }
  }
  deactivate: {
    uiState: { isSubmitting: boolean }
    handlers: { onClick: () => Promise<void> }
  }
  create: {
    data: {
      accountForm: CreateAccountFormInput
      isDialogOpen: boolean
      fieldErrors: AccountFieldErrors
    }
    uiState: { isSubmitting: boolean }
    handlers: {
      onSubmitAccount: (data: CreateAccountFormInput) => Promise<void>
      setAccountForm: (data: CreateAccountFormInput) => void
      onOpenDialog: () => void
      onCloseDialog: () => void
    }
  }
}

// Presentational: 実際の画面表示を担当する層
// Containerから受け取ったdataをそのまま子コンポーネントに渡すだけで、
// 自分で通信したりstateを持ったりはしない
export const AdminAccountPresentational = ({
  data,
  activate,
  deactivate,
  create,
}: AdminAccountPresentationalProps) => {
  return (
    <Stack gap={4}>
      <HStack justifyContent={'space-between'}>
        <Heading size={'lg'}>Account一覧</Heading>
        {/* アカウントの新規発行は管理者アカウントのみ許可されているため、管理者以外にはボタンを表示しない */}
        {data.role === 'admin' && (
          <CreateAccountDialog
            data={create.data}
            uiState={create.uiState}
            handlers={create.handlers}
          />
        )}
      </HStack>
      <Show when={data.accounts.length === 0}>
        <EmptyState.Root>
          <EmptyState.Content>
            <EmptyState.Indicator>
              <LuInbox />
            </EmptyState.Indicator>
            <VStack textAlign={'center'}>
              <EmptyState.Title>アカウントがありません</EmptyState.Title>
              <EmptyState.Description>
                アカウントが発行されると、ここに一覧が表示されます
              </EmptyState.Description>
            </VStack>
          </EmptyState.Content>
        </EmptyState.Root>
      </Show>
      <Show when={data.accounts.length != 0}>
        <AccountsTable accounts={data.accounts} activate={activate} deactivate={deactivate} />
      </Show>
    </Stack>
  )
}
