<script setup lang="ts">
import type { MailItem } from '~/types/mail';

const { selectedEmail } = useMailState();
const mailService = useMailService();
const router = useRouter();

const loading = ref(false);
const emails = ref<MailItem[]>([]);

const loadStarred = async () => {
  loading.value = true;
  try {
    const result = await mailService.starList(undefined, 80);
    emails.value = result.list || [];
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const openDetail = (email: MailItem) => {
  selectedEmail.value = email;
  router.push('/mail/message');
};

const cancelStar = async (email: MailItem) => {
  await mailService.starCancel(email.emailId);
  emails.value = emails.value.filter((item) => item.emailId !== email.emailId);
};

onMounted(() => {
  loadStarred();
});
</script>

<template>
  <div class="flex-1 flex flex-col min-h-0">
    <!-- List header -->
    <div class="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] shrink-0">
      <div class="flex items-center gap-3">
        <h2 class="text-base font-semibold text-gray-200">星标邮件</h2>
        <span v-if="emails.length" class="text-xs text-gray-500">{{ emails.length }} 封</span>
      </div>
      <button
        class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.06] text-gray-400 hover:text-gray-200 transition-colors"
        title="刷新"
        @click="loadStarred"
      >
        <Icon name="lucide:refresh-cw" size="16" />
      </button>
    </div>

    <!-- Email list -->
    <div class="flex-1 overflow-y-auto">
      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 text-gray-500">
        <Icon name="lucide:loader-2" size="28" class="animate-spin mb-3" />
        <span class="text-sm">正在加载...</span>
      </div>

      <!-- Empty -->
      <div
        v-else-if="emails.length === 0"
        class="flex flex-col items-center justify-center h-full text-gray-500 py-20"
      >
        <Icon name="lucide:star" size="48" class="mb-4 opacity-20" />
        <p class="text-sm">暂无星标邮件</p>
      </div>

      <!-- List -->
      <div v-else>
        <article
          v-for="item in emails"
          :key="item.emailId"
          class="group flex items-start gap-3 px-5 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors cursor-pointer"
          @click="openDetail(item)"
        >
          <div class="pt-1 shrink-0 text-yellow-400/60">
            <Icon name="lucide:star" size="14" />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-baseline gap-2 mb-0.5">
              <span class="text-sm text-gray-300 truncate">
                {{ item.name || item.sendEmail || '-' }}
              </span>
            </div>
            <div class="text-sm text-gray-200 truncate font-medium">
              {{ item.subject || '(无主题)' }}
            </div>
          </div>

          <!-- Actions -->
          <div class="shrink-0 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity pt-0.5">
            <button
              class="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/[0.08] text-gray-500 hover:text-gray-300 transition-colors"
              @click.stop="cancelStar(item)"
            >
              <Icon name="lucide:star-off" size="14" />
            </button>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
