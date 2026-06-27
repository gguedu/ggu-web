export interface DnsApiEnvelope<T = unknown> {
  success: boolean
  data?: T
  message?: string
}

export type DnsRecordType = 'A' | 'AAAA' | 'CNAME' | 'TXT' | 'MX'

export interface DnsUser {
  uid: string
  email: string
  name?: string
  points: number
  initialGrantDone: true
  createdAt: string
  lastSeenAt: string
}

export interface DnsMailUser {
  uid: string
  email: string
  name?: string
  raw?: unknown
}

export interface DnsAuthMe {
  mailUser: DnsMailUser
  user: DnsUser
  isAdmin: boolean
}

export interface DnsManagedDomainPublic {
  root: string
  enabled: boolean
  allowedTypes: DnsRecordType[]
  defaultTtl: number
  proxiedDefault: boolean
  pointCost: number
}

export interface DnsMeta {
  allowedTypes: DnsRecordType[]
  defaultTtl: number
  protectionEnabled: boolean
  domains: DnsManagedDomainPublic[]
}

export interface DnsRecord {
  id: string
  uid: string
  root: string
  zoneId: string
  cfAccountId: string
  cfRecordId: string
  secondLevel: string
  fullDomain: string
  type: DnsRecordType
  content: string
  ttl: number
  proxied: boolean
  priority?: number
  comment?: string
  pointCost: number
  enabled: boolean
  status: 'active' | 'missing' | 'error'
  createIp?: string
  createdAt: string
  updatedAt: string
  lastRefreshAt?: string
}

export interface PointLog {
  id: string
  uid: string
  delta: number
  balanceAfter: number
  reason: 'initial_grant' | 'create_record' | 'delete_refund' | 'admin_adjust'
  recordId?: string
  message?: string
  createdAt: string
}

export interface DnsRecordPayload {
  fullDomain: string
  type: DnsRecordType
  content: string
  ttl?: number
  proxied?: boolean
  priority?: number
  comment?: string
}
