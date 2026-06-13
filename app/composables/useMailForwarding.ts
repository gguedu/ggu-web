interface MailForwardingStatus {
  sourceEmail: string
  targetEmail: string
  verified: boolean
  enabled: boolean
}

interface MailForwardingEnvelope<T> {
  success: boolean
  data?: T
  message?: string
}

export const useMailForwarding = () => {
  const runtime = useRuntimeConfig()
  const { token } = useMailState()
  const baseURL = String(runtime.public.mailForwardingApiBaseUrl || '').replace(/\/$/, '')

  const request = async <T>(path: string, options: { method?: 'GET' | 'POST' | 'DELETE', body?: Record<string, unknown> } = {}) => {
    if (!baseURL) {
      throw new Error('邮件转发服务未配置')
    }
    if (!token.value) {
      throw new Error('请先登录')
    }

    const payload = await $fetch<MailForwardingEnvelope<T>>(`${baseURL}${path}`, {
      method: options.method || 'GET',
      body: options.body,
      headers: {
        Authorization: token.value
      }
    })

    if (!payload.success) {
      throw new Error(payload.message || '邮件转发服务请求失败')
    }
    return payload.data as T
  }

  const status = () => request<MailForwardingStatus>('/forwarding/status')
  const requestVerification = (targetEmail: string) =>
    request<MailForwardingStatus>('/forwarding/request', {
      method: 'POST',
      body: { targetEmail }
    })
  const activate = () => request<MailForwardingStatus>('/forwarding/activate', { method: 'POST' })
  const disable = () => request<MailForwardingStatus>('/forwarding', { method: 'DELETE' })

  return {
    status,
    requestVerification,
    activate,
    disable
  }
}
