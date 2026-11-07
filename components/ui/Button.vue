<script setup lang="ts">
import { cn } from '~/lib/utils'

interface Props {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  as?: string
  class?: string
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  as: 'button',
  disabled: false,
  loading: false,
})

const variantClasses = {
  default: 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm active:scale-[0.99]',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 shadow-xs active:scale-[0.99]',
  destructive: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm active:scale-[0.99]',
  outline: 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-xs active:scale-[0.99]',
  ghost: 'hover:bg-slate-100 text-slate-700 active:scale-[0.99]',
  link: 'text-emerald-700 underline-offset-4 hover:underline p-0 h-auto',
}

const sizeClasses = {
  default: 'h-11 px-5 py-2.5 text-sm',
  sm: 'h-9 px-3.5 text-xs',
  lg: 'h-13 px-8 text-base font-bold',
  icon: 'h-10 w-10 p-0 flex items-center justify-center',
}
</script>

<template>
  <component
    :is="as"
    :disabled="disabled || loading"
    :class="cn(
      'inline-flex items-center justify-center gap-2 font-bold tracking-tight rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
      variantClasses[variant],
      sizeClasses[size],
      props.class
    )"
  >
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <slot />
  </component>
</template>

