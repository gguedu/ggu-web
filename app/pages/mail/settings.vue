<script setup lang="ts">
const { user, currentAccount, clearSession } = useMailState()
const mailService = useMailService()
const toast = useToast()

const editingName = ref(false)
const accountName = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const saveNameLoading = ref(false)

const openNameEdit = () => {
  accountName.value = user.value?.name || ''
  editingName.value = true
}

const saveName = async () => {
  const nextName = accountName.value.trim()
  if (!nextName) {
    toast.add({ title: '请输入用户名', color: 'warning' })
    return
  }
  if (!currentAccount.value?.accountId) {
    toast.add({ title: '未找到当前账户', color: 'error' })
    return
  }
  if (nextName === user.value?.name) {
    editingName.value = false
    return
  }

  saveNameLoading.value = true
  try {
    await mailService.accountSetName(currentAccount.value.accountId, nextName)
    if (user.value) {
      user.value.name = nextName
    }
    editingName.value = false
    toast.add({ title: '用户名修改成功', color: 'success' })
  } catch (error) {
    console.error(error)
    toast.add({ title: '用户名修改失败', color: 'error' })
  } finally {
    saveNameLoading.value = false
  }
}

const savePassword = async () => {
  if (!password.value || password.value.length < 6) {
    toast.add({ title: '密码至少 6 位', color: 'warning' })
    return
  }
  if (password.value !== confirmPassword.value) {
    toast.add({ title: '两次输入密码不一致', color: 'warning' })
    return
  }

  loading.value = true
  try {
    await mailService.resetPassword(password.value)
    password.value = ''
    confirmPassword.value = ''
    toast.add({ title: '密码修改成功', color: 'success' })
  } catch (error) {
    console.error(error)
    toast.add({ title: '密码修改失败', color: 'error' })
  } finally {
    loading.value = false
  }
}

const forwardingService = useMailForwarding()
const forwardingTarget = ref('')
const forwardingStatus = ref<{
  sourceEmail: string
  targetEmail: string
  verified: boolean
  enabled: boolean
} | null>(null)
const forwardingLoading = ref(false)

const loadForwardingStatus = async () => {
  forwardingLoading.value = true
  try {
    forwardingStatus.value = await forwardingService.status()
    forwardingTarget.value = forwardingStatus.value.targetEmail
  } catch (error) {
    console.error(error)
  } finally {
    forwardingLoading.value = false
  }
}

const requestForwardingVerification = async () => {
  const targetEmail = forwardingTarget.value.trim()
  if (!targetEmail) {
    toast.add({ title: '请输入目标邮箱', color: 'warning' })
    return
  }

  forwardingLoading.value = true
  try {
    forwardingStatus.value = await forwardingService.requestVerification(targetEmail)
    forwardingTarget.value = forwardingStatus.value.targetEmail
    toast.add({ title: '验证邮件已发送，请前往目标邮箱确认', color: 'success' })
  } catch (error) {
    console.error(error)
    toast.add({ title: error instanceof Error ? error.message : '发送验证邮件失败', color: 'error' })
  } finally {
    forwardingLoading.value = false
  }
}

const activateForwarding = async () => {
  forwardingLoading.value = true
  try {
    forwardingStatus.value = await forwardingService.activate()
    if (forwardingStatus.value.verified && forwardingStatus.value.enabled) {
      toast.add({ title: '邮件转发已启用', color: 'success' })
    } else {
      toast.add({ title: '目标邮箱尚未完成验证', color: 'warning' })
    }
  } catch (error) {
    console.error(error)
    toast.add({ title: error instanceof Error ? error.message : '启用转发失败', color: 'error' })
  } finally {
    forwardingLoading.value = false
  }
}

const disableForwarding = async () => {
  forwardingLoading.value = true
  try {
    forwardingStatus.value = await forwardingService.disable()
    toast.add({ title: '邮件转发已关闭', color: 'success' })
  } catch (error) {
    console.error(error)
    toast.add({ title: error instanceof Error ? error.message : '关闭转发失败', color: 'error' })
  } finally {
    forwardingLoading.value = false
  }
}

onMounted(() => {
  loadForwardingStatus()
})

const showDeleteConfirm = ref(false)
const deleteConfirmText = ref('')
const deleteLoading = ref(false)
const canDelete = computed(() => deleteConfirmText.value === '确认注销')

const deleteAccount = async () => {
  if (!canDelete.value) return

  deleteLoading.value = true
  try {
    await mailService.deleteSelf()
  } catch (error) {
    console.error(error)
  }

  clearSession()
  await navigateTo('/mail/login')
}
</script>

<template>
  <div class="flex-1 overflow-y-auto">
    <div class="max-w-2xl px-5 py-5 space-y-5">
      <!-- Profile -->
      <div class="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
        <h2 class="text-base font-semibold text-gray-200 mb-4">
          个人设置
        </h2>

        <div class="space-y-4 text-sm">
          <div class="flex items-center gap-4">
            <div class="text-gray-500 w-16 shrink-0">
              用户名
            </div>
            <div class="flex-1 min-w-0">
              <div
                v-if="editingName"
                class="flex items-center gap-2"
              >
                <input
                  v-model="accountName"
                  class="flex-1 bg-transparent border border-white/[0.12] rounded-md px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="请输入用户名"
                  @keyup.enter="saveName"
                >
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
              <div
                v-else
                class="flex items-center gap-3"
              >
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
            <div class="text-gray-500 w-16 shrink-0">
              邮箱
            </div>
            <div class="text-gray-300 truncate">
              {{ user?.email || '-' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Password -->
      <div class="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
        <h3 class="text-base font-medium text-gray-200 mb-4">
          修改密码
        </h3>
        <div class="space-y-3">
          <input
            v-model="password"
            type="password"
            class="w-full bg-transparent border border-white/[0.12] rounded-md px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors"
            placeholder="新密码"
          >
          <input
            v-model="confirmPassword"
            type="password"
            class="w-full bg-transparent border border-white/[0.12] rounded-md px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors"
            placeholder="确认新密码"
          >
          <button
            class="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-sm font-medium transition-colors"
            :disabled="loading"
            @click="savePassword"
          >
            {{ loading ? '保存中...' : '保存密码' }}
          </button>
        </div>
      </div>

      <!-- Mail forwarding -->
      <div class="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
        <div class="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 class="text-base font-medium text-gray-200">
              邮件转发（限免）
            </h3>
            <p class="text-sm text-gray-500 mt-1">
              将当前 GGU 邮箱收到的邮件转发到已验证的外部邮箱。
            </p>
          </div>
          <span
            class="text-xs px-2 py-1 rounded-md border"
            :class="
              forwardingStatus?.enabled
                ? 'border-green-500/30 text-green-300 bg-green-500/10'
                : 'border-white/[0.08] text-gray-500 bg-white/[0.04]'
            "
          >
            {{ forwardingStatus?.enabled ? '已启用' : '未启用' }}
          </span>
        </div>

        <div class="space-y-3 text-sm">
          <div class="flex items-center gap-4">
            <div class="text-gray-500 w-20 shrink-0">
              当前邮箱
            </div>
            <div class="text-gray-300 truncate">
              {{ forwardingStatus?.sourceEmail || user?.email || '-' }}
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="text-gray-500 w-20 shrink-0">
              目标邮箱
            </div>
            <input
              v-model="forwardingTarget"
              type="email"
              class="flex-1 bg-transparent border border-white/[0.12] rounded-md px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors"
              placeholder="target@example.com"
            >
          </div>

          <div
            v-if="forwardingStatus?.targetEmail"
            class="flex items-center gap-4"
          >
            <div class="text-gray-500 w-20 shrink-0">
              验证状态
            </div>
            <div :class="forwardingStatus.verified ? 'text-green-300' : 'text-yellow-300'">
              {{ forwardingStatus.verified ? '目标邮箱已验证' : '等待目标邮箱验证' }}
            </div>
          </div>

          <div class="flex flex-wrap gap-2 pt-1">
            <button
              class="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-sm font-medium transition-colors"
              :disabled="forwardingLoading"
              @click="requestForwardingVerification"
            >
              {{ forwardingLoading ? '处理中...' : '发送验证邮件' }}
            </button>
            <button
              class="px-4 py-2 rounded-md bg-white/[0.06] hover:bg-white/[0.1] disabled:opacity-60 text-sm font-medium text-gray-200 transition-colors"
              :disabled="forwardingLoading || !forwardingStatus?.targetEmail"
              @click="activateForwarding"
            >
              我已完成验证，启用转发
            </button>
            <button
              v-if="forwardingStatus?.enabled"
              class="px-4 py-2 rounded-md bg-red-700/80 hover:bg-red-600 disabled:opacity-60 text-sm font-medium transition-colors"
              :disabled="forwardingLoading"
              @click="disableForwarding"
            >
              关闭转发
            </button>
          </div>
        </div>
      </div>

      <!-- Danger zone -->
      <div class="rounded-xl border border-red-900/30 bg-red-950/10 p-5">
        <h3 class="text-base font-medium text-red-300 mb-2">
          危险操作
        </h3>
        <p class="text-sm text-gray-500 mb-3">
          注销后当前用户将被删除，且无法恢复。
        </p>

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
          >
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
