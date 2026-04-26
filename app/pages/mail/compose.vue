<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const mailService = useMailService()
const { currentAccount, user } = useMailState()
const { drafts, loadFromStorage, upsertDraft, removeDraft } = useMailDrafts()

const loading = ref(false)
const toText = ref('')
const subject = ref('')
const content = ref('')
const files = ref<File[]>([])

const draftId = computed(() => {
  const value = route.query.draftId
  return typeof value === 'string' ? value : ''
})

const loadDraft = () => {
  loadFromStorage()
  if (!draftId.value) {
    return
  }
  const draft = drafts.value.find(item => item.draftId === draftId.value)
  if (!draft) {
    return
  }
  toText.value = draft.receiveEmail.join(',')
  subject.value = draft.subject
  content.value = draft.content
}

const chooseFiles = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files) {
    return
  }
  files.value = [...files.value, ...Array.from(input.files)]
  input.value = ''
}

const removeFile = (index: number) => {
  files.value.splice(index, 1)
}

const fileToBase64 = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(String(reader.result).split(',')[1] || '')
  reader.onerror = reject
  reader.readAsDataURL(file)
})

const send = async () => {
  const receiveEmail = toText.value.split(/[,，]/).map(item => item.trim()).filter(Boolean)
  if (receiveEmail.length === 0) {
    alert('请至少填写一个收件人')
    return
  }
  if (!subject.value.trim()) {
    alert('请填写主题')
    return
  }
  if (!content.value.trim()) {
    alert('请填写正文')
    return
  }
  if (!currentAccount.value?.accountId) {
    alert('当前没有可用的发件账户')
    return
  }

  loading.value = true
  try {
    const attachments = await Promise.all(files.value.map(async (file) => ({
      filename: file.name,
      size: file.size,
      contentType: file.type,
      content: await fileToBase64(file)
    })))

    await mailService.emailSend({
      accountId: currentAccount.value.accountId,
      sendEmail: currentAccount.value.email || user.value?.email,
      name: currentAccount.value.name || user.value?.name,
      receiveEmail,
      subject: subject.value,
      content: content.value,
      text: content.value,
      sendType: route.query.replyTo ? 'reply' : '',
      emailId: route.query.replyTo ? Number(route.query.replyTo) : 0,
      attachments
    })

    if (draftId.value) {
      removeDraft(draftId.value)
    }

    alert('发送成功')
    await router.push('/mail/sent')
  } catch (error) {
    console.error(error)
    alert('发送失败，请检查后端接口与参数配置')
  } finally {
    loading.value = false
  }
 }

 const saveDraft = () => {
  const payload = {
     draftId: draftId.value || crypto.randomUUID(),
     receiveEmail: toText.value.split(/[,，]/).map(item => item.trim()).filter(Boolean),
     subject: subject.value,
     content: content.value,
     updatedAt: Date.now()
   }

  upsertDraft(payload)

   alert('草稿已保存')
 }

onMounted(() => {
  loadDraft()
})
</script>

<template>
  <section class="p-6 text-white max-w-4xl">
    <h2 class="text-xl font-semibold mb-4">写邮件</h2>

    <div class="space-y-4">
      <div>
         <label class="block text-sm text-gray-400 mb-1">收件人（多个用逗号分隔）</label>
         <input v-model="toText" class="w-full rounded border border-[#333] bg-[#1c1c1e] px-3 py-2" placeholder="user@example.com" />
      </div>

      <div>
         <label class="block text-sm text-gray-400 mb-1">主题</label>
         <input v-model="subject" class="w-full rounded border border-[#333] bg-[#1c1c1e] px-3 py-2" placeholder="邮件主题" />
      </div>

      <div>
         <label class="block text-sm text-gray-400 mb-1">正文</label>
         <textarea v-model="content" rows="12" class="w-full rounded border border-[#333] bg-[#1c1c1e] px-3 py-2" placeholder="请输入邮件正文" />
      </div>

      <div>
         <label class="inline-flex items-center gap-2 px-3 py-2 rounded bg-[#2c2c2e] hover:bg-[#3a3a3d] cursor-pointer">
           <Icon name="lucide:paperclip" size="16" />
           <span>添加附件</span>
           <input type="file" multiple class="hidden" @change="chooseFiles" />
         </label>

         <ul v-if="files.length > 0" class="mt-2 space-y-1 text-sm text-gray-300">
           <li v-for="(file, idx) in files" :key="`${file.name}-${idx}`" class="flex items-center justify-between rounded bg-[#242426] px-3 py-2">
             <span class="truncate">{{ file.name }} ({{ Math.ceil(file.size / 1024) }} KB)</span>
             <button class="text-red-300" @click="removeFile(idx)">移除</button>
           </li>
         </ul>
      </div>

      <div class="flex items-center gap-3">
         <button class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-60" :disabled="loading" @click="send">
           {{ loading ? '发送中...' : '发送' }}
         </button>
         <button class="px-4 py-2 rounded bg-[#2c2c2e] hover:bg-[#3a3a3d]" @click="saveDraft">保存草稿</button>
         <button class="px-4 py-2 rounded bg-[#2c2c2e] hover:bg-[#3a3a3d]" @click="router.back()">取消</button>
      </div>
    </div>
  </section>
</template>
