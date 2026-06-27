<script setup lang="ts">
const selectedServiceId = ref('dns')

const services = [
  {
    id: 'dns',
    name: 'DNS 分发平台',
    eyebrow: 'DNS Distribution',
    summary: '使用 GGU 通行证登录后，自助创建和管理开放域名下的 DNS 解析。',
    icon: 'lucide:network',
    accent: 'from-blue-500/30 to-cyan-400/10',
    action: '立即前往',
    to: '/services/dns'
  },
  {
    id: 'passport',
    name: '星河通行证',
    eyebrow: 'Passport',
    summary: '统一身份账号、邮箱与后续服务的登录入口。',
    icon: 'lucide:badge-check',
    accent: 'from-white/16 to-white/5',
    action: '打开通行证',
    to: '/mail'
  },
  {
    id: 'library',
    name: '星河文库',
    eyebrow: 'Knowledge Base',
    summary: '查看公告、协议、文档与项目说明。',
    icon: 'lucide:book-open-text',
    accent: 'from-emerald-400/20 to-white/5',
    action: '浏览文库',
    to: '/post'
  }
]

type ServiceItem = (typeof services)[number]

const selectedService = computed<ServiceItem>(() => services.find(item => item.id === selectedServiceId.value) ?? services[0]!)

const goService = async () => {
  if (selectedService.value.to) await navigateTo(selectedService.value.to)
}
</script>

<template>
  <main class="min-h-screen px-4 pb-8 pt-28 text-white md:px-8">
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <section class="grid min-h-[480px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1018]/70 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl lg:grid-cols-[280px_1fr]">
        <aside class="border-b border-white/10 bg-white/[0.03] p-4 lg:border-b-0 lg:border-r">
          <p class="mb-3 px-3 text-xs uppercase tracking-[0.32em] text-gray-600">服务列表</p>
          <button
            v-for="service in services"
            :key="service.id"
            class="mb-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-300"
            :class="selectedServiceId === service.id ? 'bg-white/12 text-white' : 'text-gray-400 hover:bg-white/[0.06] hover:text-white'"
            @click="selectedServiceId = service.id"
          >
            <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">
              <Icon :name="service.icon" size="20" />
            </span>
            <span>
              <span class="block text-sm font-semibold">{{ service.name }}</span>
              <span class="block text-xs text-gray-600">{{ service.eyebrow }}</span>
            </span>
          </button>
        </aside>

        <div class="relative overflow-hidden p-6 md:p-10">
          <Transition
            mode="out-in"
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4 scale-[0.98]"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 -translate-y-3 scale-[0.98]"
          >
            <div :key="selectedService.id" class="grid h-full gap-8 lg:grid-cols-[360px_1fr] lg:items-center">
              <div :class="['relative flex aspect-square items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br shadow-[0_22px_70px_rgba(0,0,0,0.35)]', selectedService.accent]">
                <div class="absolute inset-8 rounded-[1.5rem] border border-white/10 bg-white/[0.06] backdrop-blur-md" />
                <Icon :name="selectedService.icon" size="118" class="relative z-10 text-white/85 drop-shadow-2xl" />
              </div>

              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.38em] text-blue-300/70">{{ selectedService.eyebrow }}</p>
                <h2 class="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">{{ selectedService.name }}</h2>
                <p class="mt-5 max-w-2xl text-lg leading-8 text-gray-400">{{ selectedService.summary }}</p>
                <div class="mt-8 flex flex-wrap items-center gap-3">
                  <button class="inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-[0_14px_36px_rgba(37,99,235,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500" @click="goService">
                    {{ selectedService.action }}
                    <Icon name="lucide:arrow-right" size="16" />
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </section>
    </div>
  </main>
</template>
