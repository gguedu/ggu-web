import type { DnsApiEnvelope } from '~/types/dns'

interface DnsApiOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  params?: Record<string, unknown>
  body?: Record<string, unknown> | BodyInit | null
  headers?: Record<string, string>
  timeout?: number
}

export const useDnsApi = () => {
  const runtime = useRuntimeConfig()
  const { token, clearSession } = useMailState()
  const { openLoginModal } = useFloatingLogin()
  const configuredBaseURL = (runtime.public.dnsApiBaseUrl || 'http://127.0.0.1:8787/api').replace(/\/$/, '')
  const baseURL = configuredBaseURL.endsWith('/api') ? configuredBaseURL : `${configuredBaseURL}/api`

  const request = async <T>(path: string, options: DnsApiOptions = {}): Promise<T> => {
    const query = options.params
      ? new URLSearchParams(
          Object.entries(options.params)
            .filter(([, value]) => value !== undefined && value !== null)
            .map(([key, value]) => [key, String(value)])
        )
      : null
    const target = query && query.toString() ? `${path}?${query.toString()}` : path
    const headers: Record<string, string> = { ...options.headers }
    if (token.value) {
      headers.Authorization = token.value
    }

    try {
      const payload = await $fetch<DnsApiEnvelope<T>>(target, {
        baseURL,
        method: options.method || 'GET',
        body: options.body,
        headers,
        timeout: options.timeout
      })
      if (!payload.success) {
        throw new Error(payload.message || 'DNS API error')
      }
      return payload.data as T
    } catch (error: unknown) {
      const err = error as Record<string, unknown> | undefined
      const statusCode = (err?.statusCode as number) || ((err?.response as Record<string, unknown>)?.status as number)
      const data = err?.data as DnsApiEnvelope | undefined
      if (statusCode === 401) {
        clearSession()
        openLoginModal({ reason: '登录后才能使用 DNS 分发平台' })
      }
      throw new Error(data?.message || (err?.message as string) || 'DNS API error')
    }
  }

  return { request }
}
