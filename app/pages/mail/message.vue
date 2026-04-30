<script setup lang="ts">
const router = useRouter()
const { selectedEmail } = useMailState()
const mailService = useMailService()

const email = computed(() => selectedEmail.value)

const parseRecipient = (value?: string) => {
  if (!value) {
    return '-'
  }
  try {
    const list = JSON.parse(value)
    if (Array.isArray(list)) {
      return list.map(item => item.address || item.email || '').filter(Boolean).join(', ')
    }
  } catch {
    return value
  }
  return '-'
}

const toggleStar = async () => {
  if (!email.value) {
    return
  }
  const next = email.value.isStar ? 0 : 1
  email.value.isStar = next
  try {
    if (next) {
      await mailService.starAdd(email.value.emailId)
    } else {
      await mailService.starCancel(email.value.emailId)
    }
  } catch (error) {
    console.error(error)
    email.value.isStar = next ? 0 : 1
  }
}

const removeEmail = async () => {
  if (!email.value) {
    return
  }
  await mailService.emailDelete(email.value.emailId)
  router.back()
}

const goReply = () => {
  if (!email.value) {
    return
  }
  navigateTo(`/mail/compose?replyTo=${email.value.emailId}`)
}
</script>

<template>
  <section class="p-6 text-white">
    <div v-if="!email" class="text-gray-500">没有可查看的邮件，请返回列表重新选择。</div>

    <template v-else>
      <div class="flex items-center gap-2 mb-5">
        <button class="px-2 py-1 rounded hover:bg-[#2c2c2e]" @click="router.back()">返回</button>
        <button class="px-2 py-1 rounded hover:bg-[#2c2c2e]" @click="toggleStar">{{ email.isStar ? '取消星标' : '设为星标' }}</button>
        <button class="px-2 py-1 rounded hover:bg-[#2c2c2e]" @click="goReply">回复/转发</button>
        <button class="px-2 py-1 rounded text-red-300 hover:bg-red-900/30" @click="removeEmail">删除</button>
      </div>

      <article class="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
        <h1 class="text-xl font-semibold mb-3">{{ email.subject || '(无主题)' }}</h1>

        <div class="grid gap-1 text-sm text-gray-300 mb-4">
          <div>发件人: {{ email.name || '-' }} &lt;{{ email.sendEmail || '-' }}&gt;</div>
          <div>收件人: {{ parseRecipient(email.recipient) }}</div>
          <div>时间: {{ email.createTime ? new Date(email.createTime).toLocaleString('zh-CN') : '-' }}</div>
        </div>

        <div class="border-t border-white/10 pt-4">
          <div v-if="email.content" class="prose prose-invert max-w-none" v-html="email.content" />
          <pre v-else class="whitespace-pre-wrap text-sm text-gray-200">{{ email.text || '(空内容)' }}</pre>
        </div>

        <div v-if="email.attList && email.attList.length > 0" class="mt-5 border-t border-white/10 pt-4">
          <h2 class="font-medium mb-2">附件 ({{ email.attList.length }})</h2>
          <ul class="space-y-2 text-sm">
            <li v-for="att in email.attList" :key="att.attId || att.filename" class="flex items-center justify-between rounded bg-white/5 px-3 py-2">
              <span class="truncate">{{ att.filename }}</span>
              <a v-if="att.key" class="text-blue-300 hover:text-blue-200 ml-3" :href="att.key" target="_blank">下载</a>
            </li>
          </ul>
        </div>
      </article>
    </template>
  </section>
</template>
