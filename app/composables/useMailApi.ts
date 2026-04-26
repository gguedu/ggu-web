import type { MailApiEnvelope } from '~/types/mail'

interface MailApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  params?: Record<string, unknown>
  body?: unknown
  headers?: Record<string, string>
}

export const useMailApi = () => {
  const runtime = useRuntimeConfig()
  const { token, clearSession } = useMailState()

  const request = async <T>(path: string, options: MailApiOptions = {}): Promise<T> => {
    const query = options.params ? new URLSearchParams(Object.entries(options.params)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)])) : null

    const target = query && query.toString() ? `${path}?${query.toString()}` : path

    const payload = await $fetch<MailApiEnvelope<T> | T>(target, {
      baseURL: runtime.public.mailApiBaseUrl,
      method: options.method || 'GET',
      body: options.body,
      headers: {
        Authorization: token.value || '',
        ...options.headers
      }
    })

    if (payload && typeof payload === 'object' && 'code' in payload) {
      const envelope = payload as MailApiEnvelope<T>
      if (envelope.code === 200) {
        return envelope.data
      }
      if (envelope.code === 401) {
        clearSession()
        if (process.client) {
          await navigateTo('/mail/login')
        }
      }
      throw new Error(envelope.message || 'Mail API error')
    }

    return payload as T
  }

  return { request }
}
