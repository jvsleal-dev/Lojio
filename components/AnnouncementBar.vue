<script setup lang="ts">
import { X } from 'lucide-vue-next'

defineProps<{
  text?: string
  bg?: string
}>()

const isVisible = ref(true)
</script>

<template>
  <div
    v-if="isVisible && text"
    :style="{ backgroundColor: bg || '#0f172a' }"
    class="text-white text-xs md:text-sm font-medium py-2.5 px-4 text-center relative transition-all"
  >
    <div class="max-w-7xl mx-auto flex items-center justify-center gap-2">
      <span>{{ text }}</span>
    </div>
    <button
      @click="isVisible = false"
      type="button"
      class="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      aria-label="Fechar aviso"
    >
      <X :size="16" aria-hidden="true" />
    </button>
  </div>
</template>
