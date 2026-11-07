<script setup lang="ts">
import { cn } from '~/lib/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <div
    :class="cn(
      'rounded-2xl border border-slate-200/90 bg-white text-slate-900 shadow-sm transition-all duration-200',
      props.class
    )"
  >
    <slot />
  </div>
</template>

