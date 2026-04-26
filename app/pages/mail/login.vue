<script setup lang="ts">
definePageMeta({
  layout: false
})

const router = useRouter()
const mailService = useMailService()
const { token, user, config, accounts, currentAccountId } = useMailState()

const mode = ref<'login' | 'register'>('login')
const emailPrefix = ref('')
const password = ref('')
const confirmPassword = ref('')
const inviteCode = ref('')
const suffix = ref('')
const loading = ref(false)
const errorMsg = ref('')

const fullEmail = computed(() => {
  const prefix = emailPrefix.value.trim()
  if (!prefix) {
    return ''
  }
  return prefix.includes('@') ? prefix : `${prefix}${suffix.value || ''}`
})

const domainList = computed(() => config.value.domainList || [])

const bootstrap = async () => {
  config.value = await mailService.websiteConfig()
  if (domainList.value.length > 0 && !suffix.value) {
    suffix.value = domainList.value[0]
  }
}

const completeSession = async (sessionToken: string) => {
  token.value = sessionToken
  const profile = await mailService.loginUserInfo()
  user.value = profile
  const accountList = await mailService.accountList(0, 100)
  accounts.value = accountList
  currentAccountId.value = profile.account?.accountId || accountList[0]?.accountId || null
  await router.push('/mail')
}

const submit = async () => {
  errorMsg.value = ''
  if (!fullEmail.value) {
    errorMsg.value = '请输入邮箱'
    return
  }
  if (!password.value) {
    errorMsg.value = '请输入密码'
    return
  }

  loading.value = true
  try {
    if (mode.value === 'login') {
      const res = await mailService.login(fullEmail.value, password.value)
      await completeSession(res.token)
    } else {
      if (password.value.length < 6) {
        throw new Error('密码长度至少 6 位')
      }
      if (password.value !== confirmPassword.value) {
        throw new Error('两次输入密码不一致')
      }
      const res = await mailService.register({
        email: fullEmail.value,
        password: password.value,
        code: inviteCode.value || undefined
      })
      await completeSession(res.token)
    }
  } catch (error: any) {
    errorMsg.value = error?.message || '登录失败，请检查配置与网络'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (token.value) {
    router.replace('/mail')
    return
  }
  bootstrap()
})
</script>

<template>
  <div class="h-screen flex items-center justify-center bg-[#0f1117] p-6 overflow-auto">
    <div class="w-full max-w-md rounded-2xl bg-[#1c1c1e] border border-[#333] shadow-2xl p-8">
      <div class="flex flex-col items-center mb-7">
        <Icon name="lucide:mail" size="48" class="text-blue-500 mb-3" />
        <h1 class="text-2xl font-bold text-white tracking-wide">{{ config.title || 'Cloud Mail' }}</h1>
        <p class="text-sm text-gray-500 mt-2">{{ mode === 'login' ? '登录邮箱系统' : '注册邮箱账号' }}</p>
      </div>

      <form class="space-y-4" @submit.prevent="submit">
        <div>
          <label class="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">邮箱前缀</label>
          <div class="flex gap-2">
            <input
              v-model="emailPrefix"
              type="text"
              required
              placeholder="admin"
              class="flex-1 bg-[#141414] border border-[#333] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
            />
            <select
              v-if="domainList.length > 0"
              v-model="suffix"
              class="w-[150px] bg-[#141414] border border-[#333] rounded-lg px-2 py-3 text-sm text-white"
            >
              <option v-for="item in domainList" :key="item" :value="item">{{ item }}</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">密码</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full bg-[#141414] border border-[#333] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div v-if="mode === 'register'">
          <label class="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">确认密码</label>
          <input
            v-model="confirmPassword"
            type="password"
            required
            placeholder="••••••••"
            class="w-full bg-[#141414] border border-[#333] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div v-if="mode === 'register'">
          <label class="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">邀请码（可选）</label>
          <input
            v-model="inviteCode"
            type="text"
            placeholder="邀请码"
            class="w-full bg-[#141414] border border-[#333] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div v-if="errorMsg" class="text-red-400 text-xs font-medium bg-red-950/30 p-3 rounded-lg border border-red-900/30">
          {{ errorMsg }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {{ loading ? '处理中...' : mode === 'login' ? '登录' : '注册并登录' }}
        </button>

        <button
          type="button"
          class="w-full text-sm text-gray-300 hover:text-white"
          @click="mode = mode === 'login' ? 'register' : 'login'"
        >
          {{ mode === 'login' ? '没有账号？去注册' : '已有账号？去登录' }}
        </button>
      </form>
    </div>
  </div>
</template>
