<script setup lang="ts">
const { user, clearSession } = useMailState()
const mailService = useMailService()

const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

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
  <section class="p-6 text-white max-w-2xl space-y-8">
    <div>
      <h2 class="text-xl font-semibold mb-3">个人设置</h2>
      <div class="rounded-xl border border-[#333] bg-[#1c1c1e] p-4 text-sm text-gray-300 space-y-2">
        <div>用户名: {{ user?.name || '-' }}</div>
        <div>邮箱: {{ user?.email || '-' }}</div>
      </div>
    </div>

    <div>
      <h3 class="text-lg font-medium mb-3">修改密码</h3>
      <div class="space-y-3">
        <input v-model="password" type="password" class="w-full rounded border border-[#333] bg-[#1c1c1e] px-3 py-2" placeholder="新密码" />
        <input v-model="confirmPassword" type="password" class="w-full rounded border border-[#333] bg-[#1c1c1e] px-3 py-2" placeholder="确认新密码" />
        <button class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-60" :disabled="loading" @click="savePassword">
          {{ loading ? '保存中...' : '保存密码' }}
        </button>
      </div>
    </div>

    <div class="pt-2 border-t border-[#333]">
      <h3 class="text-lg font-medium text-red-300 mb-2">危险操作</h3>
      <p class="text-sm text-gray-400 mb-3">注销后当前用户将被删除，且无法恢复。</p>
      <button class="px-4 py-2 rounded bg-red-700 hover:bg-red-600" @click="deleteAccount">注销账号</button>
    </div>
  </section>
</template>
