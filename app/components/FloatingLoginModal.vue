<script setup lang="ts">
const mailService = useMailService()
const { token, user, config, accounts, currentAccountId, clearSession } = useMailState()
const { isOpen, reason, closeLoginModal, completeLogin } = useFloatingLogin()

const mode = ref<'login' | 'register'>('login')
const emailPrefix = ref('')
const password = ref('')
const confirmPassword = ref('')
const inviteCode = ref('')
const suffix = ref('')
const loading = ref(false)
const errorMsg = ref('')

const domainList = computed(() => config.value.domainList || [])
const allowRegister = computed(() => Number(config.value.register ?? 0) === 0)
const showLoginDomain = computed(() => Number(config.value.loginDomain ?? 0) === 0)
const regKeyMode = computed(() => Number(config.value.regKey ?? 1))
const requireInviteCode = computed(() => regKeyMode.value === 0)
const minEmailPrefix = computed(() => Number(config.value.minEmailPrefix ?? 1))

const fullEmail = computed(() => {
  const prefix = emailPrefix.value.trim()
  if (!prefix) return ''
  if (prefix.includes('@') || !showLoginDomain.value) return prefix
  return `${prefix}${suffix.value || ''}`
})

const bootstrap = async () => {
  if (!domainList.value.length) {
    config.value = await mailService.websiteConfig()
  }
  if (domainList.value.length > 0 && !suffix.value) {
    suffix.value = domainList.value[0] || ''
  }
}

const completeSession = async (sessionToken: string) => {
  token.value = sessionToken
  try {
    const profile = await mailService.loginUserInfo()
    user.value = profile
    const accountList = await mailService.accountList(0, 100)
    accounts.value = accountList
    currentAccountId.value = profile.account?.accountId || accountList[0]?.accountId || null
    await completeLogin()
  } catch {
    clearSession()
    throw new Error('登录成功但加载用户信息失败，请重新登录')
  }
}

const submit = async () => {
  errorMsg.value = ''
  if (!fullEmail.value) {
    errorMsg.value = '请输入邮箱'
    return
  }
  if (emailPrefix.value.trim().length < minEmailPrefix.value) {
    errorMsg.value = `邮箱至少 ${minEmailPrefix.value} 位`
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
      if (!allowRegister.value) throw new Error('当前站点未开放注册')
      if (password.value.length < 6) throw new Error('密码长度至少 6 位')
      if (password.value !== confirmPassword.value) throw new Error('两次输入密码不一致')
      if (requireInviteCode.value && !inviteCode.value.trim()) throw new Error('当前注册需要邀请码')
      const res = await mailService.register({
        email: fullEmail.value,
        password: password.value,
        code: inviteCode.value || undefined
      })
      await completeSession(res.token)
    }
  } catch (error: unknown) {
    errorMsg.value = error instanceof Error ? error.message : '登录失败，请检查配置与网络'
  } finally {
    loading.value = false
  }
}

watch(isOpen, (open) => {
  if (open) {
    errorMsg.value = ''
    bootstrap().catch((error: unknown) => {
      errorMsg.value = error instanceof Error ? error.message : '加载登录配置失败'
    })
  }
})

watch(mode, () => {
  errorMsg.value = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
      >
        <button
          class="absolute inset-0 bg-black/70 backdrop-blur-xl"
          aria-label="关闭登录窗口"
          @click="closeLoginModal"
        />
        <section class="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#11161c]/95 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl lg:grid lg:grid-cols-[1fr_420px]">
          <div class="hidden p-10 lg:flex lg:flex-col lg:justify-between border-r border-white/10">
            <div>
              <p class="mb-5 text-xs font-medium uppercase tracking-[0.4em] text-gray-500">
                Galaxy Global University
              </p>
              <div class="flex items-center gap-3">
                <Icon
                  name="lucide:shield-check"
                  size="34"
                  class="text-blue-300"
                />
                <h2 class="font-custom text-4xl tracking-[0.08em] text-white">
                  星河通行证
                </h2>
              </div>
              <p class="mt-6 max-w-sm text-base leading-7 text-gray-400">
                {{ reason }}。登录后 token 将写入本地 localStorage，并通过 Authorization 请求头访问服务。
              </p>
            </div>
            <div class="space-y-3 text-sm text-gray-500">
              <p class="flex items-center gap-2"><Icon name="lucide:key-round" size="15" /> 多服务统一认证</p>
              <p class="flex items-center gap-2"><Icon name="lucide:database-zap" size="15" /> DNS / 邮箱 / 后续服务共用入口</p>
            </div>
          </div>

          <form
            class="p-6 sm:p-9"
            @submit.prevent="submit"
          >
            <div class="mb-6 flex items-center justify-between">
              <div>
                <h3 class="text-xl font-semibold text-white">
                  {{ mode === 'login' ? '登录' : '注册' }}
                </h3>
                <p class="mt-1 text-xs uppercase tracking-[0.2em] text-gray-500">
                  {{ config.title || 'Cloud Mail' }}
                </p>
              </div>
              <button
                type="button"
                class="rounded-full p-2 text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
                @click="closeLoginModal"
              >
                <Icon name="lucide:x" size="18" />
              </button>
            </div>

            <div class="mb-5 flex rounded-full bg-white/[0.04] p-1 text-sm">
              <button
                type="button"
                class="flex-1 rounded-full px-4 py-2 transition-colors"
                :class="mode === 'login' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'"
                @click="mode = 'login'"
              >登录</button>
              <button
                type="button"
                class="flex-1 rounded-full px-4 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                :class="mode === 'register' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'"
                :disabled="!allowRegister"
                @click="mode = 'register'"
              >注册</button>
            </div>

            <label class="mb-4 block">
              <span class="mb-2 block text-sm text-gray-400">邮箱</span>
              <div class="flex overflow-hidden rounded-xl border border-white/[0.12] bg-black/20 focus-within:border-blue-400/60">
                <input
                  v-model="emailPrefix"
                  class="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-gray-100 outline-none placeholder:text-gray-600"
                  placeholder="name 或 name@example.com"
                >
                <select
                  v-if="showLoginDomain && domainList.length"
                  v-model="suffix"
                  class="border-l border-white/[0.08] bg-transparent px-3 text-sm text-gray-300 outline-none"
                >
                  <option
                    v-for="domain in domainList"
                    :key="domain"
                    :value="domain"
                    class="bg-[#11161c]"
                  >{{ domain }}</option>
                </select>
              </div>
            </label>

            <label class="mb-4 block">
              <span class="mb-2 block text-sm text-gray-400">密码</span>
              <input
                v-model="password"
                type="password"
                class="w-full rounded-xl border border-white/[0.12] bg-black/20 px-4 py-3 text-sm text-gray-100 outline-none transition-colors placeholder:text-gray-600 focus:border-blue-400/60"
                placeholder="请输入密码"
              >
            </label>

            <label
              v-if="mode === 'register'"
              class="mb-4 block"
            >
              <span class="mb-2 block text-sm text-gray-400">确认密码</span>
              <input
                v-model="confirmPassword"
                type="password"
                class="w-full rounded-xl border border-white/[0.12] bg-black/20 px-4 py-3 text-sm text-gray-100 outline-none transition-colors placeholder:text-gray-600 focus:border-blue-400/60"
                placeholder="再次输入密码"
              >
            </label>

            <label
              v-if="mode === 'register' && regKeyMode !== 1"
              class="mb-4 block"
            >
              <span class="mb-2 block text-sm text-gray-400">邀请码</span>
              <input
                v-model="inviteCode"
                class="w-full rounded-xl border border-white/[0.12] bg-black/20 px-4 py-3 text-sm text-gray-100 outline-none transition-colors placeholder:text-gray-600 focus:border-blue-400/60"
                :placeholder="requireInviteCode ? '请输入邀请码' : '可选'"
              >
            </label>

            <p
              v-if="errorMsg"
              class="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200"
            >
              {{ errorMsg }}
            </p>

            <button
              type="submit"
              class="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="loading"
            >
              {{ loading ? '处理中...' : mode === 'login' ? '登录并继续' : '注册并继续' }}
            </button>
          </form>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
