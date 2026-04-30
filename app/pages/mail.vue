<script setup lang="ts">
definePageMeta({
  middleware: 'mail-auth'
})

const route = useRoute()
const router = useRouter()
const showAside = ref(false)
const showAccountMenu = ref(false)
let accountMenuTimer: ReturnType<typeof setTimeout> | null = null

const handleMenuEnter = () => {
  if (accountMenuTimer) clearTimeout(accountMenuTimer)
  showAccountMenu.value = true
}

const handleMenuLeave = () => {
  accountMenuTimer = setTimeout(() => {
    showAccountMenu.value = false
  }, 100)
}

const loading = ref(false)
const isLoginRoute = computed(() => route.path === '/mail/login')
const headerHeight = ref(88)
const footerHeight = ref(96)
let layoutObserver: ResizeObserver | null = null

const menuItems = [
  { id: 'inbox', label: '收件箱', icon: 'lucide:inbox', path: '/mail' },
  { id: 'sent', label: '已发送', icon: 'lucide:send', path: '/mail/sent' },
  { id: 'drafts', label: '草稿箱', icon: 'lucide:file-text', path: '/mail/drafts' },
  { id: 'starred', label: '星标邮件', icon: 'lucide:star', path: '/mail/starred' },
  { id: 'settings', label: '设置', icon: 'lucide:settings', path: '/mail/settings' }
]

const { config, user, accounts, currentAccountId, currentAccount, clearSession } = useMailState()
const mailService = useMailService()

const closeAside = () => {
  showAside.value = false
}

const loadBaseData = async () => {
  if (loading.value) {
    return
  }
  loading.value = true
  try {
    user.value = await mailService.loginUserInfo()
    config.value = await mailService.websiteConfig()
    const accountList = await mailService.accountList(0, 100)
    accounts.value = accountList
    if (!currentAccountId.value && accounts.value.length > 0) {
      currentAccountId.value = accounts.value[0]?.accountId || null
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const logout = async () => {
  try {
    await mailService.logout()
  } catch {
    // Ignore logout request failures and clear local session anyway.
  }
  clearSession()
  await navigateTo('/mail/login')
}

const isActive = (path: string) => {
  if (path === '/mail') {
    return route.path === '/mail' || route.path === '/mail/inbox'
  }
  return route.path === path
}

const updateLayoutSize = () => {
  if (!import.meta.client) {
    return
  }
  const header = document.getElementById('global-site-header')
  const footer = document.getElementById('global-site-footer')
  headerHeight.value = header?.offsetHeight || 88
  footerHeight.value = footer?.offsetHeight || 96
}

const shellStyle = computed(() => ({
  marginTop: `${headerHeight.value}px`,
  height: `calc(100dvh - ${headerHeight.value}px - ${footerHeight.value}px)`
}))

const asideStyle = computed(() => ({
  top: `${headerHeight.value}px`,
  height: `calc(100dvh - ${headerHeight.value}px - ${footerHeight.value}px)`
}))

onMounted(() => {
  nextTick(() => {
    updateLayoutSize()
    const header = document.getElementById('global-site-header')
    const footer = document.getElementById('global-site-footer')
    if (header || footer) {
      layoutObserver = new ResizeObserver(() => {
        updateLayoutSize()
      })
      if (header) {
        layoutObserver.observe(header)
      }
      if (footer) {
        layoutObserver.observe(footer)
      }
    }
  })
  window.addEventListener('resize', updateLayoutSize)

  if (!isLoginRoute.value) {
    loadBaseData()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateLayoutSize)
  layoutObserver?.disconnect()
  layoutObserver = null
})

watch(isLoginRoute, (value) => {
  if (!value) {
    loadBaseData()
  }
})

const gravatarUrl = ref('')

watch(() => currentAccount.value?.email, async (email) => {
  if (email && import.meta.client) {
    try {
      const msgUint8 = new TextEncoder().encode(email.trim().toLowerCase())
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
      gravatarUrl.value = `https://gravatar.com/avatar/${hashHex}?d=mp`
    } catch {
      gravatarUrl.value = ''
    }
  } else {
    gravatarUrl.value = ''
  }
}, { immediate: true })

watch(currentAccountId, (newValue) => {
  if (!newValue) {
    return
  }
  const exists = accounts.value.some(item => item.accountId === newValue)
  if (!exists && accounts.value.length > 0) {
    currentAccountId.value = accounts.value[0]?.accountId || null
  }
})
</script>

<template>
  <NuxtPage v-if="isLoginRoute" />

  <div v-else class="bg-black/70 text-white overflow-hidden relative isolate" :style="shellStyle">
    <div class="pointer-events-none absolute inset-0 overflow-hidden z-0">
      <div class="absolute -right-32 -top-40 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18),rgba(0,0,0,0))]" />
      <div class="absolute left-6 top-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(0,148,255,0.3),rgba(0,0,0,0))]" />
      <div class="absolute bottom-0 right-0 h-[420px] w-[420px] bg-[radial-gradient(circle,rgba(0,0,0,0),rgba(0,0,0,0.65))]" />
    </div>

    <div class="relative z-10 flex h-full">
      <div v-if="showAside" class="fixed inset-0 bg-black/50 z-40 md:hidden" @click="closeAside" />

      <aside
        class="fixed md:static md:top-0 left-0 z-50 w-64 md:h-auto md:min-h-full bg-black/40 backdrop-blur-md border-r border-white/10 transform transition-transform duration-300 flex flex-col"
        :style="asideStyle"
        :class="showAside ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
      >
        <div class="flex items-center gap-3 px-5 py-4 border-b border-[#333]">
          <Icon name="lucide:mail" size="22" class="text-blue-400" />
          <span class="font-bold text-lg tracking-wide">{{ config.title || 'Cloud Mail' }}</span>
        </div>

        <div class="flex flex-1 flex-col min-h-0">
          <nav class="px-3 py-4 space-y-1">
          <NuxtLink
            v-for="item in menuItems"
            :key="item.id"
            :to="item.path"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm"
            :class="isActive(item.path) ? 'bg-blue-600/20 text-blue-400 font-medium' : 'text-gray-400 hover:bg-[#2c2c2e] hover:text-gray-200'"
            @click="closeAside"
          >
            <Icon :name="item.icon" size="18" />
            <span>{{ item.label }}</span>
          </NuxtLink>

          <NuxtLink
            to="/mail/compose"
            class="mt-4 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors text-sm font-medium"
            @click="closeAside"
          >
            <Icon name="lucide:pen-square" size="16" />
            <span>写邮件</span>
          </NuxtLink>
          </nav>

          <div class="mt-auto px-3 py-3 relative" @mouseenter="handleMenuEnter" @mouseleave="handleMenuLeave">
            <transition
              enter-active-class="transition duration-150 ease-linear"
              enter-from-class="opacity-0 translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-150 ease-linear"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-1"
            >
              <div v-if="showAccountMenu" class="absolute bottom-[calc(100%-4px)] left-3 w-[calc(100%-24px)] bg-[#202123] border border-[#333] rounded-2xl shadow-2xl z-50 text-sm overflow-hidden">
                <div class="px-1 py-1">
                  <button class="w-full flex items-center justify-center gap-2 px-2 py-3 text-red-500 hover:bg-[#2c2c2e] rounded-xl transition-colors font-medium" @click="logout">
                    <Icon name="lucide:log-out" size="18" />
                    <span>退出登录</span>
                  </button>
                </div>
              </div>
            </transition>

            <button class="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[#2c2c2e] transition-colors text-left relative z-10 focus:outline-none">
              <img v-if="gravatarUrl" :src="gravatarUrl" alt="Avatar" class="w-8 h-8 rounded-full bg-[#1a1a1c] shrink-0 object-cover" />
              <div v-else class="w-8 h-8 rounded-full bg-[#1a1a1c] flex items-center justify-center text-white shrink-0 text-sm font-medium">
                {{ currentAccount?.email?.charAt(0).toUpperCase() || 'U' }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-gray-200 truncate">{{ currentAccount?.email?.split('@')[0] || '账号' }}</div>
                <div class="text-[11px] text-gray-400 truncate">{{ currentAccount?.email || '未选择账户' }}</div>
              </div>
            </button>
          </div>
        </div>
      </aside>

      <main class="flex-1 min-w-0 bg-black/35 backdrop-blur-sm flex flex-col">
        <div class="flex-1 min-h-0 overflow-auto">
          <NuxtPage />
        </div>
      </main>
    </div>
  </div>
</template>