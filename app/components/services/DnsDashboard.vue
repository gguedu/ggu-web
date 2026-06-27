<script setup lang="ts">
import type { DnsAuthMe, DnsManagedDomainPublic, DnsMeta, DnsRecord, DnsRecordPayload, DnsRecordType, PointLog } from '~/types/dns'

const dnsService = useDnsService()
const { token, restoreToken } = useMailState()
const { openLoginModal } = useFloatingLogin()

const activeMenu = ref<'records' | 'points'>('records')
const auth = ref<DnsAuthMe | null>(null)
const meta = ref<DnsMeta | null>(null)
const records = ref<DnsRecord[]>([])
const pointLogs = ref<PointLog[]>([])
const loading = ref(false)
const submitting = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const form = reactive<DnsRecordPayload>({
  fullDomain: '',
  type: 'A',
  content: '',
  ttl: 600,
  proxied: false,
  priority: undefined,
  comment: ''
})

const selectedDomain = computed<DnsManagedDomainPublic | null>(() => {
  if (!meta.value?.domains.length) return null
  const normalized = form.fullDomain.trim().toLowerCase()
  return (
    meta.value.domains
      .filter(domain => normalized === domain.root || normalized.endsWith(`.${domain.root}`))
      .sort((a, b) => b.root.length - a.root.length)[0] || meta.value.domains[0] || null
  )
})

const allowedTypes = computed<DnsRecordType[]>(() => selectedDomain.value?.allowedTypes || meta.value?.allowedTypes || ['A'])
const canSubmit = computed(() => Boolean(token.value && form.fullDomain && form.content && selectedDomain.value && auth.value))

const formatTime = (value?: string) => {
  if (!value) return '-'
  return new Date(value).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const clearMessages = () => {
  errorMsg.value = ''
  successMsg.value = ''
}

const resetForm = () => {
  form.fullDomain = ''
  form.type = allowedTypes.value[0] || 'A'
  form.content = ''
  form.ttl = selectedDomain.value?.defaultTtl || meta.value?.defaultTtl || 600
  form.proxied = selectedDomain.value?.proxiedDefault || false
  form.priority = undefined
  form.comment = ''
}

const loadData = async () => {
  clearMessages()
  if (import.meta.client) restoreToken()
  if (!token.value) {
    openLoginModal({ reason: '登录后才能进入 DNS 分发平台', afterLogin: loadData })
    return
  }
  loading.value = true
  try {
    const [nextAuth, nextMeta, nextRecords, points] = await Promise.all([
      dnsService.callback(),
      dnsService.meta(),
      dnsService.records(),
      dnsService.points()
    ])
    auth.value = nextAuth
    meta.value = nextMeta
    records.value = nextRecords
    pointLogs.value = points.logs
    if (!allowedTypes.value.includes(form.type)) form.type = allowedTypes.value[0] || 'A'
    if (!form.ttl) form.ttl = nextMeta.defaultTtl
  } catch (error: unknown) {
    errorMsg.value = error instanceof Error ? error.message : '加载 DNS 数据失败'
  } finally {
    loading.value = false
  }
}

const createRecord = async () => {
  clearMessages()
  if (!canSubmit.value) return
  submitting.value = true
  try {
    const payload: DnsRecordPayload = {
      fullDomain: form.fullDomain,
      type: form.type,
      content: form.content,
      ttl: form.ttl,
      proxied: form.proxied,
      priority: form.type === 'MX' ? form.priority : undefined,
      comment: form.comment || undefined
    }
    await dnsService.createRecord(payload)
    successMsg.value = '解析记录已创建'
    resetForm()
    await loadData()
  } catch (error: unknown) {
    errorMsg.value = error instanceof Error ? error.message : '创建失败'
  } finally {
    submitting.value = false
  }
}

const toggleRecord = async (record: DnsRecord) => {
  clearMessages()
  try {
    await dnsService.toggleRecord(record.id)
    await loadData()
  } catch (error: unknown) {
    errorMsg.value = error instanceof Error ? error.message : '操作失败'
  }
}

const deleteRecord = async (record: DnsRecord) => {
  clearMessages()
  if (!window.confirm(`确定删除 ${record.fullDomain} 吗？删除默认不退还积分。`)) return
  try {
    await dnsService.deleteRecord(record.id)
    await loadData()
  } catch (error: unknown) {
    errorMsg.value = error instanceof Error ? error.message : '删除失败'
  }
}

watch(selectedDomain, (domain) => {
  if (!domain) return
  if (!allowedTypes.value.includes(form.type)) form.type = allowedTypes.value[0] || 'A'
  if (!form.ttl) form.ttl = domain.defaultTtl
})

onMounted(loadData)
</script>

<template>
  <div class="flex h-full min-h-[620px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-black/35 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl lg:flex-row">
    <aside class="flex w-full shrink-0 flex-col border-b border-white/10 bg-white/[0.03] p-5 lg:w-72 lg:border-b-0 lg:border-r">
      <div>
        <p class="text-xs uppercase tracking-[0.35em] text-gray-500">DNS Console</p>
        <h2 class="mt-3 text-2xl font-semibold text-white">DNS 分发平台</h2>
        <p class="mt-2 text-sm leading-6 text-gray-500">自助创建 GGU 开放域名下的解析记录。</p>
      </div>

      <nav class="mt-8 space-y-2">
        <button
          class="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition-colors"
          :class="activeMenu === 'records' ? 'bg-blue-600/20 text-blue-300' : 'text-gray-400 hover:bg-white/[0.06] hover:text-white'"
          @click="activeMenu = 'records'"
        >
          <Icon name="lucide:list-tree" size="18" />
          我的解析
        </button>
        <button
          class="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition-colors"
          :class="activeMenu === 'points' ? 'bg-blue-600/20 text-blue-300' : 'text-gray-400 hover:bg-white/[0.06] hover:text-white'"
          @click="activeMenu = 'points'"
        >
          <Icon name="lucide:ticket-percent" size="18" />
          兑换积分
        </button>
      </nav>

      <div class="mt-auto rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-gray-400">
        <p class="text-xs uppercase tracking-[0.24em] text-gray-600">账户信息</p>
        <template v-if="auth">
          <p class="mt-3 truncate text-gray-300">邮箱：{{ auth.user.email }}</p>
          <p class="mt-1">UID：{{ auth.user.uid }}</p>
          <p class="mt-1 text-blue-300">积分：{{ auth.user.points }}</p>
        </template>
        <button
          v-else
          class="mt-4 w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
          @click="openLoginModal({ reason: '登录后才能使用 DNS 分发平台', afterLogin: loadData })"
        >
          登录通行证
        </button>
      </div>
    </aside>

    <section class="flex min-w-0 flex-1 flex-col">
      <header class="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div>
          <p class="text-sm text-gray-500">{{ activeMenu === 'records' ? '解析记录' : '积分中心' }}</p>
          <h3 class="text-xl font-semibold text-white">{{ activeMenu === 'records' ? '我的解析' : '兑换积分' }}</h3>
        </div>
        <button
          class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-60"
          :disabled="loading"
          @click="loadData"
        >
          <Icon name="lucide:refresh-cw" size="16" :class="loading ? 'animate-spin' : ''" />
          刷新 DNS 数据
        </button>
      </header>

      <div class="min-h-0 flex-1 overflow-auto p-5">
        <p v-if="errorMsg" class="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{{ errorMsg }}</p>
        <p v-if="successMsg" class="mb-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{{ successMsg }}</p>

        <div v-if="activeMenu === 'records'" class="space-y-5">
          <form class="rounded-3xl border border-white/10 bg-white/[0.035] p-5" @submit.prevent="createRecord">
            <div class="mb-4 flex items-center justify-between gap-3">
              <div>
                <h4 class="font-semibold text-white">新建解析</h4>
                <p class="mt-1 text-sm text-gray-500">1 积分默认创建 1 条解析；类型由后台配置控制。</p>
              </div>
              <span v-if="selectedDomain" class="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-200">{{ selectedDomain.root }} · {{ selectedDomain.pointCost }} 积分</span>
            </div>
            <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <input v-model="form.fullDomain" class="rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none focus:border-blue-400/60" placeholder="完整域名，如 a.example.com">
              <select v-model="form.type" class="rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none focus:border-blue-400/60">
                <option v-for="type in allowedTypes" :key="type" :value="type" class="bg-[#11161c]">{{ type }}</option>
              </select>
              <input v-model="form.content" class="rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none focus:border-blue-400/60" placeholder="记录值">
              <input v-model.number="form.ttl" type="number" min="60" class="rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none focus:border-blue-400/60" placeholder="TTL">
              <input v-if="form.type === 'MX'" v-model.number="form.priority" type="number" min="0" class="rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none focus:border-blue-400/60" placeholder="MX Priority">
              <input v-model="form.comment" class="rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none focus:border-blue-400/60" placeholder="备注（可选）">
              <label class="flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-gray-300">
                <input v-model="form.proxied" type="checkbox" class="accent-blue-500">
                Cloudflare 代理
              </label>
              <button class="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-50" :disabled="submitting || !canSubmit">
                {{ submitting ? '创建中...' : '+ 新建解析' }}
              </button>
            </div>
          </form>

          <div class="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
            <div v-if="!records.length" class="px-6 py-14 text-center text-gray-500">
              暂无解析记录。
            </div>
            <div v-else class="overflow-x-auto">
              <table class="min-w-full text-left text-sm">
                <thead class="border-b border-white/10 text-xs uppercase tracking-[0.18em] text-gray-500">
                  <tr>
                    <th class="px-4 py-3">域名</th>
                    <th class="px-4 py-3">类型</th>
                    <th class="px-4 py-3">记录值</th>
                    <th class="px-4 py-3">时间</th>
                    <th class="px-4 py-3">状态</th>
                    <th class="px-4 py-3">创建 IP</th>
                    <th class="px-4 py-3">操作</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/10 text-gray-300">
                  <tr v-for="record in records" :key="record.id">
                    <td class="px-4 py-3 font-medium text-white">{{ record.fullDomain }}</td>
                    <td class="px-4 py-3">{{ record.type }}</td>
                    <td class="max-w-[260px] truncate px-4 py-3">{{ record.content }}</td>
                    <td class="px-4 py-3">{{ formatTime(record.createdAt) }}</td>
                    <td class="px-4 py-3">
                      <span class="rounded-full px-2.5 py-1 text-xs" :class="record.enabled ? 'bg-emerald-500/10 text-emerald-200' : 'bg-gray-500/10 text-gray-300'">
                        {{ record.enabled ? '启用' : '关闭' }} · {{ record.status }}
                      </span>
                    </td>
                    <td class="px-4 py-3">{{ record.createIp || '-' }}</td>
                    <td class="space-x-2 px-4 py-3">
                      <button class="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-gray-100 hover:bg-white/15" @click="toggleRecord(record)">{{ record.enabled ? '关闭' : '启用' }}</button>
                      <button class="rounded-lg bg-red-500/15 px-3 py-1.5 text-xs text-red-100 hover:bg-red-500/25" @click="deleteRecord(record)">删除</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div v-else class="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
          <section class="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
            <h4 class="font-semibold text-white">兑换积分</h4>
            <p class="mt-2 text-sm leading-6 text-gray-500">本期仅提供 UI 占位，兑换码校验逻辑将在后续版本接入。</p>
            <input class="mt-5 w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none focus:border-blue-400/60" placeholder="输入兑换码（暂未开放）" disabled>
            <button class="mt-3 w-full rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-gray-400" disabled>兑换积分</button>
          </section>
          <section class="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
            <h4 class="font-semibold text-white">积分流水</h4>
            <div class="mt-4 space-y-3">
              <p v-if="!pointLogs.length" class="text-sm text-gray-500">暂无积分流水。</p>
              <div v-for="log in pointLogs" :key="log.id" class="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm">
                <div>
                  <p class="text-gray-200">{{ log.message || log.reason }}</p>
                  <p class="mt-1 text-xs text-gray-600">{{ formatTime(log.createdAt) }}</p>
                </div>
                <p :class="log.delta > 0 ? 'text-emerald-300' : 'text-red-300'">{{ log.delta > 0 ? '+' : '' }}{{ log.delta }}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  </div>
</template>
