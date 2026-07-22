import { useMutation } from '@tanstack/react-query'
import { postLogin } from '@/services/internal/backend/v1/auth'
import { type LoginRequest } from '@/services/internal/backend/v1/types/request/auth'

export const useLoginMutation = () => {
  return useMutation({
    // 受け取った引数(フォーム入力値=LoginRequest)をそのままAPI呼び出し関数に渡す
    mutationFn: (data: LoginRequest) => postLogin(data),
  })
}
