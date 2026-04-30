<template>
  <main class="flex-grow flex flex-col items-center justify-center text-center px-4 relative z-10 w-full pt-20 pb-10">
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute -right-40 -top-48 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12),rgba(0,0,0,0))]" />
      <div class="absolute left-10 top-20 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(0,148,255,0.18),rgba(0,0,0,0))]" />
      <div class="absolute bottom-0 right-0 h-[420px] w-[420px] bg-[radial-gradient(circle,rgba(0,0,0,0),rgba(0,0,0,0.85))]" />
    </div>

    <!-- Center Text -->
    <div class="relative z-10 w-full max-w-4xl mx-auto">
      <div class="inline-block hover:-translate-y-3 hover:scale-[1.02] hover:drop-shadow-[0_10px_20px_rgba(255,255,255,0.2)] transition-all duration-500 ease-out cursor-default mb-16 md:mb-20 group">
        <h1 class="text-[3rem] md:text-[3.5rem] lg:text-[5.8rem] font-bold tracking-[0.1em] group-hover:tracking-[0.15em] transition-all duration-500 mb-4 text-white font-custom" style="text-shadow: 0 4px 50px rgba(255,255,255,0.15);">
          星河环球大学
        </h1>
        <p class="text-base md:text-xl tracking-[0.3em] font-light text-gray-400 uppercase font-custom">
          Galaxy Global University
        </p>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-base md:text-lg font-bold tracking-wider">
        <NuxtLink to="/joindosc" class="w-full sm:w-auto px-10 py-3.5 bg-white text-black border border-white rounded-md hover:bg-gray-200 hover:border-gray-200 transition-all duration-300 inline-block text-center cursor-pointer hover:-translate-y-1 hover:scale-105 hover:shadow-[0_10px_30px_rgba(255,255,255,0.2)]">
          申请入学
        </NuxtLink>
        <button class="w-full sm:w-auto px-10 py-3.5 bg-transparent text-white border border-white rounded-md hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_10px_30px_rgba(255,255,255,0.15)]">
          关于我们
        </button>
      </div>
    </div>
  </main>
</template>