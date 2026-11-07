<script setup lang="ts">
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
      class="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
      aria-label="Fechar aviso"
    >
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>
