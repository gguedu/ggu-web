<script setup lang="ts">
import * as pdfjsLib from 'pdfjs-dist'

interface Props {
  src: string
  initialScale?: number
  workerSrc?: string
}

const props = withDefaults(defineProps<Props>(), {
  initialScale: 1.5,
  workerSrc: 'https://oss1.236668.xyz/pdf.worker.min.mjs',
})

pdfjsLib.GlobalWorkerOptions.workerSrc = props.workerSrc

const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const pageNum = ref(1)
const totalPages = ref(0)
const scale = ref(props.initialScale)
let pdfDoc: pdfjsLib.PDFDocumentProxy | null = null

async function renderPage(num: number) {
  if (!pdfDoc || !canvasRef.value) return

  const page = await pdfDoc.getPage(num)
  const viewport = page.getViewport({ scale: scale.value })
  const canvas = canvasRef.value

  canvas.height = viewport.height
  canvas.width = viewport.width

  await page.render({ canvas, viewport }).promise
}

async function loadPdf() {
  try {
    loading.value = true
    error.value = null
    pdfDoc = await pdfjsLib.getDocument(props.src).promise
    totalPages.value = pdfDoc.numPages
    pageNum.value = 1
    await renderPage(1)
  } catch (e: any) {
    error.value = e.message || 'Failed to load PDF'
  } finally {
    loading.value = false
  }
}

async function goToPage(num: number) {
  if (num < 1 || num > totalPages.value) return
  pageNum.value = num
  await renderPage(num)
}

async function zoomIn() {
  scale.value = Math.min(scale.value + 0.25, 4)
  await renderPage(pageNum.value)
}

async function zoomOut() {
  scale.value = Math.max(scale.value - 0.25, 0.5)
  await renderPage(pageNum.value)
}

function download() {
  const a = document.createElement('a')
  a.href = props.src
  a.download = props.src.split('/').pop() || 'document.pdf'
  a.click()
}

onMounted(loadPdf)

watch(() => props.src, loadPdf)
</script>

<template>
  <div ref="containerRef" class="pdf-viewer">
    <!-- 工具栏 -->
    <div class="flex items-center justify-between gap-3 border-b border-(--ui-border) px-4 py-2">
      <div class="flex items-center gap-2">
        <UButton
          icon="i-lucide-chevron-left"
          variant="ghost"
          color="neutral"
          size="sm"
          :disabled="pageNum <= 1"
          @click="goToPage(pageNum - 1)"
        />
        <span class="text-sm tabular-nums">
          <input
            v-model.number="pageNum"
            type="number"
            :min="1"
            :max="totalPages"
            class="w-10 rounded border border-(--ui-border) bg-transparent px-1 text-center text-sm"
            @change="goToPage(pageNum)"
          />
          / {{ totalPages }}
        </span>
        <UButton
          icon="i-lucide-chevron-right"
          variant="ghost"
          color="neutral"
          size="sm"
          :disabled="pageNum >= totalPages"
          @click="goToPage(pageNum + 1)"
        />
      </div>

      <div class="flex items-center gap-1">
        <UButton
          icon="i-lucide-minus"
          variant="ghost"
          color="neutral"
          size="sm"
          @click="zoomOut"
        />
        <span class="min-w-12 text-center text-sm tabular-nums">{{ Math.round(scale * 100) }}%</span>
        <UButton
          icon="i-lucide-plus"
          variant="ghost"
          color="neutral"
          size="sm"
          @click="zoomIn"
        />
        <div class="mx-1 h-4 w-px bg-(--ui-border)" />
        <UButton
          icon="i-lucide-download"
          variant="ghost"
          color="neutral"
          size="sm"
          @click="download"
        />
      </div>
    </div>

    <!-- 渲染区域 -->
    <div class="overflow-auto bg-gray-50 dark:bg-gray-900">
      <div v-if="loading" class="flex items-center justify-center py-20">
        <UIcon name="i-lucide-loader-2" class="size-8 animate-spin text-(--ui-text-muted)" />
      </div>

      <div v-else-if="error" class="flex flex-col items-center justify-center gap-2 py-20 text-(--ui-text-muted)">
        <UIcon name="i-lucide-file-warning" class="size-8" />
        <span class="text-sm">{{ error }}</span>
      </div>

      <canvas
        v-show="!loading && !error"
        ref="canvasRef"
        class="mx-auto block"
      />
    </div>
  </div>
</template>

<style scoped>
.pdf-viewer {
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius);
  overflow: hidden;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
