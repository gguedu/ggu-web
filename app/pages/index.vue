<script setup>
import { Motion } from 'motion-v';

const title = '星河环球大学'.split('');
</script>

<template>
  <main
    class="flex-grow flex flex-col items-center justify-center text-center px-4 relative z-10 w-full pt-16 pb-8 md:pt-20 md:pb-10 overflow-hidden"
  >
    <div class="relative z-10 w-full max-w-5xl">
      <!-- 微弱背景动态层 -->
      <Motion
        class="absolute inset-0 pointer-events-none"
        :animate="{
          scale: [1, 1.08, 1],
          opacity: [0.2, 0.3, 0.2],
        }"
        :transition="{
          duration: 12,
          repeat: Infinity,
        }"
      >
        <div
          class="absolute left-1/2 top-1/2 w-[280px] h-[280px] md:w-[600px] md:h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-[80px] md:blur-[120px]"
        />
      </Motion>

      <!-- Hero主体 -->

      <!-- 品牌标签 -->
      <Motion
        :initial="{
          opacity: 0,
          width: 0,
        }"
        :animate="{
          opacity: 1,
          width: 'fit-content',
        }"
        :transition="{
          duration: 0.8,
        }"
        class="overflow-hidden mx-auto mb-6 md:mb-10"
      >
        <span
          class="inline-block whitespace-nowrap text-[10px] md:text-[12px] tracking-[0.3em] md:tracking-[0.4em] uppercase border border-white/[0.08] rounded-full px-4 py-1.5 md:px-5 md:py-2 text-gray-400"
        >
          Galaxy Global University
        </span>
      </Motion>

      <!-- 标题逐字 -->
      <div class="mb-5 md:mb-8">
        <h1
          class="text-[3rem] md:text-[4rem] lg:text-[6rem] font-bold text-white tracking-[.12em] font-custom"
        >
          <Motion
            v-for="(char, index) in title"
            :key="index"
            tag="span"
            class="inline-block"
            :initial="{
              opacity: 0,
              y: 80,
              rotateX: -90,
            }"
            :animate="{
              opacity: 1,
              y: 0,
              rotateX: 0,
            }"
            :transition="{
              delay: 0.4 + index * 0.08,
              duration: 0.7,
              type: 'spring',
            }"
          >
            {{ char }}
          </Motion>
        </h1>
      </div>

      <!-- 副标题 -->
      <Motion
        :initial="{
          opacity: 0,
          filter: 'blur(20px)',
        }"
        :animate="{
          opacity: 1,
          filter: 'blur(0px)',
        }"
        :transition="{
          delay: 1.1,
        }"
      >
        <p
          class="text-sm md:text-xl tracking-[0.2em] md:tracking-[0.35em] text-gray-400 uppercase mb-6 md:mb-10"
        >
          Galaxy Global University
        </p>
      </Motion>

      <!-- CTA -->
      <Motion
        class="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :transition="{
          delay: 1.3,
          staggerChildren: 0.15,
        }"
      >
        <Motion
          class="w-full sm:w-auto"
          :initial="{
            y: 50,
            opacity: 0,
          }"
          :animate="{
            y: 0,
            opacity: 1,
          }"
          while-hover="hover"
          while-tap="{scale:.97}"
          :variants="{
            hover: {
              y: -6,
            },
          }"
        >
          <NuxtLink
            to="/joindosc"
            class="group block w-full sm:w-auto text-center px-8 py-3 md:px-10 md:py-4 rounded-xl bg-white text-black relative overflow-hidden"
          >
            <Motion
              class="absolute inset-0 bg-black/5"
              :initial="{ x: '-100%' }"
              while-hover="{x:'100%'}"
              :transition="{ duration: 0.8 }"
            />

            <span class="relative z-10"> 申请入学 </span>
          </NuxtLink>
        </Motion>

        <Motion
          class="w-full sm:w-auto"
          :initial="{
            y: 50,
            opacity: 0,
          }"
          :animate="{
            y: 0,
            opacity: 1,
          }"
          while-hover="hover"
          while-tap="{scale:.97}"
          :variants="{
            hover: {
              y: -6,
            },
          }"
        >
          <NuxtLink
            to="/post"
            class="block w-full sm:w-auto text-center px-8 py-3 md:px-10 md:py-4 rounded-xl border border-white/20 bg-white/[0.02] backdrop-blur-md"
          >
            星河文库
          </NuxtLink>
        </Motion>
      </Motion>
    </div>
  </main>
</template>
