import type { MailAccount, MailItem, MailUser, MailWebsiteConfig } from '~/types/mail'

export const useMailState = () => {
  const token = useCookie<string | null>('mail_token', { sameSite: 'lax' })
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

  if (process.client) {
    const cached = localStorage.getItem('mail_token')
    if (!token.value && cached) {
      token.value = cached
    }
    watch(token, (value) => {
      if (value) {
        localStorage.setItem('mail_token', value)
      } else {
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
