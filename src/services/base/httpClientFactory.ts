import axios, { type AxiosRequestConfig } from 'axios'

export const createBaseClient = (config: AxiosRequestConfig) => {
  const client = axios.create(config)
  return client
}
