import { createBaseClient } from '@/services/base/httpClientFactory'
import { config } from '@/core/config'

const client = createBaseClient({
  baseURL: `${config.BEURL}/api/v1`,
  // CookieベースのセッションをやりとりするためBEへの認証情報の送信を許可する
  withCredentials: true,
  timeout: 10000,
})

export const internalBackendV1Client = client
