import { AdminAccountPresentational } from './AdminAccountPresentational'
import { useGetUsersHandler } from './hooks/handlers/useGetUsersHandler'

// Container: 各hookを呼び出して値を集め、Presentational（見た目）に橋渡しするだけの層
// ここにロジックは書かず、「誰から何を受け取って、誰にそのまま渡すか」だけに専念する
export const AdminAccountContainer = () => {
  // 一覧の詰め替えはuseGetUsersHandler側が担当する（Containerはロジックを持たない）
  const { data } = useGetUsersHandler()

  return <AdminAccountPresentational data={{ accounts: data.accounts }} />
}
