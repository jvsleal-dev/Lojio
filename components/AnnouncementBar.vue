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
    :style="{ backgroundColor: '#123d2b' }"
    class="text-white text-xs md:text-sm font-medium py-2.5 px-4 text-center relative transition-all"
  >
    <div class="max-w-7xl mx-auto flex items-center justify-center gap-2">
      <span>{{ text }}</span>
    </div>
    <button
      @click="isVisible = false"
      class="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-xs p-1"
      aria-label="Fechar aviso"
    >
      ✕
    </button>
  </div>
</template>
