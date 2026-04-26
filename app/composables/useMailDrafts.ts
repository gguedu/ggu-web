export interface MailLocalDraft {
  draftId: string
  receiveEmail: string[]
  subject: string
  content: string
  updatedAt: number
}

export const useMailDrafts = () => {
  const drafts = useState<MailLocalDraft[]>('mail_local_drafts', () => [])

  const loadFromStorage = () => {
    if (!process.client) {
      return
    }
    const raw = localStorage.getItem('mail_local_drafts')
    if (!raw) {
      drafts.value = []
      return
    }
    try {
      const parsed = JSON.parse(raw)
      drafts.value = Array.isArray(parsed) ? parsed : []
    } catch {
      drafts.value = []
    }
  }

  const saveToStorage = () => {
    if (!process.client) {
      return
    }
    localStorage.setItem('mail_local_drafts', JSON.stringify(drafts.value))
  }

  const upsertDraft = (payload: MailLocalDraft) => {
    const index = drafts.value.findIndex(item => item.draftId === payload.draftId)
    if (index >= 0) {
      drafts.value[index] = payload
    } else {
      drafts.value.unshift(payload)
    }
    saveToStorage()
  }

  const removeDraft = (draftId: string) => {
    drafts.value = drafts.value.filter(item => item.draftId !== draftId)
    saveToStorage()
  }

  return {
    drafts,
    loadFromStorage,
    saveToStorage,
    upsertDraft,
    removeDraft
  }
}
