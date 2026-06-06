<script setup>
import { Motion } from 'motion-v'

const title = '星河环球大学'.split('')
const isLoaded = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    isLoaded.value = true
  })
})
</script>

<template>
  <main
    class="flex-grow flex flex-col items-center justify-center text-center px-4 relative z-10 w-full pt-16 pb-8 md:pt-20 md:pb-10 overflow-hidden"
  >
    <div class="relative z-10 w-full max-w-5xl mx-auto">
      <!-- 微弱背景动态层 -->
      <Motion
        class="absolute inset-0 pointer-events-none"
        :animate="{
          scale: [1, 1.08, 1],
          opacity: [0.2, 0.3, 0.2]
        }"
        :transition="{
          duration: 12,
          repeat: Infinity
        }"
      >
        <div
          class="absolute left-1/2 top-1/2 w-[280px] h-[280px] md:w-[600px] md:h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-[80px] md:blur-[120px]"
        />
      </Motion>

      <!-- 品牌标签 -->
      <div
        class="mb-8 md:mb-10 transition-all duration-700 ease-out"
        :class="isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
      >
        <span
          class="inline-block text-[12px] font-medium tracking-[0.4em] uppercase text-gray-500 border border-white/[0.08] rounded-full px-5 py-1.5"
        >
          Galaxy Global University
        </span>
      </div>

      <!-- 标题逐字 + hover 效果 -->
      <div
        class="inline-block hover:-translate-y-3 hover:scale-[1.02] hover:drop-shadow-[0_10px_20px_rgba(255,255,255,0.2)] transition-all duration-500 ease-out cursor-default mb-6 md:mb-8 group"
        :class="isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
        :style="{ transitionDelay: isLoaded ? '150ms' : '0ms' }"
      >
        <h1
          class="text-[3rem] md:text-[3.5rem] lg:text-[5.8rem] font-bold tracking-[0.1em] group-hover:tracking-[0.15em] transition-all duration-500 mb-4 text-white font-custom"
          style="text-shadow: 0 4px 50px rgba(255, 255, 255, 0.15)"
        >
          <Motion
            v-for="(char, index) in title"
            :key="index"
            tag="span"
            class="inline-block"
            :initial="{
              opacity: 0,
              y: 80,
              rotateX: -90
            }"
            :animate="{
              opacity: 1,
              y: 0,
              rotateX: 0
            }"
            :transition="{
              delay: 0.4 + index * 0.08,
              duration: 0.7,
              type: 'spring'
            }"
          >
            {{ char }}
          </Motion>
        </h1>
      </div>

      <!-- 副标题 -->
      <p
        class="text-base md:text-xl tracking-[0.3em] font-light text-gray-400 uppercase font-custom mb-6 md:mb-8 transition-all duration-700 ease-out"
        :class="isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
        :style="{ transitionDelay: isLoaded ? '300ms' : '0ms' }"
      >
        Galaxy Global University
      </p>

      <!-- 按钮 -->
      <div
        class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-base md:text-lg font-bold tracking-wider transition-all duration-700 ease-out"
        :class="isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
        :style="{ transitionDelay: isLoaded ? '400ms' : '0ms' }"
      >
        <NuxtLink
          to="/joindosc"
          class="group w-full sm:w-auto px-10 py-3.5 bg-white text-black border border-white rounded-md hover:bg-gray-200 hover:border-gray-200 transition-all duration-300 inline-flex items-center justify-center gap-2 text-center cursor-pointer hover:-translate-y-1 hover:scale-105 hover:shadow-[0_10px_30px_rgba(255,255,255,0.2)]"
        >
          <span>申请入学</span>
          <Icon
            name="lucide:arrow-right"
            size="18"
            class="transition-transform duration-300 group-hover:translate-x-1"
          />
        </NuxtLink>
        <NuxtLink
          to="/post/about"
          class="group w-full sm:w-auto px-10 py-3.5 bg-transparent text-white border border-white/30 rounded-md hover:bg-white/10 hover:border-white/50 transition-all duration-300 inline-flex items-center justify-center gap-2 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_10px_30px_rgba(255,255,255,0.15)]"
        >
          <span>关于我们</span>
          <Icon
            name="lucide:sparkles"
            size="18"
            class="transition-transform duration-300 group-hover:rotate-12"
          />
        </NuxtLink>
      </div>

      <!-- QQ 群聊按钮 -->
      <div
        class="mt-6 flex justify-center transition-all duration-700 ease-out"
        :class="isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
        :style="{ transitionDelay: isLoaded ? '500ms' : '0ms' }"
      >
        <a
          href="https://qm.qq.com/q/5WX4p1rqTK"
          target="_blank"
          rel="noopener noreferrer"
          class="qq-btn group inline-flex items-center gap-2 px-5 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_10px_30px_rgba(255,255,255,0.15)]"
        >
          <Icon
            name="simple-icons:tencentqq"
            size="16"
            class="text-purple-400"
          />
          <span class="qq-btn-text">
            立刻加入GGU校友会群聊！
          </span>
        </a>
      </div>
    </div>
  </main>
</template>

<style scoped>
.qq-btn {
  border: 2px solid transparent;
  background:
    linear-gradient(#000, #000) padding-box,
    linear-gradient(90deg, #f43f5e, #a855f7, #3b82f6, #10b981, #f43f5e) border-box;
  background-size: 100% 100%, 300% 100%;
  animation: slide-gradient 5s linear infinite;
}

.qq-btn-text {
  background: linear-gradient(90deg, #f43f5e, #a855f7, #3b82f6, #10b981, #f43f5e);
  background-size: 300% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: slide-gradient 5s linear infinite;
}

@keyframes slide-gradient {
  to {
    background-position: 0 0, -300% 0;
  }
}

</style>
