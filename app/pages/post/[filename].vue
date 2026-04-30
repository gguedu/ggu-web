<script setup lang="ts">
interface PostDetailResponse {
  filename: string
  title: string
  date: string
  content: string
}

const route = useRoute()
const config = useRuntimeConfig()

const filename = computed(() => String(route.params.filename || ''))

const { data, pending, error } = await useFetch<PostDetailResponse>(
  () => `/api/post/${filename.value}`,
  {
    baseURL: config.public.postApiBaseUrl
  }
)

const formattedDate = computed(() => {
  if (!data.value?.date) return ''
  return new Date(data.value.date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
})
</script>

<template>
  <main class="relative min-h-screen bg-black text-white">
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute left-0 top-0 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08),rgba(0,0,0,0))]" />
      <div class="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(0,148,255,0.16),rgba(0,0,0,0))]" />
    </div>

    <section class="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 pb-24 pt-28">
      <NuxtLink to="/post" class="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white">
        ← 返回目录
      </NuxtLink>

      <div v-if="pending" class="rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center text-sm text-gray-400">
        正在加载文章内容...
      </div>

      <div v-else-if="error" class="rounded-2xl border border-red-400/30 bg-red-500/10 px-6 py-10 text-center text-sm text-red-200">
        文章加载失败，请稍后再试。
      </div>

      <article v-else-if="data" class="flex flex-col gap-8">
        <header class="flex flex-col gap-4">
          <p class="text-xs uppercase tracking-[0.4em] text-gray-400">GGU Post</p>
          <h1 class="text-3xl font-semibold leading-tight text-white md:text-4xl">{{ data.title }}</h1>
          <div class="text-sm text-gray-400">{{ formattedDate }}</div>
        </header>

        <div class="post-content" v-html="data.content" />
      </article>
    </section>
  </main>
</template>
