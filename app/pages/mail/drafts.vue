<script setup lang="ts">
const router = useRouter();
const { drafts, loadFromStorage, removeDraft } = useMailDrafts();
const toast = useToast();

const sortDrafts = () => {
  drafts.value = [...drafts.value].sort((a, b) => b.updatedAt - a.updatedAt);
};

const editDraft = (draftId: string) => {
  router.push(`/mail/compose?draftId=${draftId}`);
};

const formatDate = (timestamp: number) => {
  const d = new Date(timestamp);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const handleRemoveDraft = (draftId: string) => {
  removeDraft(draftId);
  toast.add({ title: '草稿已删除', color: 'success' });
};

onMounted(() => {
  loadFromStorage();
  sortDrafts();
});
</script>

<template>
  <div class="flex-1 flex flex-col min-h-0">
    <!-- List header -->
    <div
      class="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] shrink-0"
    >
      <div class="flex items-center gap-3">
        <h2 class="text-base font-semibold text-gray-200">草稿箱</h2>
        <span v-if="drafts.length" class="text-xs text-gray-500">{{ drafts.length }} 封</span>
      </div>
      <button
        class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.06] text-gray-400 hover:text-gray-200 transition-colors"
        title="新建草稿"
        @click="router.push('/mail/compose')"
      >
        <Icon name="lucide:plus" size="16" />
      </button>
    </div>

    <!-- Draft list -->
    <div class="flex-1 overflow-y-auto">
      <!-- Empty -->
      <div
        v-if="drafts.length === 0"
        class="flex flex-col items-center justify-center h-full text-gray-500 py-20"
      >
        <Icon name="lucide:file-text" size="48" class="mb-4 opacity-20" />
        <p class="text-sm">暂无草稿</p>
      </div>

      <!-- List -->
      <div v-else>
        <article
          v-for="item in drafts"
          :key="item.draftId"
          class="group flex items-start gap-3 px-5 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors cursor-pointer"
          @click="editDraft(item.draftId)"
        >
          <div class="pt-1 shrink-0 text-gray-600">
            <Icon name="lucide:file-text" size="14" />
          </div>

          <div class="flex-1 min-w-0">
            <div class="text-sm text-gray-200 truncate font-medium mb-0.5">
              {{ item.subject || '(无主题)' }}
            </div>
            <div class="flex items-center gap-3 text-xs text-gray-600">
              <span class="truncate">收件人: {{ item.receiveEmail.join(', ') || '未填写' }}</span>
              <span class="shrink-0">{{ formatDate(item.updatedAt) }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div
            class="shrink-0 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity pt-0.5"
          >
            <button
              class="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/[0.08] text-gray-500 hover:text-red-400 transition-colors"
              @click.stop="handleRemoveDraft(item.draftId)"
            >
              <Icon name="lucide:trash-2" size="14" />
            </button>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
