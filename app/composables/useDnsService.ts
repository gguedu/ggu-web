import type { DnsAuthMe, DnsMeta, DnsRecord, DnsRecordPayload, PointLog } from '~/types/dns'

export const useDnsService = () => {
  const { request } = useDnsApi()

  const me = () => request<DnsAuthMe>('/auth/me')
  const callback = () => request<DnsAuthMe>('/auth/callback', { method: 'POST' })
  const meta = () => request<DnsMeta>('/records/meta')
  const records = () => request<DnsRecord[]>('/records')
  const createRecord = (payload: DnsRecordPayload) =>
    request<{ record: DnsRecord; user: DnsAuthMe['user'] }>('/records', { method: 'POST', body: { ...payload } })
  const updateRecord = (id: string, payload: Partial<DnsRecordPayload>) =>
    request<DnsRecord>(`/records/${id}`, { method: 'PATCH', body: { ...payload } })
  const deleteRecord = (id: string) =>
    request<{ record: DnsRecord; user: DnsAuthMe['user'] }>(`/records/${id}`, { method: 'DELETE' })
  const toggleRecord = (id: string) => request<DnsRecord>(`/records/${id}/toggle`, { method: 'PATCH' })
  const points = () => request<{ balance: number; logs: PointLog[] }>('/points')

  return {
    me,
    callback,
    meta,
    records,
    createRecord,
    updateRecord,
    deleteRecord,
    toggleRecord,
    points
  }
}
