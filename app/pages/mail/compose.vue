<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const mailService = useMailService();
const { currentAccount, user } = useMailState();
const { drafts, loadFromStorage, upsertDraft, removeDraft } = useMailDrafts();
const toast = useToast();

const loading = ref(false);
const toText = ref('');
const subject = ref('');
const content = ref('');
const files = ref<File[]>([]);

const draftId = computed(() => {
  const value = route.query.draftId;
  return typeof value === 'string' ? value : '';
});

const loadDraft = () => {
  loadFromStorage();
  if (!draftId.value) return;
  const draft = drafts.value.find((item) => item.draftId === draftId.value);
  if (!draft) return;
  toText.value = draft.receiveEmail.join(',');
  subject.value = draft.subject;
  content.value = draft.content;
};

const chooseFiles = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;
  files.value = [...files.value, ...Array.from(input.files)];
  input.value = '';
};

const removeFile = (index: number) => {
  files.value.splice(index, 1);
};

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const send = async () => {
  const receiveEmail = toText.value
    .split(/[,，]/)
    .map((item) => item.trim())
    .filter(Boolean);
  if (receiveEmail.length === 0) {
    toast.add({ title: '请至少填写一个收件人', color: 'warning' });
    return;
  }
  if (!subject.value.trim()) {
    toast.add({ title: '请填写主题', color: 'warning' });
    return;
  }
  if (!content.value.trim()) {
    toast.add({ title: '请填写正文', color: 'warning' });
    return;
  }
  if (!currentAccount.value?.accountId) {
    toast.add({ title: '当前没有可用的发件账户', color: 'error' });
    return;
  }

  loading.value = true;
  try {
    const attachments = await Promise.all(
      files.value.map(async (file) => ({
        filename: file.name,
        size: file.size,
        contentType: file.type,
        content: await fileToBase64(file),
      })),
    );

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
      attachments,
    });

    if (draftId.value) {
      removeDraft(draftId.value);
    }

    toast.add({ title: '邮件发送成功', color: 'success' });
    await router.push('/mail/sent');
  } catch (error) {
    console.error(error);
    toast.add({ title: '发送失败，请检查后重试', color: 'error' });
  } finally {
    loading.value = false;
  }
};

const saveDraft = () => {
  const payload = {
    draftId: draftId.value || crypto.randomUUID(),
    receiveEmail: toText.value
      .split(/[,，]/)
      .map((item) => item.trim())
      .filter(Boolean),
    subject: subject.value,
    content: content.value,
    updatedAt: Date.now(),
  };
  upsertDraft(payload);
  toast.add({ title: '草稿已保存', color: 'success' });
};

onMounted(() => {
  loadDraft();
});
</script>

<template>
  <div class="flex-1 flex flex-col min-h-0">
    <!-- Header -->
    <div class="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] shrink-0">
      <div class="flex items-center gap-3">
        <button
          class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.06] text-gray-400 hover:text-gray-200 transition-colors"
          @click="router.back()"
        >
          <Icon name="lucide:arrow-left" size="18" />
        </button>
        <h2 class="text-base font-semibold text-gray-200">写邮件</h2>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="px-3 py-1.5 rounded-md text-sm text-gray-400 hover:text-gray-200 hover:bg-white/[0.06] transition-colors"
          @click="saveDraft"
        >
          保存草稿
        </button>
        <button
          class="px-4 py-1.5 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-500 disabled:opacity-60 transition-colors"
          :disabled="loading"
          @click="send"
        >
          <span v-if="loading" class="flex items-center gap-1.5">
            <Icon name="lucide:loader-2" size="14" class="animate-spin" />
            发送中
          </span>
          <span v-else>发送</span>
        </button>
      </div>
    </div>

    <!-- Form -->
    <div class="flex-1 overflow-y-auto">
      <div class="max-w-3xl px-5 py-4 space-y-0">
        <!-- To -->
        <div class="flex items-center border-b border-white/[0.04] py-2.5">
          <label class="text-sm text-gray-500 w-16 shrink-0">收件人</label>
          <input
            v-model="toText"
            class="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 focus:outline-none"
            placeholder="输入邮箱地址，多个用逗号分隔"
          />
        </div>

        <!-- Subject -->
        <div class="flex items-center border-b border-white/[0.04] py-2.5">
          <label class="text-sm text-gray-500 w-16 shrink-0">主题</label>
          <input
            v-model="subject"
            class="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 focus:outline-none"
            placeholder="邮件主题"
          />
        </div>

        <!-- Content -->
        <div class="pt-3">
          <textarea
            v-model="content"
            rows="16"
            class="w-full bg-transparent text-sm text-gray-200 placeholder-gray-600 focus:outline-none resize-none leading-relaxed"
            placeholder="请输入邮件正文..."
          />
        </div>

        <!-- Attachments -->
        <div class="pt-2 pb-4">
          <label
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-gray-400 hover:text-gray-200 hover:bg-white/[0.06] cursor-pointer transition-colors"
          >
            <Icon name="lucide:paperclip" size="14" />
            <span>添加附件</span>
            <input type="file" multiple class="hidden" @change="chooseFiles" />
          </label>

          <ul v-if="files.length > 0" class="mt-3 space-y-1.5">
            <li
              v-for="(file, idx) in files"
              :key="`${file.name}-${idx}`"
              class="flex items-center justify-between rounded-md bg-white/[0.04] px-3 py-2 text-sm"
            >
              <div class="flex items-center gap-2 min-w-0">
                <Icon name="lucide:file" size="14" class="text-gray-500 shrink-0" />
                <span class="text-gray-300 truncate">{{ file.name }}</span>
                <span class="text-gray-600 shrink-0">{{ Math.ceil(file.size / 1024) }} KB</span>
              </div>
              <button
                class="ml-2 w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/[0.08] text-gray-500 hover:text-red-400 transition-colors shrink-0"
                @click="removeFile(idx)"
              >
                <Icon name="lucide:x" size="14" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
