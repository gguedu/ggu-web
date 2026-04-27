import type { MailAccount, MailItem, MailUser, MailWebsiteConfig } from '~/types/mail'

export const useMailState = () => {
  const token = useState<string | null>('mail_token_state', () => null)
  const user = useState<MailUser | null>('mail_user', () => null)
  const config = useState<MailWebsiteConfig>('mail_config', () => ({
    title: 'Cloud Mail',
    domainList: []
  }))
  const accounts = useState<MailAccount[]>('mail_accounts', () => [])
  const currentAccountId = useState<number | null>('mail_current_account_id', () => null)
  const selectedEmail = useState<MailItem | null>('mail_selected_email', () => null)

  const currentAccount = computed(() => {
    if (accounts.value.length === 0) {
      return null
    }
    return accounts.value.find(item => item.accountId === currentAccountId.value) || accounts.value[0]
  })

  const normalizeToken = (value: string | null | undefined) => {
    if (!value) {
      return null
    }
    return value.startsWith('Bearer ') ? value.slice(7).trim() : value
  }

  if (import.meta.client) {
    const cached = localStorage.getItem('token') || localStorage.getItem('mail_token')
    if (!token.value && cached) {
      token.value = normalizeToken(cached)
    }

    watch(token, (value) => {
      const normalized = normalizeToken(value)
      if (normalized) {
        localStorage.setItem('token', normalized)
        localStorage.setItem('mail_token', normalized)
        if (token.value !== normalized) {
          token.value = normalized
        }
      } else {
        localStorage.removeItem('token')
        localStorage.removeItem('mail_token')
      }
    }, { immediate: true })
  }

  const clearSession = () => {
    token.value = null
    user.value = null
    accounts.value = []
    currentAccountId.value = null
    selectedEmail.value = null
    if (import.meta.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('mail_token')
    }
  }

  return {
    token,
    user,
    config,
    accounts,
    currentAccountId,
    currentAccount,
    selectedEmail,
    clearSession
  }
}
