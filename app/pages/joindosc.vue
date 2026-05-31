<script setup>
const iframeLoaded = ref(false)
</script>

<template>
  <main class="flex-1 w-full relative overflow-hidden z-10 bg-black">
    <!-- Loading -->
    <div
      v-if="!iframeLoaded"
      class="absolute inset-0 flex items-center justify-center z-10 bg-black"
    >
      <div class="flex flex-col items-center gap-3">
        <div class="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <span class="text-sm text-gray-500">正在加载...</span>
      </div>
    </div>

    <iframe
      src="https://minform.io/f/P0A_l-N"
      class="absolute inset-0 w-full h-full border-0"
      @load="iframeLoaded = true"
    />
  </main>
</template>
