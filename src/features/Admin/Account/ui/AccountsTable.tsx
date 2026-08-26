import { Table } from '@chakra-ui/react'
import { type AccountItemView } from '../types/AccountItemView'
import { transformUserRoleToJa } from '@/share/logic/transform/transformUserRoleToJa'
import { AccountActivateButton } from './AccountActivateButton/AccountActivateButton'
import { AccountDeactivateButton } from './AccountDeactivateButton/AccountDeactivateButton'

interface AccountsTableProps {
  accounts: AccountItemView[]
  activate: {
    uiState: { isSubmitting: boolean }
    handlers: { onClick: () => Promise<void> }
  }
  deactivate: {
    uiState: { isSubmitting: boolean }
    handlers: { onClick: (userId: number) => Promise<void> }
  }
}

export const AccountsTable = ({ accounts, activate, deactivate }: AccountsTableProps) => {
  return (
    <Table.Root variant={'line'}>
      <Table.Header>
        <Table.Row bg={'gray.200'}>
          <Table.ColumnHeader textAlign={'center'}>名前</Table.ColumnHeader>
          <Table.ColumnHeader textAlign={'center'}>Email</Table.ColumnHeader>
          <Table.ColumnHeader textAlign={'center'}>種別</Table.ColumnHeader>
          <Table.ColumnHeader textAlign={'center'}>利用状況</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {accounts.map((account) => {
          return (
            <Table.Row key={account.id}>
              <Table.Cell textAlign={'center'}>{account.name}</Table.Cell>
              <Table.Cell textAlign={'center'}>{account.email}</Table.Cell>
              <Table.Cell textAlign={'center'}>{transformUserRoleToJa(account.role)}</Table.Cell>
              <Table.Cell textAlign={'center'}>
                {account.isActive ? (
                  <AccountDeactivateButton
                    userId={account.id}
                    uiState={deactivate.uiState}
                    handlers={deactivate.handlers}
                  />
                ) : (
                  <AccountActivateButton uiState={activate.uiState} handlers={activate.handlers} />
                )}
              </Table.Cell>
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table.Root>
  )
}
