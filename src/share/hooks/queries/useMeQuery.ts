import { useQuery } from '@tanstack/react-query'
import { getMe } from '@/services/internal/backend/v1/auth'
import { authQueryKeys } from './queryKeys'

// 保護されたページ（RequireAuth配下）が表示される度に実行され、
// 今のCookieがログイン済みとして有効かどうかをGET /auth/meで確認する
export const useMeQuery = () => {
  return useQuery({
    queryKey: authQueryKeys.me,
    queryFn: getMe,
    // 401はリトライしても結果が変わらないため再試行しない
    retry: false,
    // roleはログアウトするまで変わらないため、他の画面（Header等）から呼ばれても再取得しないようにする
    // ※これがないと画面遷移やウィンドウフォーカス復帰の度に無駄な/auth/me再フェッチが発生する
    staleTime: Infinity,
  })
}
