<script setup lang="ts">
import type { MailItem } from '~/types/mail';

const { currentAccount, selectedEmail } = useMailState();
const mailService = useMailService();
const router = useRouter();
const toast = useToast();

const loading = ref(false);
const timeSort = ref(0);
const emails = ref<MailItem[]>([]);

const formatDate = (value?: string | number) => {
  if (!value) return '-';
  const d = new Date(value);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
};

const loadSent = async () => {
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
      1,
    );
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

const toggleSort = () => {
  timeSort.value = timeSort.value ? 0 : 1;
  loadSent();
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

watch(
  () => currentAccount.value?.accountId,
  () => {
    loadSent();
  },
  { immediate: true },
);
</script>

<template>
  <div class="flex-1 flex flex-col min-h-0">
    <!-- List header -->
    <div class="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] shrink-0">
      <div class="flex items-center gap-3">
        <h2 class="text-base font-semibold text-gray-200">已发送</h2>
        <span v-if="emails.length" class="text-xs text-gray-500">{{ emails.length }} 封</span>
      </div>
      <div class="flex items-center gap-1">
        <button
          class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.06] text-gray-400 hover:text-gray-200 transition-colors"
          title="排序"
          @click="toggleSort"
        >
          <Icon :name="timeSort === 0 ? 'lucide:arrow-down-narrow-wide' : 'lucide:arrow-up-wide-narrow'" size="16" />
        </button>
        <button
          class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.06] text-gray-400 hover:text-gray-200 transition-colors"
          title="刷新"
          @click="loadSent"
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
        <span class="text-sm">正在加载...</span>
      </div>

      <!-- Empty -->
      <div
        v-else-if="emails.length === 0"
        class="flex flex-col items-center justify-center h-full text-gray-500 py-20"
      >
        <Icon name="lucide:send" size="48" class="mb-4 opacity-20" />
        <p class="text-sm">暂无已发送邮件</p>
      </div>

      <!-- List -->
      <div v-else>
        <article
          v-for="item in emails"
          :key="item.emailId"
          class="group flex items-start gap-3 px-5 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors cursor-pointer"
          @click="openDetail(item)"
        >
          <div class="pt-1 shrink-0 text-gray-600">
            <Icon name="lucide:send" size="14" />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-baseline gap-2 mb-0.5">
              <span class="text-sm text-gray-400 truncate">
                {{ item.sendEmail || '-' }}
              </span>
              <span class="text-[11px] text-gray-600 shrink-0">{{ formatDate(item.createTime) }}</span>
            </div>
            <div class="text-sm text-gray-200 truncate font-medium">
              {{ item.subject || '(无主题)' }}
            </div>
          </div>

          <!-- Actions -->
          <div class="shrink-0 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity pt-0.5">
            <button
              class="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/[0.08] transition-colors"
              :class="item.isStar ? 'text-yellow-400' : 'text-gray-500 hover:text-gray-300'"
              @click.stop="toggleStar(item)"
            >
              <Icon :name="item.isStar ? 'lucide:star' : 'lucide:star-off'" size="14" />
            </button>
            <button
              class="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/[0.08] text-gray-500 hover:text-red-400 transition-colors"
              @click.stop="removeEmail(item)"
            >
              <Icon name="lucide:trash-2" size="14" />
            </button>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
