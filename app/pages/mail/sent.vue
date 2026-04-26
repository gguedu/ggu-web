<script setup lang="ts">
import type { MailItem } from '~/types/mail'

const { currentAccount, selectedEmail } = useMailState()
const mailService = useMailService()
const router = useRouter()

const loading = ref(false)
const emails = ref<MailItem[]>([])

const formatDate = (value?: string | number) => value ? new Date(value).toLocaleString('zh-CN') : '-'

const loadSent = async () => {
  if (!currentAccount.value?.accountId) {
    emails.value = []
    return
  }
  loading.value = true
  try {
    const result = await mailService.emailList(currentAccount.value.accountId, currentAccount.value.allReceive || 0, undefined, 0, 60, 1)
    emails.value = result.list || []
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const openDetail = (email: MailItem) => {
  selectedEmail.value = email
  router.push('/mail/message')
}

const removeEmail = async (email: MailItem) => {
  await mailService.emailDelete(email.emailId)
  emails.value = emails.value.filter(item => item.emailId !== email.emailId)
}

watch(() => currentAccount.value?.accountId, () => {
  loadSent()
}, { immediate: true })
</script>

<template>
  <section class="p-6 text-white">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold">已发送</h2>
      <button class="text-sm px-3 py-2 rounded bg-[#2c2c2e] hover:bg-[#3a3a3d]" @click="loadSent">刷新</button>
    </div>

    <div v-if="loading" class="text-gray-400 text-sm">正在加载...</div>
    <div v-else-if="emails.length === 0" class="text-gray-500">暂无已发送邮件</div>

    <div v-else class="space-y-3">
      <article v-for="item in emails" :key="item.emailId" class="rounded-xl border border-[#333] bg-[#1c1c1e] p-4">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1 cursor-pointer" @click="openDetail(item)">
            <div class="text-sm text-gray-400">发送时间: {{ formatDate(item.createTime) }}</div>
            <div class="text-base font-medium mt-1 truncate">{{ item.subject || '(无主题)' }}</div>
            <div class="text-xs text-gray-500 mt-2">发件账户: {{ item.sendEmail || '-' }}</div>
          </div>

          <button class="p-1 rounded hover:bg-[#2b2b2e] text-red-300" @click="removeEmail(item)">
            <Icon name="lucide:trash-2" size="16" />
          </button>
        </div>
      </article>
    </div>
  </section>
</template>
