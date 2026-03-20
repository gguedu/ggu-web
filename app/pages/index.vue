<template>
  <main class="flex-grow flex flex-col items-center justify-center text-center px-4 relative z-10 w-full pt-20 pb-10">
    <!-- Center Text -->
    <div class="relative z-10 w-full max-w-4xl mx-auto">
      <h1 class="text-5xl md:text-6xl lg:text-[6rem] font-bold tracking-[0.1em] mb-4 text-white font-custom" style="text-shadow: 0 4px 50px rgba(255,255,255,0.15);">
        星河环球大学
      </h1>
      <p class="text-base md:text-xl tracking-[0.3em] font-light text-gray-400 uppercase mb-16 md:mb-20 font-custom">
        Galaxy Global University
      </p>
      
      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-base md:text-lg font-bold tracking-wider">
        <NuxtLink to="/joindosc" class="w-full sm:w-auto px-10 py-3.5 bg-white text-black border border-white rounded-md hover:bg-gray-200 hover:border-gray-200 transition-all duration-300 inline-block text-center cursor-pointer">
          申请入学
        </NuxtLink>
        <button class="w-full sm:w-auto px-10 py-3.5 bg-transparent text-white border border-white rounded-md hover:bg-white/10 transition-all duration-300">
          学术研究
        </button>
        <button class="w-full sm:w-auto px-10 py-3.5 bg-transparent text-white border border-white rounded-md hover:bg-white/10 transition-all duration-300">
          校园生活
        </button>
      </div>
    </div>
  </main>
</template>