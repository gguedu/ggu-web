<script setup lang="ts">
import type { MailItem } from '~/types/mail';

const { currentAccount, selectedEmail, config } = useMailState();
const mailService = useMailService();
const router = useRouter();
const toast = useToast();

const loading = ref(false);
const timeSort = ref(0);
const emails = ref<MailItem[]>([]);
const polling = ref(false);
let refreshTimer: ReturnType<typeof setInterval> | null = null;

const formatDate = (value?: string | number) => {
  if (!value) return '-';
  const d = new Date(value);
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

const parseRecipient = (value?: string) => {
  if (!value) return '';
  try {
    const list = JSON.parse(value);
    if (Array.isArray(list)) {
      return list
        .map((item) => item.address || item.email || '')
        .filter(Boolean)
        .join(', ');
    }
  } catch {
    return value;
  }
  return '';
};

const loadEmails = async () => {
  if (!currentAccount.value?.accountId) {
    emails.value = [];
    return;
  }
  loading.value = true;
  try {
    const result = await mailService.emailList(
      currentAccount.value.accountId,
      currentAccount.value.allReceive || 0,
      undefined,
      timeSort.value,
      60,
      0,
    );
    emails.value = result.list || [];
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const mergeLatestItems = (items: MailItem[]) => {
  if (!items.length) return;
  const existing = new Set(emails.value.map((item) => item.emailId));
  const incoming = items.filter((item) => !existing.has(item.emailId));
  if (!incoming.length) return;
  emails.value = [...incoming, ...emails.value];
};

const loadLatest = async () => {
  if (polling.value || !currentAccount.value?.accountId || timeSort.value !== 0) return;
  polling.value = true;
  try {
    const latestId = emails.value[0]?.emailId || 0;
    const result = await mailService.emailLatest(
      latestId,
      currentAccount.value.accountId,
      currentAccount.value.allReceive || 0,
    );
    const latestList = [result.latestEmail, ...(result.list || [])].filter(Boolean) as MailItem[];
    mergeLatestItems(latestList);
  } catch (error) {
    console.error(error);
  } finally {
    polling.value = false;
  }
};

const stopAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
};

const startAutoRefresh = () => {
  stopAutoRefresh();
  const seconds = Number(config.value.autoRefresh ?? 0);
  if (seconds === 0) return;
  const interval = seconds > 1 ? seconds * 1000 : 3000;
  refreshTimer = setInterval(() => {
    loadLatest();
  }, interval);
};

const toggleSort = () => {
  timeSort.value = timeSort.value ? 0 : 1;
  loadEmails();
};

const goMessage = async (email: MailItem) => {
  selectedEmail.value = email;
  if (email.unread === 0 || email.unread === 1) {
    try {
      await mailService.emailRead(email.emailId);
      email.unread = 1;
    } catch {
      // keep silent
    }
  }
  router.push('/mail/message');
};

const removeEmail = async (email: MailItem) => {
  try {
    await mailService.emailDelete(email.emailId);
    emails.value = emails.value.filter((item) => item.emailId !== email.emailId);
    toast.add({ title: '邮件已删除', color: 'success' });
  } catch (error) {
    console.error(error);
    toast.add({ title: '删除失败', color: 'error' });
  }
};

const toggleStar = async (email: MailItem) => {
  const targetStar = email.isStar ? 0 : 1;
  email.isStar = targetStar;
  try {
    if (targetStar) {
      await mailService.starAdd(email.emailId);
    } else {
      await mailService.starCancel(email.emailId);
    }
  } catch (error) {
    email.isStar = targetStar ? 0 : 1;
    console.error(error);
  }
};

watch(
  () => currentAccount.value?.accountId,
  () => {
    loadEmails();
    startAutoRefresh();
  },
  { immediate: true },
);

watch(
  () => config.value.autoRefresh,
  () => {
    startAutoRefresh();
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  stopAutoRefresh();
});
</script>

<template>
  <div class="flex-1 flex flex-col min-h-0">
    <!-- List header -->
    <div
      class="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] shrink-0"
    >
      <div class="flex items-center gap-3">
        <h2 class="text-base font-semibold text-gray-200">收件箱</h2>
        <span v-if="emails.length" class="text-xs text-gray-500">{{ emails.length }} 封</span>
      </div>
      <div class="flex items-center gap-1">
        <button
          class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.06] text-gray-400 hover:text-gray-200 transition-colors"
          title="排序"
          @click="toggleSort"
        >
          <Icon
            :name="timeSort === 0 ? 'lucide:arrow-down-narrow-wide' : 'lucide:arrow-up-wide-narrow'"
            size="16"
          />
        </button>
        <button
          class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.06] text-gray-400 hover:text-gray-200 transition-colors"
          title="刷新"
          @click="loadEmails"
        >
          <Icon name="lucide:refresh-cw" size="16" />
        </button>
      </div>
    </div>

    <!-- Email list -->
    <div class="flex-1 overflow-y-auto">
      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 text-gray-500">
        <Icon name="lucide:loader-2" size="28" class="animate-spin mb-3" />
        <span class="text-sm">正在加载邮件...</span>
      </div>

      <!-- Empty -->
      <div
        v-else-if="emails.length === 0"
        class="flex flex-col items-center justify-center h-full text-gray-500 py-20"
      >
        <Icon name="lucide:inbox" size="48" class="mb-4 opacity-20" />
        <p class="text-sm">暂无邮件</p>
      </div>

      <!-- List -->
      <div v-else>
        <article
          v-for="email in emails"
          :key="email.emailId"
          class="group flex items-start gap-3 px-5 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors cursor-pointer"
          @click="goMessage(email)"
        >
          <!-- Unread dot -->
          <div class="pt-2 shrink-0 w-4 flex justify-center">
            <div v-if="email.unread !== 1" class="w-2 h-2 rounded-full bg-blue-400" />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-baseline gap-2 mb-0.5">
              <span
                class="text-sm truncate"
                :class="email.unread !== 1 ? 'font-semibold text-gray-100' : 'text-gray-400'"
              >
                {{ email.name || email.sendEmail || '未知发件人' }}
              </span>
              <span class="text-[11px] text-gray-600 shrink-0">{{
                formatDate(email.createTime)
              }}</span>
            </div>
            <div
              class="text-sm truncate mb-0.5"
              :class="email.unread !== 1 ? 'text-gray-200 font-medium' : 'text-gray-500'"
            >
              {{ email.subject || '(无主题)' }}
            </div>
            <div class="text-xs text-gray-600 truncate">
              {{ parseRecipient(email.recipient) }}
            </div>
          </div>

          <!-- Actions -->
          <div
            class="shrink-0 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity pt-0.5"
          >
            <button
              class="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/[0.08] transition-colors"
              :class="email.isStar ? 'text-yellow-400' : 'text-gray-500 hover:text-gray-300'"
              @click.stop="toggleStar(email)"
            >
              <Icon :name="email.isStar ? 'lucide:star' : 'lucide:star-off'" size="14" />
            </button>
            <button
              class="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/[0.08] text-gray-500 hover:text-red-400 transition-colors"
              @click.stop="removeEmail(email)"
            >
              <Icon name="lucide:trash-2" size="14" />
            </button>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
