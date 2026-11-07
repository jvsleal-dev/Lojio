<script setup lang="ts">
import { cn } from '~/lib/utils'

interface Props {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const variantClasses = {
  default: 'border-transparent bg-slate-900 text-white',
  secondary: 'border-transparent bg-slate-100 text-slate-800',
  outline: 'text-slate-800 border-slate-200 bg-white',
  destructive: 'border-transparent bg-rose-50 text-rose-700 border border-rose-200/80',
  success: 'border-transparent bg-emerald-50 text-emerald-700 border border-emerald-200/80',
  warning: 'border-transparent bg-amber-50 text-amber-800 border border-amber-200/80',
}
</script>

<template>
  <div
    :class="cn(
      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-tight transition-colors',
      variantClasses[variant],
      props.class
    )"
  >
    <slot />
  </div>
</template>

