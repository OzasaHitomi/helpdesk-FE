import { z } from 'zod'

// 型定義の箱
const envSchema = z.object({
  VITE_BACKEND_URL: z.url(),
})

// 検証。型定義したものがenvファイルの内容が一致しているか
const env = envSchema.parse(import.meta.env)

// configに値するのは、{から、}まで
// 呼び出しの時はconfig.BEURLのようにする(src/services/internal/backend/v1/client.ts)
export const config = {
  BEURL: env.VITE_BACKEND_URL,
}
