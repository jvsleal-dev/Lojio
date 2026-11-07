<script setup lang="ts">
import { useCart } from '~/composables/useCart'

const route = useRoute()
const { isOpen } = useCart()

onMounted(() => {
  isOpen.value = true
  const tenantParam = route.query.tenant ? `?tenant=${route.query.tenant}` : ''
  navigateTo(`/${tenantParam}`)
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50">
    <div class="flex items-center gap-3 text-slate-600">
      <div class="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-sm font-semibold">Carregando sacola de compras...</p>
    </div>
  </div>
</template>

