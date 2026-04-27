<script setup lang="ts">
definePageMeta({
  middleware: 'mail-auth'
})

const route = useRoute()
const router = useRouter()
const showAside = ref(false)
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

  <div v-else class="bg-[#141414] text-white overflow-hidden" :style="shellStyle">
    <div class="flex h-full">
      <div v-if="showAside" class="fixed inset-0 bg-black/50 z-40 md:hidden" @click="closeAside" />

      <aside
        class="fixed md:static md:top-0 left-0 z-50 w-64 md:h-auto md:min-h-full bg-[#1c1c1e] border-r border-[#333] transform transition-transform duration-300"
        :style="asideStyle"
        :class="showAside ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
      >
        <div class="flex items-center gap-3 px-5 py-4 border-b border-[#333]">
          <Icon name="lucide:mail" size="22" class="text-blue-400" />
          <span class="font-bold text-lg tracking-wide">{{ config.title || 'Cloud Mail' }}</span>
        </div>

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
      </aside>

      <main class="flex-1 min-w-0 bg-[#141414] flex flex-col">
        <header class="flex items-center justify-between px-4 md:px-6 py-3 border-b border-[#333] gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <button class="md:hidden p-1 rounded-md text-gray-400 hover:bg-[#2c2c2e]" @click="showAside = !showAside">
              <Icon name="lucide:menu" size="22" />
            </button>
            <div class="text-sm text-gray-300 truncate">{{ currentAccount?.email || '未选择账户' }}</div>
          </div>

          <div class="flex items-center gap-2">
            <select
              v-model.number="currentAccountId"
              class="bg-[#1c1c1e] border border-[#333] rounded px-2 py-1 text-sm text-gray-200 max-w-[180px]"
            >
              <option v-for="item in accounts" :key="item.accountId" :value="item.accountId">{{ item.email }}</option>
            </select>
            <button class="px-2 py-1 rounded text-sm text-gray-300 hover:bg-[#2c2c2e]" @click="router.push('/mail/login')">登录页</button>
            <button class="px-2 py-1 rounded text-sm text-red-300 hover:bg-red-900/30" @click="logout">退出</button>
          </div>
        </header>

        <div class="flex-1 min-h-0 overflow-hidden">
          <NuxtPage />
        </div>
      </main>
    </div>
  </div>
</template>