<script setup>
useHead({
  title: '星河环球大学 - Galaxy Global University',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: 'Galaxy Global University Official Website' }
  ],
  htmlAttrs: {
    lang: 'zh'
  }
})
</script>

<template>
  <div class="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-gray-800 relative overflow-hidden">
    <!-- Header -->
    <header class="w-full flex justify-between items-center py-6 px-10 border-b border-gray-800/50 absolute top-0 z-20 bg-black/50 backdrop-blur-md">
      <div class="text-xl font-bold tracking-widest uppercase text-white">
        GGU
      </div>
      <nav class="hidden md:flex gap-10 text-sm text-gray-400 font-medium">
        <a href="#" class="hover:text-white transition-colors duration-300">首页</a>
        <a href="#" class="hover:text-white transition-colors duration-300">关于我们</a>
        <a href="#" class="hover:text-white transition-colors duration-300">学术课程</a>
        <a href="#" class="hover:text-white transition-colors duration-300">招生信息</a>
      </nav>
      <div class="text-sm border border-gray-600 px-5 py-2 rounded-full cursor-pointer hover:bg-white hover:text-black transition-all duration-300">
        校园门户
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow flex flex-col items-center justify-center text-center px-4 relative z-10 w-full pt-20 pb-10">
      
      <!-- Center Text -->
      <div class="relative z-10 w-full max-w-5xl mx-auto">
        <h1 class="text-6xl md:text-8xl lg:text-[7.5rem] font-bold tracking-[0.1em] mb-6 text-white" style="text-shadow: 0 4px 60px rgba(255,255,255,0.15);">
          星河环球大学
        </h1>
        <p class="text-lg md:text-2xl tracking-[0.3em] font-light text-gray-400 uppercase mb-20 md:mb-28">
          Galaxy Global University
        </p>
        
        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-sm md:text-base font-semibold tracking-wider">
          <button class="w-full sm:w-auto px-12 py-4 bg-white text-black border border-white hover:bg-gray-200 hover:border-gray-200 transition-all duration-300">
            申请入学
          </button>
          <button class="w-full sm:w-auto px-12 py-4 bg-transparent text-white border border-white hover:bg-white/10 transition-all duration-300">
            学术研究
          </button>
          <button class="w-full sm:w-auto px-12 py-4 bg-transparent text-white border border-white hover:bg-white/10 transition-all duration-300">
            校园生活
          </button>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="w-full py-8 text-center text-xs md:text-sm text-gray-600 border-t border-gray-900 mt-auto z-20 relative bg-black/80">
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
body {
  margin: 0;
  padding: 0;
  background-color: black;
}
</style>
