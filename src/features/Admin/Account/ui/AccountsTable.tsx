import { Table } from '@chakra-ui/react'
import { type AccountItemView } from '../types/AccountItemView'
import { transformUserRoleToJa } from '@/share/logic/transform/transformUserRoleToJa'
import { useActivateAccountHandler } from '../hooks/handlers/useActivateAccountHandler'
import { useDeactivateAccountHandler } from '../hooks/handlers/useDeactivateAccountHandler'
import { AccountActivateButton } from './AccountActivateButton/AccountActivateButton'
import { AccountDeactivateButton } from './AccountDeactivateButton/AccountDeactivateButton'

interface AccountsTableProps {
  accounts: AccountItemView[]
}

export const AccountsTable = ({ accounts }: AccountsTableProps) => {
  // 停止/再開ボタンの状態・onClickは全行共通のプレースホルダーのため、
  // .map()の中ではなくコンポーネントのトップレベルで1回だけ呼び出す
  const activate = useActivateAccountHandler()
  const deactivate = useDeactivateAccountHandler()

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
