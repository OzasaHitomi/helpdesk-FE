import { Heading, Stack, Show, EmptyState, VStack } from '@chakra-ui/react'
import { LuInbox } from 'react-icons/lu'
import { AccountsTable } from './ui/AccountsTable'
import { type AccountItemView } from './types/AccountItemView'

interface AdminAccountPresentationalProps {
  data: {
    accounts: AccountItemView[]
  }
  activate: {
    uiState: { isSubmitting: boolean }
    handlers: { onClick: () => Promise<void> }
  }
  deactivate: {
    uiState: { isSubmitting: boolean }
    handlers: { onClick: () => Promise<void> }
  }
}

// Presentational: 実際の画面表示を担当する層
// Containerから受け取ったdataをそのまま子コンポーネントに渡すだけで、
// 自分で通信したりstateを持ったりはしない
export const AdminAccountPresentational = ({
  data,
  activate,
  deactivate,
}: AdminAccountPresentationalProps) => {
  return (
    <Stack gap={4}>
      <Heading size={'lg'}>Account一覧</Heading>
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
