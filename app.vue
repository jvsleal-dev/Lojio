<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <CartDrawer />
    <FloatingWhatsapp v-if="isStorefront" />
    <StoreSwitcher v-if="!isMasterPage" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const isMasterPage = computed(() => route.path.startsWith('/master'))
const isStorefront = computed(() => {
  if (route.path.startsWith('/admin') || route.path.startsWith('/master') || route.path.startsWith('/checkout')) {
    return false
  }
  // Se for a vitrine de uma loja cliente
  return !!route.query.tenant && route.query.tenant !== 'none' && route.query.tenant !== 'saas'
})
</script>
