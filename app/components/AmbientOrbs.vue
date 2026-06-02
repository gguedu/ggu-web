<script setup>
const mouse = reactive({ x: 0, y: 0 });

function onMouseMove(e) {
  mouse.x = e.clientX / window.innerWidth - 0.5;
  mouse.y = e.clientY / window.innerHeight - 0.5;
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove);
});
</script>

<template>
  <div class="pointer-events-none fixed inset-0 overflow-hidden z-[1]">
    <div
      class="absolute -right-20 -top-32 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12),rgba(0,0,0,0))] transition-transform duration-700 ease-out md:-right-40 md:-top-48 md:h-[520px] md:w-[520px]"
      :style="{ transform: `translate(${mouse.x * -20}px, ${mouse.y * -20}px)` }"
    />
    <div
      class="absolute -left-20 top-40 h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle,rgba(0,148,255,0.18),rgba(0,0,0,0))] transition-transform duration-700 ease-out md:left-10 md:top-20 md:h-[420px] md:w-[420px]"
      :style="{ transform: `translate(${mouse.x * 15}px, ${mouse.y * 15}px)` }"
    />
  </div>
</template>
