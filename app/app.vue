<script setup>
const route = useRoute()
const isJoinDoscRoute = computed(() => route.path === '/joindosc')
useHead({
  title: '星河环球大学 - Galaxy Global University',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: 'Galaxy Global University Official Website' }
  ],
  link: [
    { rel: 'stylesheet', href: 'https://oss1.236668.xyz/fonts/vivosans.css' },
    { rel: 'stylesheet', href: 'https://oss1.236668.xyz/fonts/lxgw/LXGWWenKai-Regular/result.css' },
    { rel: 'stylesheet', href: 'https://oss1.236668.xyz/fonts/lxgw/LXGWWenKai-Light/result.css' },
    { rel: 'stylesheet', href: 'https://oss1.236668.xyz/fonts/lxgw/LXGWWenKai-Medium/result.css' }
  ],
  script: [
    {
      src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4889390799936204',
      async: true,
      crossorigin: 'anonymous',
      tagPosition: 'bodyClose'
    },
    {
      src: 'https://oss1.236668.xyz/cursor.js',
      defer: true,
      tagPosition: 'bodyClose'
    }
  ],
  htmlAttrs: {
    lang: 'zh'
  }
})
</script>

<template>
  <div :class="['bg-black text-white flex flex-col font-sans selection:bg-gray-800 relative overflow-hidden', isJoinDoscRoute ? 'h-screen' : 'min-h-screen']">
    <!-- Header -->
    <header class="w-full flex justify-between items-center py-6 px-10 border-b border-gray-800/50 absolute top-0 z-20 bg-black/50 backdrop-blur-md">
      <div class="text-xl font-bold tracking-widest uppercase text-white">
        GGU
      </div>
      <nav class="hidden md:flex gap-10 text-sm text-gray-400 font-medium">
        <NuxtLink to="/" class="hover:text-white transition-colors duration-300">首页</NuxtLink>
        <a href="#" class="hover:text-white transition-colors duration-300">关于我们</a>
        <a href="#" class="hover:text-white transition-colors duration-300">学术课程</a>
        <a href="#" class="hover:text-white transition-colors duration-300">招生信息</a>
      </nav>
      <div class="text-sm border border-gray-600 px-5 py-2 rounded-full cursor-pointer hover:bg-white hover:text-black transition-all duration-300">
        校园门户
      </div>
    </header>

    <NuxtPage />

    <!-- Footer -->
    <footer v-if="!isJoinDoscRoute" class="w-full py-8 text-center text-xs md:text-sm text-gray-600 border-t border-gray-900 mt-auto z-20 relative bg-black/80">
      <div class="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <p>&copy; 2026 Galaxy Global University. 保留所有权利.</p>
        <div class="flex gap-4 mt-4 md:mt-0">
          <a href="#" class="hover:text-gray-300 transition-colors">隐私政策</a>
          <a href="#" class="hover:text-gray-300 transition-colors">使用条款</a>
          <a href="#" class="hover:text-gray-300 transition-colors">联系方式</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
.font-custom {
  font-family: "LXGW WenKai", sans-serif;
}

body {
  margin: 0;
  padding: 0;
  background-color: black;
  font-family: "vivo Sans", sans-serif;
}
</style>
