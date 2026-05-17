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
  () => `posts-page-${page.value}`,
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
  router.push({
    path: '/post',
    query: { page: String(safePage) },
  });
};
</script>

<template>
  <main class="relative h-screen overflow-hidden text-white">
    <section
      class="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col gap-8 px-6 pb-8 pt-28 box-border min-h-0"
    >
      <header class="flex flex-col gap-6">
        <div class="flex flex-col gap-4">
          <p class="text-xs font-medium uppercase tracking-[0.4em] text-[#6b7280]">GGU Post Archive</p>
          <h1 class="font-custom text-4xl font-semibold tracking-[0.1em] md:text-5xl">星河文库</h1>
          <p class="max-w-2xl text-base leading-relaxed text-[#9ca3af]">
            汇集校园新闻、学术活动与研究速递。每一篇文章都由构建引擎自动整理，确保干净、快速、无噪声的阅读体验。
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-3 text-xs text-[#6b7280]">
          <div class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <Icon name="lucide:file-text" size="13" />
            <span>共 {{ total }} 篇</span>
          </div>
          <div class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <Icon name="lucide:layers" size="13" />
            <span>第 {{ page }} / {{ totalPages }} 页</span>
          </div>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto pr-2 min-h-0">
        <section class="grid gap-6">
          <article
            v-for="item in posts"
            :key="item.path"
            class="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#11161c]/90 shadow-[0_18px_36px_rgba(0,0,0,0.35)] backdrop-blur"
          >
            <div class="flex flex-col gap-6 p-6 md:flex-row md:items-center md:gap-10">
              <div class="flex flex-1 flex-col gap-4">
                <div class="flex flex-wrap items-center gap-2 text-xs text-[#9ca3af]">
                  <span class="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1">
                    <Icon name="lucide:calendar" size="12" />
                    {{ formatDate(item.date) }}
                  </span>
                  <span class="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1">
                    <Icon name="lucide:folder" size="12" />
                    {{ getCategory(item) }}
                  </span>
                  <span
                    v-for="tag in getTags(item)"
                    :key="tag"
                    class="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1"
                  >
                    <Icon name="lucide:hash" size="10" class="opacity-50" />
                    {{ tag }}
                  </span>
                </div>
                <h3 class="text-xl font-semibold leading-snug text-white">
                  <NuxtLink :to="getPostUrl(item)" class="transition-colors duration-300 hover:text-white/80">
                    {{ item.title }}
                  </NuxtLink>
                </h3>
                <p class="text-sm leading-relaxed text-[#9ca3af] line-clamp-3">
                  {{ item.description }}
                </p>
              </div>

              <NuxtLink
                :to="getPostUrl(item)"
                class="relative block overflow-hidden rounded-2xl border border-white/10 bg-[#0b1118] md:h-32 md:w-56"
              >
                <div v-if="item.cover" class="h-48 w-full overflow-hidden md:h-full">
                  <img
                    :src="item.cover"
                    :alt="item.title"
                    class="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div
                  v-else
                  class="flex h-48 items-center justify-center bg-gradient-to-br from-[#11161c] via-[#0b1118] to-black md:h-full"
                >
                  <span class="font-custom text-5xl font-semibold text-white/50">{{
                    getInitial(item.title)
                  }}</span>
                </div>
              </NuxtLink>
            </div>
          </article>
        </section>

        <div
          v-if="pending"
          class="mt-6 rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center text-sm text-[#6b7280] backdrop-blur"
        >
          正在加载文章目录...
        </div>

        <div
          v-else-if="error"
          class="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-6 py-10 text-center text-sm text-red-200"
        >
          文章目录加载失败，请稍后再试。
        </div>

        <div
          v-else-if="posts.length === 0"
          class="mt-6 rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center text-sm text-[#6b7280] backdrop-blur"
        >
          暂无文章内容。
        </div>
      </div>

      <footer class="flex flex-wrap items-center justify-between gap-4 pt-4 text-sm text-[#6b7280]">
        <button
          class="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          :disabled="page <= 1"
          @click="goToPage(page - 1)"
        >
          <Icon name="lucide:chevron-left" size="14" />
          上一页
        </button>
        <div class="text-xs font-medium uppercase tracking-[0.3em] text-[#4b5563]">
          {{ page }} / {{ totalPages }}
        </div>
        <button
          class="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          :disabled="page >= totalPages"
          @click="goToPage(page + 1)"
        >
          下一页
          <Icon name="lucide:chevron-right" size="14" />
        </button>
      </footer>
    </section>
  </main>
</template>
