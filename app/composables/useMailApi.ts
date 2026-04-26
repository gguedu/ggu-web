import type { MailApiEnvelope } from '~/types/mail'

interface MailApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  params?: Record<string, unknown>
  body?: Record<string, unknown> | BodyInit | null
  headers?: Record<string, string>
}

export const useMailApi = () => {
  const runtime = useRuntimeConfig()
  const { token, clearSession } = useMailState()
  const baseURL = (runtime.public.mailApiBaseUrl || 'http://localhost:8080').replace(/\/$/, '')

  const request = async <T>(path: string, options: MailApiOptions = {}): Promise<T> => {
    const query = options.params ? new URLSearchParams(Object.entries(options.params)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)])) : null

    const target = query && query.toString() ? `${path}?${query.toString()}` : path

    const headers: Record<string, string> = {
      ...options.headers
    }
    if (token.value) {
      headers.Authorization = `Bearer ${token.value}`
    }

    let payload: MailApiEnvelope<T> | T
    try {
      payload = await $fetch<MailApiEnvelope<T> | T>(target, {
        baseURL,
        method: options.method || 'GET',
        body: options.body,
        headers
      })
    } catch (error: any) {
      const statusCode = error?.statusCode || error?.response?.status
      const data = error?.data

      if (statusCode === 401 || data?.code === 401) {
        clearSession()
        if (import.meta.client) {
          await navigateTo('/mail/login')
        }
      }

      throw new Error(data?.message || error?.message || 'Mail API error')
    }

    if (payload && typeof payload === 'object' && 'code' in payload) {
      const envelope = payload as MailApiEnvelope<T>
      if (envelope.code === 200) {
        return envelope.data
      }
      if (envelope.code === 401) {
        clearSession()
        if (import.meta.client) {
          await navigateTo('/mail/login')
        }
      }
      throw new Error(envelope.message || 'Mail API error')
    }

    return payload as T
  }

  return { request }
}
