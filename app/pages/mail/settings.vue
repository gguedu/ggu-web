<script setup lang="ts">
const { user, currentAccount, clearSession } = useMailState();
const mailService = useMailService();
const toast = useToast();

const editingName = ref(false);
const accountName = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const saveNameLoading = ref(false);

const openNameEdit = () => {
  accountName.value = user.value?.name || '';
  editingName.value = true;
};

const saveName = async () => {
  const nextName = accountName.value.trim();
  if (!nextName) {
    toast.add({ title: '请输入用户名', color: 'warning' });
    return;
  }
  if (!currentAccount.value?.accountId) {
    toast.add({ title: '未找到当前账户', color: 'error' });
    return;
  }
  if (nextName === user.value?.name) {
    editingName.value = false;
    return;
  }

  saveNameLoading.value = true;
  try {
    await mailService.accountSetName(currentAccount.value.accountId, nextName);
    if (user.value) {
      user.value.name = nextName;
    }
    editingName.value = false;
    toast.add({ title: '用户名修改成功', color: 'success' });
  } catch (error) {
    console.error(error);
    toast.add({ title: '用户名修改失败', color: 'error' });
  } finally {
    saveNameLoading.value = false;
  }
};

const savePassword = async () => {
  if (!password.value || password.value.length < 6) {
    toast.add({ title: '密码至少 6 位', color: 'warning' });
    return;
  }
  if (password.value !== confirmPassword.value) {
    toast.add({ title: '两次输入密码不一致', color: 'warning' });
    return;
  }

  loading.value = true;
  try {
    await mailService.resetPassword(password.value);
    password.value = '';
    confirmPassword.value = '';
    toast.add({ title: '密码修改成功', color: 'success' });
  } catch (error) {
    console.error(error);
    toast.add({ title: '密码修改失败', color: 'error' });
  } finally {
    loading.value = false;
  }
};

const showDeleteConfirm = ref(false);
const deleteConfirmText = ref('');
const deleteLoading = ref(false);
const canDelete = computed(() => deleteConfirmText.value === '确认注销');

const deleteAccount = async () => {
  if (!canDelete.value) return;

  deleteLoading.value = true;
  try {
    await mailService.deleteSelf();
  } catch (error) {
    console.error(error);
  }

  clearSession();
  await navigateTo('/mail/login');
};
</script>

<template>
  <div class="flex-1 overflow-y-auto">
    <div class="max-w-2xl px-5 py-5 space-y-5">
      <!-- Profile -->
      <div class="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
        <h2 class="text-base font-semibold text-gray-200 mb-4">个人设置</h2>

        <div class="space-y-4 text-sm">
          <div class="flex items-center gap-4">
            <div class="text-gray-500 w-16 shrink-0">用户名</div>
            <div class="flex-1 min-w-0">
              <div v-if="editingName" class="flex items-center gap-2">
                <input
                  v-model="accountName"
                  class="flex-1 bg-transparent border border-white/[0.12] rounded-md px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="请输入用户名"
                  @keyup.enter="saveName"
                />
                <button
                  class="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-sm transition-colors"
                  :disabled="saveNameLoading"
                  @click="saveName"
                >
                  保存
                </button>
                <button
                  class="px-3 py-1.5 rounded-md hover:bg-white/[0.06] text-sm text-gray-400 transition-colors"
                  @click="editingName = false"
                >
                  取消
                </button>
              </div>
              <div v-else class="flex items-center gap-3">
                <span class="text-gray-200">{{ user?.name || '-' }}</span>
                <button
                  class="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  @click="openNameEdit"
                >
                  修改
                </button>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="text-gray-500 w-16 shrink-0">邮箱</div>
            <div class="text-gray-300 truncate">{{ user?.email || '-' }}</div>
          </div>
        </div>
      </div>

      <!-- Password -->
      <div class="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
        <h3 class="text-base font-medium text-gray-200 mb-4">修改密码</h3>
        <div class="space-y-3">
          <input
            v-model="password"
            type="password"
            class="w-full bg-transparent border border-white/[0.12] rounded-md px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors"
            placeholder="新密码"
          />
          <input
            v-model="confirmPassword"
            type="password"
            class="w-full bg-transparent border border-white/[0.12] rounded-md px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors"
            placeholder="确认新密码"
          />
          <button
            class="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-sm font-medium transition-colors"
            :disabled="loading"
            @click="savePassword"
          >
            {{ loading ? '保存中...' : '保存密码' }}
          </button>
        </div>
      </div>

      <!-- Danger zone -->
      <div class="rounded-xl border border-red-900/30 bg-red-950/10 p-5">
        <h3 class="text-base font-medium text-red-300 mb-2">危险操作</h3>
        <p class="text-sm text-gray-500 mb-3">注销后当前用户将被删除，且无法恢复。</p>

        <template v-if="!showDeleteConfirm">
          <button
            class="px-4 py-2 rounded-md bg-red-700/80 hover:bg-red-600 text-sm font-medium transition-colors"
            @click="showDeleteConfirm = true"
          >
            注销账号
          </button>
        </template>

        <template v-else>
          <p class="text-sm text-gray-400 mb-2">
            请输入 <span class="text-red-400 font-medium">确认注销</span> 以继续：
          </p>
          <input
            v-model="deleteConfirmText"
            class="w-full bg-transparent border border-white/[0.12] rounded-md px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-500/50 transition-colors mb-3"
            placeholder="确认注销"
            @keyup.enter="deleteAccount"
          />
          <div class="flex items-center gap-2">
            <button
              class="px-4 py-2 rounded-md bg-red-700/80 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors"
              :disabled="!canDelete || deleteLoading"
              @click="deleteAccount"
            >
              {{ deleteLoading ? '注销中...' : '确认注销' }}
            </button>
            <button
              class="px-4 py-2 rounded-md hover:bg-white/[0.06] text-sm text-gray-400 transition-colors"
              @click="
                showDeleteConfirm = false;
                deleteConfirmText = '';
              "
            >
              取消
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
