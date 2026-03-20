<script setup>
const showForm = ref(false)
</script>

<template>
  <main class="flex-1 w-full flex flex-col pt-24 pb-8 md:px-8 px-4 overflow-hidden z-10">
    <div class="flex-1 w-full max-w-7xl mx-auto bg-white/5 rounded-xl border border-gray-800 p-4 md:p-6 backdrop-blur-sm shadow-2xl flex flex-col overflow-hidden relative z-10">
      <h2 class="text-2xl md:text-3xl font-bold mb-4 text-center text-white tracking-widest font-custom shrink-0">线上申请</h2>

      <!-- 引导填表页 -->
      <div v-if="!showForm" class="flex-1 w-full border border-gray-700/50 bg-black/40 rounded-lg flex flex-col items-center justify-center p-8 text-center backdrop-blur-md">
        <h3 class="text-3xl font-custom text-white mb-6 tracking-widest">欢迎申请星河环球大学</h3>
        <p class="text-gray-400 mb-10 text-lg tracking-wider max-w-2xl leading-relaxed">
          加入我们，开启探索知识与宇宙奥秘的旅程。<br>
          表单服务由Google Dosc提供，请确保您的网络环境可正常访问
        </p>
        <button 
          @click="showForm = true" 
          class="px-12 py-4 bg-white text-black font-bold text-lg rounded-md hover:bg-gray-200 transition-all duration-300 tracking-widest hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
        >
          填写申请表
        </button>
      </div>

      <!-- 谷歌问卷内容 -->
      <div v-else class="flex-1 w-full rounded-lg overflow-hidden relative bg-gray-100 animate-fade-in">
        <iframe 
          src="https://docs.google.com/forms/d/e/1FAIpQLSf114xj9QRZdkOyI-coDZ-fjbNfFNhmswAJRmdz5N-h9Zx5MA/viewform?embedded=true" 
          frameborder="0" 
          marginheight="0" 
          marginwidth="0"
          class="absolute inset-0 w-full h-full"
        >
          正在加载…
        </iframe>
      </div>
    </div>
  </main>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>