<script setup lang="ts">
definePageMeta({
  layout: false
})

const router = useRouter()
const mailService = useMailService()
const { token, user, config, accounts, currentAccountId, clearSession } = useMailState()

const mode = ref<'login' | 'register'>('login')
const emailPrefix = ref('')
const password = ref('')
const confirmPassword = ref('')
const inviteCode = ref('')
const suffix = ref('')
const loading = ref(false)
const errorMsg = ref('')

const allowRegister = computed(() => {
  const value = config.value.register
  if (value === undefined || value === null) {
    return true
  }
  return Number(value) === 0
})

const showLoginDomain = computed(() => {
  const value = config.value.loginDomain
  if (value === undefined || value === null) {
    return true
  }
  return Number(value) === 0
})

const regKeyMode = computed(() => Number(config.value.regKey ?? 1))
const requireInviteCode = computed(() => regKeyMode.value === 0)
const optionalInviteCode = computed(() => regKeyMode.value === 2)
const minEmailPrefix = computed(() => Number(config.value.minEmailPrefix ?? 1))

const fullEmail = computed(() => {
  const prefix = emailPrefix.value.trim()
  if (!prefix) {
    return ''
  }
  if (prefix.includes('@')) {
    return prefix
  }
  if (!showLoginDomain.value) {
    return prefix
  }
  return `${prefix}${suffix.value || ''}`
})

const domainList = computed(() => config.value.domainList || [])

const bootstrap = async () => {
  config.value = await mailService.websiteConfig()
  if (domainList.value.length > 0 && !suffix.value) {
    suffix.value = domainList.value[0] || ''
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
  if (emailPrefix.value.trim().length < minEmailPrefix.value) {
    errorMsg.value = `邮箱前缀至少 ${minEmailPrefix.value} 位`
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
      if (!allowRegister.value) {
        throw new Error('当前站点未开放注册')
      }
      if (password.value.length < 6) {
        throw new Error('密码长度至少 6 位')
      }
      if (password.value !== confirmPassword.value) {
        throw new Error('两次输入密码不一致')
      }
      if (requireInviteCode.value && !inviteCode.value.trim()) {
        throw new Error('当前注册需要邀请码')
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
  const init = async () => {
    if (token.value) {
      try {
        await mailService.loginUserInfo()
        await router.replace('/mail')
        return
      } catch {
        clearSession()
      }
    }
    await bootstrap()
  }
  init()
})

watch(allowRegister, (enabled) => {
  if (!enabled && mode.value === 'register') {
    mode.value = 'login'
  }
})
</script>

<template>
  <div class="h-screen bg-black text-white flex items-center justify-center px-6 py-6 overflow-hidden relative">
    <div class="pointer-events-none absolute inset-0 overflow-hidden z-0">
      <div class="absolute -right-40 -top-48 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12),rgba(0,0,0,0))]" />
      <div class="absolute left-10 top-20 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(0,148,255,0.18),rgba(0,0,0,0))]" />
      <div class="absolute bottom-0 right-0 h-[420px] w-[420px] bg-[radial-gradient(circle,rgba(0,0,0,0),rgba(0,0,0,0.85))]" />
    </div>

    <div class="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1fr_430px] border border-gray-800 bg-black rounded-2xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
      <section class="hidden lg:flex flex-col justify-between p-10 border-r border-gray-900/80">
        <div>
          <p class="text-xs tracking-[0.25em] uppercase text-gray-500 mb-5">Galaxy Global University</p>
          <h1 class="font-custom text-5xl leading-tight tracking-[0.08em] text-white" style="text-shadow: 0 4px 40px rgba(255, 255, 255, 0.12);">
            星河邮箱
          </h1>
          <p class="mt-5 text-gray-400 max-w-sm leading-7">
            统一身份账号登录，访问教学通知、校内协同与事务邮件。
          </p>
        </div>
        <div class="text-sm text-gray-500 tracking-wide">
          <p class="mb-2">GGU Secure Mail Portal</p>
          <p>All sessions are encrypted and audited.</p>
        </div>
      </section>

      <section class="p-6 sm:p-8 lg:p-10">
        <div class="flex items-center gap-3 mb-7">
          <div class="h-10 w-10 rounded-full border border-gray-700 bg-black flex items-center justify-center">
            <Icon name="lucide:mail" size="20" class="text-gray-200" />
          </div>
          <div>
            <h2 class="text-xl font-bold tracking-wide">{{ config.title || 'Cloud Mail' }}</h2>
            <p class="text-xs text-gray-500 mt-1 tracking-[0.18em] uppercase">{{ mode === 'login' ? 'Sign In' : 'Create Account' }}</p>
          </div>
        </div>

        <form class="space-y-4" @submit.prevent="submit">
          <div>
            <label class="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-[0.18em]">邮箱前缀</label>
            <div class="flex gap-2">
              <input
                v-model="emailPrefix"
                type="text"
                required
                :placeholder="showLoginDomain ? 'admin' : 'name@example.com'"
                class="flex-1 bg-black border border-gray-700 rounded-md px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
              />
              <select
                v-if="showLoginDomain && domainList.length > 0"
                v-model="suffix"
                class="w-[150px] bg-black border border-gray-700 rounded-md px-2 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
              >
                <option v-for="item in domainList" :key="item" :value="item">{{ item }}</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-[0.18em]">密码</label>
            <input
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full bg-black border border-gray-700 rounded-md px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div v-if="mode === 'register'">
            <label class="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-[0.18em]">确认密码</label>
            <input
              v-model="confirmPassword"
              type="password"
              required
              placeholder="••••••••"
              class="w-full bg-black border border-gray-700 rounded-md px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div v-if="mode === 'register' && (requireInviteCode || optionalInviteCode)">
            <label class="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-[0.18em]">邀请码</label>
            <input
              v-model="inviteCode"
              type="text"
              :placeholder="requireInviteCode ? '请输入邀请码' : '邀请码（可选）'"
              class="w-full bg-black border border-gray-700 rounded-md px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div v-if="errorMsg" class="text-red-300 text-xs font-medium bg-red-950/30 p-3 rounded-md border border-red-900/40">
            {{ errorMsg }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full px-6 py-3.5 bg-white text-black border border-white rounded-md hover:bg-gray-200 hover:border-gray-200 transition-all duration-300 font-semibold tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {{ loading ? '处理中...' : mode === 'login' ? '登录' : '注册并登录' }}
          </button>

          <button
            type="button"
            v-if="allowRegister"
            class="w-full px-6 py-3 border border-gray-700 rounded-md text-sm text-gray-200 hover:bg-white/10 hover:border-white transition-all duration-300"
            @click="mode = mode === 'login' ? 'register' : 'login'"
          >
            {{ mode === 'login' ? '没有账号？去注册' : '已有账号？去登录' }}
          </button>
        </form>
      </section>
    </div>
  </div>
</template>
