export interface MailApiEnvelope<T = unknown> {
  code: number
  message: string
  data: T
}

export interface MailAccount {
  accountId: number
  email: string
  name?: string
  allReceive?: number
  sort?: number
}

export interface MailAttachment {
  attId?: number
  key?: string
  filename: string
  size: number
  contentType?: string
  content?: string
}

export interface MailItem {
  emailId: number
  subject?: string
  name?: string
  sendEmail?: string
  recipient?: string
  createTime?: string | number
  content?: string
  text?: string
  unread?: number
  isStar?: number
  status?: number
  message?: string
  attList?: MailAttachment[]
  receiveEmail?: string[]
}

export interface MailListResult {
  list: MailItem[]
  latestEmail?: MailItem
}

export interface MailUser {
  userId?: number
  name: string
  email: string
  permKeys: string[]
  account: MailAccount
}

export interface MailWebsiteConfig {
  title?: string
  domainList?: string[]
  register?: number
  loginDomain?: number
  regKey?: number
}
