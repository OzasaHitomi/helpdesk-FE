import { AdminAccountPresentational } from './AdminAccountPresentational'
import { useGetUsersHandler } from './hooks/handlers/useGetUsersHandler'
import { useActivateAccountHandler } from './hooks/handlers/useActivateAccountHandler'
import { useDeactivateAccountHandler } from './hooks/handlers/useDeactivateAccountHandler'
import { useCreateAccountHandler } from './hooks/handlers/useCreateAccountHandler'
import { useMeQuery } from '@/share/hooks/queries/useMeQuery'

// Container: 各hookを呼び出して値を集め、Presentational（見た目）に橋渡しするだけの層
// ここにロジックは書かず、「誰から何を受け取って、誰にそのまま渡すか」だけに専念する
export const AdminAccountContainer = () => {
  // ADDボタンの表示可否（管理者のみ）を判定するため、ログインユーザーのroleを取得する
  const { data: meData } = useMeQuery()

  // 一覧の詰め替えはuseGetUsersHandler側が担当する（Containerはロジックを持たない）
  const { data } = useGetUsersHandler()

  // 停止/再開ボタンの状態・操作も、同様にひとまとめにPresentationalへ渡す
  const activate = useActivateAccountHandler()
  const deactivate = useDeactivateAccountHandler()
  const create = useCreateAccountHandler()

  return (
    <AdminAccountPresentational
      data={{ accounts: data.accounts, role: meData?.role }}
      activate={activate}
      deactivate={deactivate}
      create={create}
    />
  )
}
