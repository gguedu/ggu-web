<script setup lang="ts">
interface PostDetail {
  path: string;
  title: string;
  date?: string;
  description?: string;
  cover?: string;
  category?: string;
  tags?: string[];
  body: unknown;
}

const route = useRoute();
const filename = computed(() => String(route.params.filename || ''));
const postPath = computed(() => `/post/${filename.value}`);

const { data, pending, error } = await useAsyncData(
  () => `post-${filename.value}`,
  () => queryCollection('posts').path(postPath.value).first() as Promise<PostDetail | null>,
  {
    watch: [filename],
  },
);

const formattedDate = computed(() => {
  if (!data.value?.date) return '';
  return new Date(data.value.date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
});

const category = computed(() => data.value?.category || 'GGU');
const tags = computed(() => (data.value?.tags?.length ? data.value.tags : ['文库']));
</script>

<template>
  <main class="relative min-h-screen text-white">
    <section class="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 pb-24 pt-28">
      <NuxtLink
        to="/post"
        class="inline-flex items-center gap-2 text-sm text-[#6b7280] transition-colors duration-300 hover:text-white"
      >
        <Icon name="lucide:arrow-left" size="14" />
        返回目录
      </NuxtLink>

      <div
        v-if="pending"
        class="rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center text-sm text-[#6b7280] backdrop-blur"
      >
        正在加载文章内容...
      </div>

      <div
        v-else-if="error"
        class="rounded-2xl border border-red-400/30 bg-red-500/10 px-6 py-10 text-center text-sm text-red-200"
      >
        文章加载失败，请稍后再试。
      </div>

      <article v-else-if="data" class="flex flex-col gap-8">
        <header class="flex flex-col gap-5">
          <p class="text-xs font-medium uppercase tracking-[0.4em] text-[#6b7280]">GGU Post</p>
          <h1 class="font-custom text-3xl font-semibold leading-tight tracking-[0.05em] text-white md:text-4xl">
            {{ data.title }}
          </h1>
          <div class="flex items-center gap-3 text-sm text-[#6b7280]">
            <Icon name="lucide:calendar" size="14" />
            <span>{{ formattedDate }}</span>
          </div>
          <div class="flex flex-wrap items-center gap-3 text-xs text-[#9ca3af]">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1">
              <Icon name="lucide:folder" size="12" />
              {{ category }}
            </span>
            <span
              v-for="tag in tags"
              :key="tag"
              class="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1"
            >
              <Icon name="lucide:hash" size="10" class="opacity-50" />
              {{ tag }}
            </span>
          </div>
        </header>

        <img
          v-if="data.cover"
          :src="data.cover"
          :alt="data.title"
          class="w-full rounded-2xl border border-white/10 object-cover shadow-[0_18px_40px_rgba(0,0,0,0.4)]"
        />

        <div class="post-content">
          <ContentRenderer :value="data" />
        </div>
      </article>
    </section>
  </main>
</template>
