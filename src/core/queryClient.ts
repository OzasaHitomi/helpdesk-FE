import { QueryClient } from '@tanstack/react-query'

// TanStack Queryを使えるようにするためのクライアント
// アプリ全体でAPI通信のキャッシュなどを管理する
export const queryClient = new QueryClient()
