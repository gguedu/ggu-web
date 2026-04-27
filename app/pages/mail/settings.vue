<script setup lang="ts">
const { user, currentAccount, clearSession } = useMailState()
const mailService = useMailService()

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
    alert('请输入用户名')
    return
  }
  if (!currentAccount.value?.accountId) {
    alert('未找到当前账户')
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
    alert('用户名修改成功')
  } catch (error) {
    console.error(error)
    alert('用户名修改失败')
  } finally {
    saveNameLoading.value = false
  }
}

const savePassword = async () => {
  if (!password.value || password.value.length < 6) {
    alert('密码至少 6 位')
    return
  }
  if (password.value !== confirmPassword.value) {
    alert('两次输入密码不一致')
    return
  }

  loading.value = true
  try {
    await mailService.resetPassword(password.value)
    password.value = ''
    confirmPassword.value = ''
    alert('密码修改成功')
  } catch (error) {
    console.error(error)
    alert('密码修改失败')
  } finally {
    loading.value = false
  }
}

const deleteAccount = async () => {
  const confirmed = confirm('确认注销账号吗？该操作不可恢复。')
  if (!confirmed) {
    return
  }

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
  <section class="p-6 text-white max-w-3xl space-y-8">
    <div class="rounded-xl border border-[#333] bg-[#1c1c1e] p-5">
      <h2 class="text-xl font-semibold mb-5">个人设置</h2>

      <div class="grid gap-5 text-sm text-gray-300">
        <div class="grid grid-cols-[72px_1fr] items-center gap-4">
          <div class="font-medium text-gray-200">用户名</div>
          <div>
            <div v-if="editingName" class="flex items-center gap-2">
              <input v-model="accountName" class="w-full max-w-sm rounded border border-[#333] bg-[#141414] px-3 py-2" placeholder="请输入用户名" />
              <button class="px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-60" :disabled="saveNameLoading" @click="saveName">
                {{ saveNameLoading ? '保存中...' : '保存' }}
              </button>
            </div>
            <div v-else class="flex items-center gap-3">
              <span>{{ user?.name || '-' }}</span>
              <button class="text-blue-300 hover:text-blue-200" @click="openNameEdit">修改</button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-[72px_1fr] items-center gap-4">
          <div class="font-medium text-gray-200">邮箱账号</div>
          <div class="truncate">{{ user?.email || '-' }}</div>
        </div>
      </div>
    </div>

    <div class="rounded-xl border border-[#333] bg-[#1c1c1e] p-5">
      <h3 class="text-lg font-medium mb-3">修改密码</h3>
      <div class="space-y-3">
        <input v-model="password" type="password" class="w-full rounded border border-[#333] bg-[#141414] px-3 py-2" placeholder="新密码" />
        <input v-model="confirmPassword" type="password" class="w-full rounded border border-[#333] bg-[#141414] px-3 py-2" placeholder="确认新密码" />
        <button class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-60" :disabled="loading" @click="savePassword">
          {{ loading ? '保存中...' : '保存密码' }}
        </button>
      </div>
    </div>

    <div class="rounded-xl border border-[#4b2323] bg-[#1c1c1e] p-5">
      <h3 class="text-lg font-medium text-red-300 mb-2">危险操作</h3>
      <p class="text-sm text-gray-400 mb-3">注销后当前用户将被删除，且无法恢复。</p>
      <button class="px-4 py-2 rounded bg-red-700 hover:bg-red-600" @click="deleteAccount">注销账号</button>
    </div>
  </section>
</template>
