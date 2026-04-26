import type { MailAccount, MailListResult, MailUser, MailWebsiteConfig } from '~/types/mail'

export const useMailService = () => {
  const { request } = useMailApi()

  const websiteConfig = () => request<MailWebsiteConfig>('/setting/websiteConfig')
  const login = (email: string, password: string) => request<{ token: string }>('/login', { method: 'POST', body: { email, password } })
  const register = (payload: { email: string, password: string, code?: string }) => request<{ token: string }>('/register', { method: 'POST', body: payload })
  const logout = () => request<void>('/logout', { method: 'DELETE' })
  const loginUserInfo = () => request<MailUser>('/my/loginUserInfo')

  const accountList = (accountId?: number | null, size = 50, lastSort?: number | null) => {
    return request<MailAccount[]>('/account/list', { params: { accountId, size, lastSort } })
  }

  const emailList = (accountId: number, allReceive = 0, emailId?: number, timeSort = 0, size = 40, type = 0) => {
    return request<MailListResult>('/email/list', {
      params: { accountId, allReceive, emailId, timeSort, size, type }
    })
  }

  const starList = (emailId?: number, size = 40) => request<MailListResult>('/star/list', { params: { emailId, size } })
  const emailDelete = (emailIds: number[] | number) => {
    const ids = Array.isArray(emailIds) ? emailIds.join(',') : emailIds
    return request<void>(`/email/delete?emailIds=${ids}`, { method: 'DELETE' })
  }
  const emailRead = (emailIds: number[] | number) => request<void>('/email/read', { method: 'PUT', body: { emailIds: Array.isArray(emailIds) ? emailIds : [emailIds] } })
  const starAdd = (emailId: number) => request<void>('/star/add', { method: 'POST', body: { emailId } })
  const starCancel = (emailId: number) => request<void>('/star/cancel', { method: 'DELETE', params: { emailId } })

  const emailSend = (payload: Record<string, unknown>) => request('/email/send', { method: 'POST', body: payload })
  const resetPassword = (password: string) => request<void>('/my/resetPassword', { method: 'PUT', body: { password } })
  const deleteSelf = () => request<void>('/my/delete', { method: 'DELETE' })

  return {
    websiteConfig,
    login,
    register,
    logout,
    loginUserInfo,
    accountList,
    emailList,
    starList,
    emailDelete,
    emailRead,
    starAdd,
    starCancel,
    emailSend,
    resetPassword,
    deleteSelf
  }
}
