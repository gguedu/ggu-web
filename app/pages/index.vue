<script setup>
const isLoaded = ref(false);

onMounted(() => {
  requestAnimationFrame(() => {
    isLoaded.value = true;
  });
});
</script>

<template>
  <main
    class="flex-grow flex flex-col items-center justify-center text-center px-4 relative z-10 w-full pt-20 pb-10"
  >
    <!-- Center Text -->
    <div class="relative z-10 w-full max-w-4xl mx-auto">
      <!-- Eyebrow -->
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

      <!-- Hero Title -->
      <div
        class="inline-block hover:-translate-y-3 hover:scale-[1.02] hover:drop-shadow-[0_10px_20px_rgba(255,255,255,0.2)] transition-all duration-500 ease-out cursor-default mb-6 md:mb-8 group"
        :class="isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
        :style="{ transitionDelay: isLoaded ? '150ms' : '0ms' }"
      >
        <h1
          class="text-[3rem] md:text-[3.5rem] lg:text-[5.8rem] font-bold tracking-[0.1em] group-hover:tracking-[0.15em] transition-all duration-500 mb-4 text-white font-custom"
          style="text-shadow: 0 4px 50px rgba(255, 255, 255, 0.15)"
        >
          星河环球大学
        </h1>
      </div>

      <!-- Subtitle -->
      <p
        class="text-base md:text-xl tracking-[0.3em] font-light text-gray-400 uppercase font-custom mb-6 md:mb-8 transition-all duration-700 ease-out"
        :class="isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
        :style="{ transitionDelay: isLoaded ? '300ms' : '0ms' }"
      >
        Galaxy Global University
      </p>

      <!-- Action Buttons -->
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
          to="/post"
          class="group w-full sm:w-auto px-10 py-3.5 bg-transparent text-white border border-white/30 rounded-md hover:bg-white/10 hover:border-white/50 transition-all duration-300 inline-flex items-center justify-center gap-2 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_10px_30px_rgba(255,255,255,0.15)]"
        >
          <span>星河文库</span>
          <Icon
            name="lucide:book-open"
            size="18"
            class="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </NuxtLink>
      </div>
    </div>
  </main>
</template>
