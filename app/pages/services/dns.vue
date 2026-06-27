<template>
  <main class="relative min-h-screen overflow-hidden bg-black px-4 py-6 text-white md:px-8">
    <div class="pointer-events-none absolute -right-40 -top-44 h-[620px] w-[620px] rounded-full bg-blue-500/10 blur-3xl" />
    <div class="pointer-events-none absolute -bottom-40 left-1/4 h-[520px] w-[520px] rounded-full bg-cyan-300/10 blur-3xl" />
    <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.06),transparent_35%,rgba(59,130,246,0.08))]" />

    <div class="relative z-10 mx-auto flex h-[calc(100vh-3rem)] w-full max-w-7xl flex-col rounded-3xl border border-white/10 bg-[#11161c]/90 shadow-[0_18px_36px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
      <header class="flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] px-5 py-4 md:px-6">
        <div class="flex min-w-0 items-center gap-4">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-blue-500/15 text-blue-200">
            <Icon
              name="lucide:network"
              size="22"
            />
          </div>
          <div class="min-w-0">
            <p class="text-xs font-medium uppercase tracking-[0.32em] text-gray-500">
              GGU Services
            </p>
            <h1 class="mt-1 truncate font-custom text-2xl tracking-[0.08em] text-white md:text-3xl">
              DNS 分发平台
            </h1>
          </div>
        </div>

        <NuxtLink
          to="/services"
          class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-gray-400 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.08] hover:text-white"
        >
          <Icon
            name="lucide:arrow-left"
            size="14"
          />
          <span>返回服务中心</span>
        </NuxtLink>
      </header>

      <section class="min-h-0 flex-1 overflow-hidden p-4 md:p-5">
        <services-dns-dashboard />
      </section>
    </div>

    <FloatingLoginModal />
  </main>
</template>
