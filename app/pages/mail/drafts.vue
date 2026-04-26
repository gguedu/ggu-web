<script setup lang="ts">
const router = useRouter()
const { drafts, loadFromStorage, removeDraft } = useMailDrafts()

const sortDrafts = () => {
  drafts.value = [...drafts.value].sort((a, b) => b.updatedAt - a.updatedAt)
}

const editDraft = (draftId: string) => {
  router.push(`/mail/compose?draftId=${draftId}`)
}

const formatDate = (timestamp: number) => new Date(timestamp).toLocaleString('zh-CN')

onMounted(() => {
  loadFromStorage()
  sortDrafts()
})
</script>

<template>
  <section class="p-6 text-white">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold">草稿箱</h2>
      <button class="text-sm px-3 py-2 rounded bg-blue-600 hover:bg-blue-500" @click="router.push('/mail/compose')">新建草稿</button>
    </div>

    <div v-if="drafts.length === 0" class="text-gray-500">暂无草稿</div>

    <div v-else class="space-y-3">
      <article v-for="item in drafts" :key="item.draftId" class="rounded-xl border border-[#333] bg-[#1c1c1e] p-4">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1 cursor-pointer" @click="editDraft(item.draftId)">
            <div class="text-base font-medium truncate">{{ item.subject || '(无主题)' }}</div>
            <div class="text-xs text-gray-500 mt-2 truncate">收件人: {{ item.receiveEmail.join(',') || '未填写' }}</div>
            <div class="text-xs text-gray-500 mt-1">最后编辑: {{ formatDate(item.updatedAt) }}</div>
          </div>

          <button class="p-1 rounded hover:bg-[#2b2b2e] text-red-300" @click="removeDraft(item.draftId)">
            <Icon name="lucide:trash-2" size="16" />
          </button>
        </div>
      </article>
    </div>
  </section>
</template>
