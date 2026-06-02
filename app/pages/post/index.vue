<script setup lang="ts">
interface PostItem {
  path: string;
  stem: string;
  title: string;
  date?: string;
  description?: string;
  cover?: string;
  category?: string;
  tags?: string[];
}

const route = useRoute();
const router = useRouter();

const page = ref(Number(route.query.page) || 1);
const limit = 12;

watch(
  () => route.query.page,
  (value) => {
    const nextPage = Number(value) || 1;
    if (nextPage !== page.value) {
      page.value = nextPage;
    }
  },
);

const { data, pending, error } = await useAsyncData(
  'posts-list',
  async () => {
    const [items, total] = await Promise.all([
      queryCollection('posts')
        .order('date', 'DESC')
        .skip((page.value - 1) * limit)
        .limit(limit)
        .all(),
      queryCollection('posts').count('*'),
    ]);

    return {
      items: items as PostItem[],
      total,
    };
  },
  {
    watch: [page],
  },
);

const posts = computed(() => data.value?.items ?? []);
const total = computed(() => data.value?.total ?? 0);
const totalPages = computed(() => Math.max(Math.ceil(total.value / limit), 1));

watch(
  [data, pending],
  () => {
    if (!pending.value && data.value && page.value > totalPages.value) {
      router.replace({ path: '/post', query: { page: String(totalPages.value) } });
    }
  },
  { immediate: true },
);

const visiblePages = computed(() => {
  const pages: number[] = [];
  const total_ = totalPages.value;
  const current = page.value;
  const start = Math.max(1, current - 2);
  const end = Math.min(total_, current + 2);
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
});

const formatDate = (value?: string) => {
  if (!value) return '';
  return new Date(value).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const getInitial = (title: string) => title?.trim()?.slice(0, 1) || 'G';
const getPostUrl = (item: PostItem) => item.path;
const getCategory = (item: PostItem) => item.category || 'GGU';
const getTags = (item: PostItem) => (item.tags?.length ? item.tags : ['文库']);

const goToPage = (nextPage: number) => {
  const safePage = Math.min(Math.max(nextPage, 1), totalPages.value);
  if (safePage === page.value) return;
  router.push({
    path: '/post',
    query: { page: String(safePage) },
  });
};

watch(page, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
</script>

<template>
  <main class="relative h-full min-h-0 text-white">
    <section
      class="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col gap-8 px-6 pb-8 pt-28 box-border min-h-0"
    >
      <header class="flex flex-col gap-6 shrink-0">
        <div class="flex flex-col gap-4">
          <p class="text-xs font-medium uppercase tracking-[0.4em] text-[#6b7280]">
            GGU Post Archive
          </p>
          <h1 class="font-custom text-4xl font-semibold tracking-[0.1em] md:text-5xl">星河文库</h1>
          <p class="max-w-2xl text-base leading-relaxed text-[#9ca3af]">
            汇集校园新闻、学术活动与研究速递。每一篇文章都由构建引擎自动整理，确保干净、快速、无噪声的阅读体验。
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-3 text-xs text-[#6b7280]">
          <div
            class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2"
          >
            <Icon name="lucide:file-text" size="13" />
            <span>共 {{ total }} 篇</span>
          </div>
          <div
            class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2"
          >
            <Icon name="lucide:layers" size="13" />
            <span>第 {{ page }} / {{ totalPages }} 页</span>
          </div>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto pr-2 min-h-0">
        <!-- Skeleton loading -->
        <section v-if="pending && posts.length === 0" class="grid gap-6 md:grid-cols-2">
          <div
            v-for="n in 4"
            :key="n"
            class="animate-pulse rounded-2xl border border-white/10 bg-[#11161c]/90 p-6"
          >
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:gap-10">
              <div class="flex flex-1 flex-col gap-4">
                <div class="flex gap-2">
                  <div class="h-6 w-24 rounded-full bg-white/5" />
                  <div class="h-6 w-16 rounded-full bg-white/5" />
                </div>
                <div class="h-7 w-3/4 rounded-lg bg-white/8" />
                <div class="flex flex-col gap-2">
                  <div class="h-4 w-full rounded bg-white/5" />
                  <div class="h-4 w-5/6 rounded bg-white/5" />
                </div>
              </div>
              <div class="h-36 w-full shrink-0 rounded-2xl bg-white/5 md:w-52" />
            </div>
          </div>
        </section>

        <!-- Post list -->
        <section v-else-if="posts.length > 0" class="grid gap-6 md:grid-cols-2">
          <article
            v-for="item in posts"
            :key="item.path"
            class="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#11161c]/90 shadow-[0_18px_36px_rgba(0,0,0,0.35)] backdrop-blur transition-transform duration-300 active:scale-[0.98] md:active:scale-100"
          >
            <div class="flex flex-col gap-6 p-6 md:flex-row md:items-center md:gap-8">
              <div class="flex flex-1 flex-col gap-3">
                <div class="flex flex-wrap items-center gap-2 text-xs">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-1 text-[#9ca3af]"
                  >
                    <Icon name="lucide:calendar" size="12" />
                    {{ formatDate(item.date) }}
                  </span>
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full bg-[#00c16a]/10 px-3 py-1 text-[#00c16a]"
                  >
                    <Icon name="lucide:folder" size="12" />
                    {{ getCategory(item) }}
                  </span>
                  <span
                    v-for="tag in getTags(item)"
                    :key="tag"
                    class="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-[#6b7280]"
                  >
                    <Icon name="lucide:hash" size="10" class="opacity-50" />
                    {{ tag }}
                  </span>
                </div>
                <h3 class="text-lg font-semibold leading-snug text-white md:text-xl">
                  <NuxtLink
                    :to="getPostUrl(item)"
                    class="transition-colors duration-300 hover:text-white/80"
                  >
                    {{ item.title }}
                  </NuxtLink>
                </h3>
                <p class="text-sm leading-relaxed text-[#9ca3af] line-clamp-2 md:line-clamp-3">
                  {{ item.description }}
                </p>
              </div>

              <NuxtLink
                :to="getPostUrl(item)"
                class="relative block overflow-hidden rounded-2xl border border-white/10 bg-[#0b1118] md:h-32 md:w-52"
              >
                <div v-if="item.cover" class="h-40 w-full overflow-hidden md:h-full">
                  <img
                    :src="item.cover"
                    :alt="item.title"
                    class="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 208px"
                  />
                </div>
                <div
                  v-else
                  class="flex h-40 items-center justify-center bg-gradient-to-br from-[#11161c] via-[#0b1118] to-black md:h-full"
                >
                  <span class="font-custom text-5xl font-semibold text-white/50">{{
                    getInitial(item.title)
                  }}</span>
                </div>
              </NuxtLink>
            </div>
          </article>
        </section>

        <!-- Error state -->
        <div
          v-else-if="error"
          class="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-red-400/20 bg-red-500/5 px-6 py-12 text-center backdrop-blur"
        >
          <Icon name="lucide:alert-circle" size="32" class="text-red-400/60" />
          <p class="text-sm text-red-200/80">文章目录加载失败，请稍后再试。</p>
          <button
            class="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2 text-xs text-[#9ca3af] transition-all duration-300 hover:border-white/40 hover:text-white"
            @click="router.go(0)"
          >
            <Icon name="lucide:refresh-cw" size="13" />
            重新加载
          </button>
        </div>

        <!-- Empty state -->
        <div
          v-else-if="!pending && posts.length === 0"
          class="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center backdrop-blur"
        >
          <Icon name="lucide:inbox" size="32" class="text-[#6b7280]" />
          <p class="text-sm text-[#6b7280]">暂无文章内容。</p>
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2 text-xs text-[#9ca3af] transition-all duration-300 hover:border-white/40 hover:text-white"
          >
            <Icon name="lucide:home" size="13" />
            返回首页
          </NuxtLink>
        </div>
      </div>

      <!-- Pagination -->
      <footer
        v-if="totalPages > 1"
        class="flex flex-wrap items-center justify-center gap-2 pt-4 text-sm text-[#6b7280] shrink-0"
      >
        <button
          class="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs transition-all duration-300 hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          :disabled="page <= 1 || pending"
          @click="goToPage(page - 1)"
        >
          <Icon name="lucide:chevron-left" size="14" />
          <span class="hidden sm:inline">上一页</span>
        </button>

        <template v-if="totalPages <= 7">
          <button
            v-for="p in totalPages"
            :key="p"
            class="inline-flex h-9 w-9 items-center justify-center rounded-full text-xs transition-all duration-300"
            :class="
              p === page
                ? 'bg-white/15 text-white font-medium'
                : 'text-[#6b7280] hover:bg-white/8 hover:text-white'
            "
            :disabled="pending"
            @click="goToPage(p)"
          >
            {{ p }}
          </button>
        </template>
        <template v-else>
          <button
            v-if="(visiblePages[0] ?? 0) > 1"
            class="inline-flex h-9 w-9 items-center justify-center rounded-full text-xs text-[#6b7280] transition-all duration-300 hover:bg-white/8 hover:text-white"
            :disabled="pending"
            @click="goToPage(1)"
          >
            1
          </button>
          <span v-if="(visiblePages[0] ?? 0) > 2" class="px-1 text-[#4b5563]">...</span>
          <button
            v-for="p in visiblePages"
            :key="p"
            class="inline-flex h-9 w-9 items-center justify-center rounded-full text-xs transition-all duration-300"
            :class="
              p === page
                ? 'bg-white/15 text-white font-medium'
                : 'text-[#6b7280] hover:bg-white/8 hover:text-white'
            "
            :disabled="pending"
            @click="goToPage(p)"
          >
            {{ p }}
          </button>
          <span
            v-if="(visiblePages[visiblePages.length - 1] ?? 0) < totalPages - 1"
            class="px-1 text-[#4b5563]"
            >...</span
          >
          <button
            v-if="(visiblePages[visiblePages.length - 1] ?? 0) < totalPages"
            class="inline-flex h-9 w-9 items-center justify-center rounded-full text-xs text-[#6b7280] transition-all duration-300 hover:bg-white/8 hover:text-white"
            :disabled="pending"
            @click="goToPage(totalPages)"
          >
            {{ totalPages }}
          </button>
        </template>

        <button
          class="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs transition-all duration-300 hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          :disabled="page >= totalPages || pending"
          @click="goToPage(page + 1)"
        >
          <span class="hidden sm:inline">下一页</span>
          <Icon name="lucide:chevron-right" size="14" />
        </button>
      </footer>
    </section>
  </main>
</template>
