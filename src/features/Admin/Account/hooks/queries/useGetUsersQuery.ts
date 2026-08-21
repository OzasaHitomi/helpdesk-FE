import { useQuery } from '@tanstack/react-query'
import { getUsers } from '@/services/internal/backend/v1/users'
import { userQueryKeys } from './queryKeys'

// アカウント一覧取得（GET /admin/users）
export const useGetUsersQuery = () => {
  return useQuery({
    queryKey: userQueryKeys.all,
    queryFn: getUsers,
  })
}
