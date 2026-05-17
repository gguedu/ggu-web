<script setup>
const mouse = reactive({ x: 0, y: 0 });

function onMouseMove(e) {
  mouse.x = (e.clientX / window.innerWidth) - 0.5;
  mouse.y = (e.clientY / window.innerHeight) - 0.5;
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove);
});
</script>

<template>
  <div
    class="pointer-events-none fixed inset-0 overflow-hidden z-[1]"
  >
    <div
      class="absolute -right-40 -top-48 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12),rgba(0,0,0,0))] transition-transform duration-700 ease-out"
      :style="{ transform: `translate(${mouse.x * -30}px, ${mouse.y * -30}px)` }"
    />
    <div
      class="absolute left-10 top-20 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(0,148,255,0.18),rgba(0,0,0,0))] transition-transform duration-700 ease-out"
      :style="{ transform: `translate(${mouse.x * 20}px, ${mouse.y * 20}px)` }"
    />
    <div
      class="absolute bottom-0 right-0 h-[420px] w-[420px] bg-[radial-gradient(circle,rgba(0,0,0,0),rgba(0,0,0,0.85))]"
    />
  </div>
</template>
