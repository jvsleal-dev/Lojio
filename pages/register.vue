<script setup lang="ts">
// Redireciona /register diretamente para o fluxo de cadastro de lojista
await navigateTo('/admin/register', { replace: true })
</script>

<template>
  <div class="min-h-screen bg-[#f7f8f5] flex items-center justify-center p-4">
    <div class="text-center space-y-2">
      <div class="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin mx-auto"></div>
      <p class="text-xs font-bold text-slate-600">Redirecionando para o cadastro...</p>
    </div>
  </div>
</template>
