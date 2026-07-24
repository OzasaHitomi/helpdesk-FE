import { useMutation } from '@tanstack/react-query'
import { postLogout } from '@/services/internal/backend/v1/auth'

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: () => postLogout(),
  })
}
