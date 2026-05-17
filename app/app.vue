<script setup>
const route = useRoute();
const isJoinDoscRoute = computed(() => route.path === '/joindosc');
const isPostIndex = computed(() => route.path === '/post');
const isMailRoute = computed(() => route.path.startsWith('/mail'));
const isFullView = computed(() => isJoinDoscRoute.value || isPostIndex.value || isMailRoute.value);
const bodyClass = computed(() => (isPostIndex.value ? 'no-scroll' : ''));

const navItems = [
  { label: '首页', to: '/', match: '/' },
  { label: '星河文库', to: '/post', match: '/post' },
  { label: '线上申请', to: '/joindosc', match: '/joindosc' },
  { label: '通行证', to: '/mail', match: '/mail' },
];

const activeIndex = computed(() => {
  const path = route.path;
  if (path === '/') return 0;
  if (path.startsWith('/post')) return 1;
  if (path.startsWith('/joindosc')) return 2;
  if (path.startsWith('/mail')) return 3;
  return -1;
});

const navRef = ref(null);
const headerRef = ref(null);

const indicatorLeft = ref(0);
const indicatorWidth = ref(0);
const indicatorVisible = ref(false);

// Track hover state for the entire nav
const isNavHovered = ref(false);
// Track which item is being hovered (-1 = none)
const hoveredIndex = ref(-1);

// The "target" index the indicator is showing: hover takes priority, then active
const targetIndex = computed(() => {
  if (hoveredIndex.value >= 0) return hoveredIndex.value;
  return activeIndex.value;
});

// Whether the indicator is on an active (selected) item or a hover item
const isOnActive = computed(() => targetIndex.value === activeIndex.value);

function updateIndicator() {
  const idx = targetIndex.value;
  const navEl = navRef.value;
  if (idx < 0 || !navEl) {
    indicatorVisible.value = false;
    return;
  }
  const links = navEl.querySelectorAll('a[href]');
  const itemEl = links[idx];
  if (!itemEl) {
    indicatorVisible.value = false;
    return;
  }
  indicatorLeft.value = itemEl.offsetLeft;
  indicatorWidth.value = itemEl.offsetWidth;
  indicatorVisible.value = true;
}

function onNavItemHover(index) {
  hoveredIndex.value = index;
  nextTick(updateIndicator);
}

function onNavItemLeave() {
  hoveredIndex.value = -1;
  nextTick(updateIndicator);
}

function onNavEnter() {
  isNavHovered.value = true;
  startIndicatorTracking();
}

function onNavLeave() {
  isNavHovered.value = false;
  hoveredIndex.value = -1;
  startIndicatorTracking();
}

let resizeObserver = null;
let paddingRafId = null;

function startIndicatorTracking() {
  cancelAnimationFrame(paddingRafId);
  const run = () => {
    updateIndicator();
    paddingRafId = requestAnimationFrame(run);
  };
  paddingRafId = requestAnimationFrame(run);
}

function stopIndicatorTracking() {
  cancelAnimationFrame(paddingRafId);
  paddingRafId = null;
  updateIndicator();
}

function onNavTransitionEnd(e) {
  // Stop rAF loop once the padding transition finishes
  if (e.propertyName === 'padding-left' || e.propertyName === 'padding-right') {
    stopIndicatorTracking();
  }
}

onMounted(() => {
  nextTick(updateIndicator);
  resizeObserver = new ResizeObserver(updateIndicator);
  if (navRef.value) {
    resizeObserver.observe(navRef.value);
    navRef.value.addEventListener('transitionend', onNavTransitionEnd);
  }
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  if (navRef.value) navRef.value.removeEventListener('transitionend', onNavTransitionEnd);
  stopIndicatorTracking();
});

watch(
  () => route.path,
  () => {
    nextTick(updateIndicator);
  },
);

watch(targetIndex, () => {
  nextTick(updateIndicator);
});

useHead({
  title: '星河环球大学 - Galaxy Global University',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: 'Galaxy Global University Official Website' },
  ],
  link: [
    { rel: 'stylesheet', href: 'https://oss1.236668.xyz/fonts/vivosans.css' },
    { rel: 'stylesheet', href: 'https://oss1.236668.xyz/fonts/lxgw/LXGWWenKai-Regular/result.css' },
    { rel: 'stylesheet', href: 'https://oss1.236668.xyz/fonts/lxgw/LXGWWenKai-Light/result.css' },
    { rel: 'stylesheet', href: 'https://oss1.236668.xyz/fonts/lxgw/LXGWWenKai-Medium/result.css' },
  ],
  script: [
    {
      src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4889390799936204',
      async: true,
      crossorigin: 'anonymous',
      tagPosition: 'bodyClose',
    },
    {
      src: 'https://oss1.236668.xyz/cursor.js',
      defer: true,
      tagPosition: 'bodyClose',
    },
  ],
  htmlAttrs: {
    lang: 'zh',
  },
  bodyAttrs: {
    class: bodyClass,
  },
});
</script>

<template>
  <div
    :class="[
      'bg-black text-white flex flex-col font-sans selection:bg-gray-800 relative overflow-hidden',
      isFullView ? 'h-screen' : 'min-h-screen',
    ]"
  >
    <!-- Global ambient light orbs -->
    <AmbientOrbs />

    <!-- Header -->
    <header
      v-if="!isMailRoute"
      id="global-site-header"
      class="pointer-events-none fixed left-0 right-0 top-5 z-30 flex justify-center px-4"
    >
      <nav
        ref="navRef"
        class="pointer-events-auto relative flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-white/[0.08] bg-black/60 px-2 py-2 text-sm font-medium text-gray-300 shadow-[0_8px_40px_rgba(0,0,0,0.4)] backdrop-blur-2xl md:gap-2 md:px-3 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
        :style="{
          paddingLeft: isNavHovered ? '1.25rem' : undefined,
          paddingRight: isNavHovered ? '1.25rem' : undefined,
        }"
        @mouseenter="onNavEnter"
        @mouseleave="onNavLeave"
      >
        <!-- Sliding pill indicator -->
        <div
          class="absolute top-2 bottom-2 rounded-full transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
          :style="{
            left: indicatorLeft + 'px',
            width: indicatorWidth + 'px',
            opacity: indicatorVisible ? 1 : 0,
            background: isOnActive ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
            transform: isOnActive && hoveredIndex === activeIndex ? 'scaleY(1.15)' : 'scaleY(1)',
          }"
        />

        <NuxtLink
          v-for="(item, i) in navItems"
          :key="item.to"
          :to="item.to"
          class="relative z-10 shrink-0 rounded-full px-4 py-2 transition-colors duration-300"
          :class="
            activeIndex === i && hoveredIndex === -1
              ? 'text-white font-semibold'
              : activeIndex === i
                ? 'text-white font-semibold'
                : 'text-gray-300 hover:text-white'
          "
          @mouseenter="onNavItemHover(i)"
          @mouseleave="onNavItemLeave"
          >{{ item.label }}</NuxtLink
        >
      </nav>
    </header>

    <NuxtPage />

    <!-- Footer -->
    <footer
      v-if="!isFullView"
      id="global-site-footer"
      class="w-full py-8 text-center text-xs md:text-sm text-gray-600 border-t border-gray-900 mt-auto z-20 relative bg-black/80"
    >
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
.font-custom {
  font-family: 'LXGW WenKai', sans-serif;
}

body {
  margin: 0;
  padding: 0;
  background-color: black;
  font-family: 'vivo Sans', sans-serif;
}
</style>
