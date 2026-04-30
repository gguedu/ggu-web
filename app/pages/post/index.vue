<script setup lang="ts">
interface PostListItem {
  filename: string
  title: string
  date: string
  excerpt: string
  coverImage: string | null
}

interface PostListResponse {
  total: number
  page: number
  limit: number
  totalPages: number
  data: PostListItem[]
}

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

const page = ref(Number(route.query.page) || 1)
const limit = 12

watch(
  () => route.query.page,
  (value) => {
    const nextPage = Number(value) || 1
    if (nextPage !== page.value) {
      page.value = nextPage
    }
  }
)

const queryParams = computed(() => ({
  page: page.value,
  limit
}))

const { data, pending, error } = await useFetch<PostListResponse>('/api/posts', {
  baseURL: config.public.postApiBaseUrl,
  query: queryParams
})

const posts = computed(() => data.value?.data ?? [])
const totalPages = computed(() => data.value?.totalPages ?? 1)

const formatDate = (value: string) => {
  if (!value) return ''
  return new Date(value).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const getInitial = (title: string) => title?.trim()?.slice(0, 1) || 'G'

const goToPage = (nextPage: number) => {
  const safePage = Math.min(Math.max(nextPage, 1), totalPages.value)
  router.push({
    path: '/post',
    query: { page: String(safePage) }
  })
}
</script>

<template>
  <main class="relative h-screen overflow-hidden bg-black text-white">
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute -right-40 -top-48 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12),rgba(0,0,0,0))]" />
      <div class="absolute left-10 top-20 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(0,148,255,0.18),rgba(0,0,0,0))]" />
      <div class="absolute bottom-0 right-0 h-[420px] w-[420px] bg-[radial-gradient(circle,rgba(0,0,0,0),rgba(0,0,0,0.85))]" />
    </div>

    <section class="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col gap-8 px-6 pb-8 pt-28 box-border min-h-0">
      <header class="flex flex-col gap-6">
        <div class="flex flex-col gap-4">
          <p class="text-sm uppercase tracking-[0.4em] text-gray-400">GGU Post Archive</p>
          <h1 class="text-4xl font-semibold tracking-[0.1em] md:text-5xl">星河文库</h1>
          <p class="max-w-2xl text-base text-gray-400">
            汇集校园新闻、学术活动与研究速递。每一篇文章都由构建引擎自动整理，确保干净、快速、无噪声的阅读体验。
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-400">
          <div class="rounded-full border border-white/10 bg-white/5 px-4 py-2">共 {{ data?.total ?? 0 }} 篇</div>
          <div class="rounded-full border border-white/10 bg-white/5 px-4 py-2">第 {{ page }} / {{ totalPages }} 页</div>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto pr-2 min-h-0">
        <section class="grid gap-6">
          <article
            v-for="item in posts"
            :key="item.filename"
            class="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#11161c]/90 shadow-[0_18px_36px_rgba(0,0,0,0.35)] backdrop-blur"
          >
            <div class="flex flex-col gap-6 p-6 md:flex-row md:items-center md:gap-10">
              <div class="flex flex-1 flex-col gap-4">
                <div class="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                  <span class="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1">📅 {{ formatDate(item.date) }}</span>
                  <span class="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1">📘 GGU</span>
                  <span class="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1"># 文库</span>
                </div>
                <h3 class="text-2xl font-semibold leading-snug text-white">
                  <NuxtLink :to="`/post/${item.filename}`" class="hover:text-white/80">
                    {{ item.title }}
                  </NuxtLink>
                </h3>
                <p class="text-sm leading-relaxed text-gray-400 line-clamp-3">{{ item.excerpt }}</p>
                <div class="mt-2 text-xs text-gray-500">阅读时长 · 1 分钟</div>
              </div>

              <NuxtLink :to="`/post/${item.filename}`" class="relative block overflow-hidden rounded-2xl border border-white/10 bg-black/40 md:h-32 md:w-56">
                <div v-if="item.coverImage" class="h-48 w-full overflow-hidden md:h-full">
                  <img
                    :src="item.coverImage"
                    :alt="item.title"
                    class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div v-else class="flex h-48 items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-black md:h-full">
                  <span class="text-5xl font-semibold text-white/60">{{ getInitial(item.title) }}</span>
                </div>
              </NuxtLink>
            </div>
          </article>
        </section>

        <div v-if="pending" class="mt-6 rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center text-sm text-gray-400">
          正在加载文章目录...
        </div>

        <div v-else-if="error" class="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-6 py-10 text-center text-sm text-red-200">
          文章目录加载失败，请稍后再试。
        </div>

        <div v-else-if="posts.length === 0" class="mt-6 rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center text-sm text-gray-400">
          暂无文章内容。
        </div>
      </div>

      <footer class="flex flex-wrap items-center justify-between gap-4 pt-4 text-sm text-gray-400">
        <button
          class="rounded-full border border-white/15 px-5 py-2 transition hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="page <= 1"
          @click="goToPage(page - 1)"
        >
          上一页
        </button>
        <div class="text-xs uppercase tracking-[0.3em]">Page {{ page }} of {{ totalPages }}</div>
        <button
          class="rounded-full border border-white/15 px-5 py-2 transition hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="page >= totalPages"
          @click="goToPage(page + 1)"
        >
          下一页
        </button>
      </footer>
    </section>
  </main>
</template>
