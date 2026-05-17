<script setup lang="ts">
const router = useRouter();
const { selectedEmail } = useMailState();
const mailService = useMailService();
const toast = useToast();

const email = computed(() => selectedEmail.value);

const parseRecipient = (value?: string) => {
  if (!value) return '-';
  try {
    const list = JSON.parse(value);
    if (Array.isArray(list)) {
      return list.map((item) => item.address || item.email || '').filter(Boolean).join(', ');
    }
  } catch {
    return value;
  }
  return '-';
};

const toggleStar = async () => {
  if (!email.value) return;
  const next = email.value.isStar ? 0 : 1;
  email.value.isStar = next;
  try {
    if (next) {
      await mailService.starAdd(email.value.emailId);
    } else {
      await mailService.starCancel(email.value.emailId);
    }
  } catch (error) {
    console.error(error);
    email.value.isStar = next ? 0 : 1;
  }
};

const removeEmail = async () => {
  if (!email.value) return;
  try {
    await mailService.emailDelete(email.value.emailId);
    toast.add({ title: '邮件已删除', color: 'success' });
    router.back();
  } catch (error) {
    console.error(error);
    toast.add({ title: '删除失败', color: 'error' });
  }
};

const goReply = () => {
  if (!email.value) return;
  navigateTo(`/mail/compose?replyTo=${email.value.emailId}`);
};
</script>

<template>
  <div class="flex-1 flex flex-col min-h-0">
    <!-- Header -->
    <div class="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] shrink-0">
      <button
        class="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-200 transition-colors"
        @click="router.back()"
      >
        <Icon name="lucide:arrow-left" size="16" />
        <span>返回</span>
      </button>
      <div class="flex items-center gap-1">
        <button
          class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.06] transition-colors"
          :class="email?.isStar ? 'text-yellow-400' : 'text-gray-400 hover:text-gray-200'"
          @click="toggleStar"
        >
          <Icon :name="email?.isStar ? 'lucide:star' : 'lucide:star-off'" size="16" />
        </button>
        <button
          class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.06] text-gray-400 hover:text-gray-200 transition-colors"
          @click="goReply"
        >
          <Icon name="lucide:reply" size="16" />
        </button>
        <button
          class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.06] text-gray-400 hover:text-red-400 transition-colors"
          @click="removeEmail"
        >
          <Icon name="lucide:trash-2" size="16" />
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="!email" class="flex flex-col items-center justify-center h-full text-gray-500 py-20">
        <Icon name="lucide:mail" size="48" class="mb-4 opacity-20" />
        <p class="text-sm">没有可查看的邮件，请返回列表重新选择</p>
      </div>

      <template v-else>
        <div class="max-w-3xl px-5 py-5">
          <!-- Subject -->
          <h1 class="text-lg font-semibold text-gray-100 mb-5">
            {{ email.subject || '(无主题)' }}
          </h1>

          <!-- Meta -->
          <div class="flex items-start gap-3 mb-5 pb-5 border-b border-white/[0.06]">
            <div class="w-9 h-9 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0 text-sm font-medium text-blue-300">
              {{ (email.name || email.sendEmail || 'U').charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-baseline gap-2 flex-wrap">
                <span class="text-sm font-medium text-gray-200">{{ email.name || '-' }}</span>
                <span class="text-xs text-gray-500">&lt;{{ email.sendEmail || '-' }}&gt;</span>
              </div>
              <div class="text-xs text-gray-500 mt-0.5">
                收件人: {{ parseRecipient(email.recipient) }}
              </div>
              <div class="text-xs text-gray-600 mt-0.5">
                {{ email.createTime ? new Date(email.createTime).toLocaleString('zh-CN') : '-' }}
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="text-sm text-gray-300 leading-relaxed">
            <div v-if="email.content" class="prose prose-invert max-w-none" v-html="email.content" />
            <pre v-else class="whitespace-pre-wrap font-sans">{{ email.text || '(空内容)' }}</pre>
          </div>

          <!-- Attachments -->
          <div
            v-if="email.attList && email.attList.length > 0"
            class="mt-6 pt-5 border-t border-white/[0.06]"
          >
            <div class="text-xs font-medium text-gray-400 mb-3 flex items-center gap-1.5">
              <Icon name="lucide:paperclip" size="12" />
              附件 ({{ email.attList.length }})
            </div>
            <div class="space-y-1.5">
              <div
                v-for="att in email.attList"
                :key="att.attId || att.filename"
                class="flex items-center justify-between rounded-md bg-white/[0.04] px-3 py-2"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <Icon name="lucide:file" size="14" class="text-gray-500 shrink-0" />
                  <span class="text-sm text-gray-300 truncate">{{ att.filename }}</span>
                </div>
                <a
                  v-if="att.key"
                  class="text-xs text-blue-400 hover:text-blue-300 ml-3 shrink-0 transition-colors"
                  :href="att.key"
                  target="_blank"
                >
                  下载
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick reply -->
        <div class="border-t border-white/[0.06] px-5 py-4 max-w-3xl">
          <button
            class="flex items-center gap-2 px-4 py-2.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-sm text-gray-300 hover:text-gray-100 transition-colors w-full"
            @click="goReply"
          >
            <Icon name="lucide:reply" size="16" />
            <span>回复此邮件</span>
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
