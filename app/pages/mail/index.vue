<script setup lang="ts">
import type { MailItem } from '~/types/mail'

const { currentAccount, selectedEmail, config } = useMailState()
const mailService = useMailService()
const router = useRouter()

const loading = ref(false)
const timeSort = ref(0)
const emails = ref<MailItem[]>([])
const polling = ref(false)
let refreshTimer: ReturnType<typeof setInterval> | null = null

const formatDate = (value?: string | number) => {
  if (!value) {
    return '-'
  }
  return new Date(value).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const parseRecipient = (value?: string) => {
  if (!value) {
    return ''
  }
  try {
    const list = JSON.parse(value)
    if (Array.isArray(list)) {
      return list.map(item => item.address || item.email || '').filter(Boolean).join(',')
    }
  } catch {
    return value
  }
  return ''
}

const loadEmails = async () => {
  if (!currentAccount.value?.accountId) {
    emails.value = []
    return
  }
  loading.value = true
  try {
    const result = await mailService.emailList(currentAccount.value.accountId, currentAccount.value.allReceive || 0, undefined, timeSort.value, 60, 0)
    emails.value = result.list || []
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const mergeLatestItems = (items: MailItem[]) => {
  if (!items.length) {
    return
  }

  const existing = new Set(emails.value.map(item => item.emailId))
  const incoming = items.filter(item => !existing.has(item.emailId))
  if (!incoming.length) {
    return
  }

  emails.value = [...incoming, ...emails.value]
}

const loadLatest = async () => {
  if (polling.value || !currentAccount.value?.accountId || timeSort.value !== 0) {
    return
  }

  polling.value = true
  try {
    const latestId = emails.value[0]?.emailId || 0
    const result = await mailService.emailLatest(latestId, currentAccount.value.accountId, currentAccount.value.allReceive || 0)
    const latestList = [result.latestEmail, ...(result.list || [])].filter(Boolean) as MailItem[]
    mergeLatestItems(latestList)
  } catch (error) {
    console.error(error)
  } finally {
    polling.value = false
  }
}

const stopAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

const startAutoRefresh = () => {
  stopAutoRefresh()
  const seconds = Number(config.value.autoRefresh ?? 0)
  if (seconds === 0) {
    return
  }
  const interval = seconds > 1 ? seconds * 1000 : 3000
  refreshTimer = setInterval(() => {
    loadLatest()
  }, interval)
}

const toggleSort = () => {
  timeSort.value = timeSort.value ? 0 : 1
  loadEmails()
}

const goMessage = async (email: MailItem) => {
  selectedEmail.value = email
  if (email.unread === 0 || email.unread === 1) {
    try {
      await mailService.emailRead(email.emailId)
      email.unread = 1
    } catch {
      // keep silent
    }
  }
  router.push('/mail/message')
}

const removeEmail = async (email: MailItem) => {
  try {
    await mailService.emailDelete(email.emailId)
    emails.value = emails.value.filter(item => item.emailId !== email.emailId)
  } catch (error) {
    console.error(error)
  }
}

const toggleStar = async (email: MailItem) => {
  const targetStar = email.isStar ? 0 : 1
  email.isStar = targetStar
  try {
    if (targetStar) {
      await mailService.starAdd(email.emailId)
    } else {
      await mailService.starCancel(email.emailId)
    }
  } catch (error) {
    email.isStar = targetStar ? 0 : 1
    console.error(error)
  }
}

watch(() => currentAccount.value?.accountId, () => {
  loadEmails()
  startAutoRefresh()
}, { immediate: true })

watch(() => config.value.autoRefresh, () => {
  startAutoRefresh()
}, { immediate: true })

onBeforeUnmount(() => {
  stopAutoRefresh()
})
</script>

<template>
  <div class="flex-1 flex flex-col min-h-0 bg-[#1c1c1e] text-white">
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#333] shadow-sm">
      <div class="flex items-center gap-4">
        <h2 class="text-lg font-bold text-gray-200">收件箱</h2>
        <button class="p-2 rounded-full hover:bg-[#2c2c2e] text-gray-400 transition" @click="toggleSort">
          <Icon :name="timeSort === 0 ? 'lucide:arrow-down' : 'lucide:arrow-up'" size="20" />
        </button>
      </div>
      <button class="text-sm px-3 py-2 rounded bg-[#2c2c2e] hover:bg-[#3a3a3d]" @click="loadEmails">刷新</button>
    </div>

    <div class="flex-1 overflow-y-auto px-4 py-4">
      <div v-if="loading" class="text-gray-400 text-sm">正在加载邮件...</div>

      <div v-else-if="emails.length === 0" class="flex flex-col items-center justify-center h-full text-gray-500">
        <Icon name="lucide:inbox" size="64" class="mb-4 opacity-30" />
        <p>暂无邮件</p>
      </div>

      <div v-else class="space-y-2">
        <article
          v-for="email in emails"
          :key="email.emailId"
          class="bg-[#2c2c2e]/60 hover:bg-[#333336] p-4 rounded-xl border border-transparent hover:border-gray-600 transition-all"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0 flex-1 cursor-pointer" @click="goMessage(email)">
              <div class="flex items-center gap-2 text-sm text-gray-300">
                <span :class="email.unread === 1 ? 'text-gray-300' : 'text-blue-300 font-medium'">{{ email.name || email.sendEmail || '未知发件人' }}</span>
                <span class="text-xs text-gray-500">{{ formatDate(email.createTime) }}</span>
              </div>
              <div class="mt-1 text-sm font-medium text-gray-100 truncate">{{ email.subject || '(无主题)' }}</div>
              <div class="mt-1 text-xs text-gray-400 truncate">{{ parseRecipient(email.recipient) }}</div>
            </div>

            <div class="flex items-center gap-2">
              <button class="p-1 rounded hover:bg-[#1f1f21]" @click="toggleStar(email)">
                <Icon :name="email.isStar ? 'lucide:star' : 'lucide:star-off'" size="16" />
              </button>
              <button class="p-1 rounded hover:bg-[#1f1f21] text-red-300" @click="removeEmail(email)">
                <Icon name="lucide:trash-2" size="16" />
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>