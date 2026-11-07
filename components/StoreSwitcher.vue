<template>
  <div class="fixed bottom-4 left-4 z-50">
    <!-- Trigger Button -->
    <button
      @click="isOpen = !isOpen"
      class="flex items-center space-x-2.5 px-4 py-2.5 rounded-full bg-white/95 hover:bg-white text-slate-800 border border-slate-200/90 shadow-xl backdrop-blur-md transition-all duration-200 group hover:border-blue-400 hover:shadow-blue-500/10 cursor-pointer"
      title="Alternar entre Lojas de Clientes e Painéis"
    >
      <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
      <div class="text-left text-xs">
        <span class="text-[9px] uppercase font-bold text-slate-400 block -mb-0.5 tracking-wider">Loja Ativa</span>
        <span class="font-extrabold text-slate-900 group-hover:text-blue-600 transition">
          {{ currentStoreName }}
        </span>
      </div>
      <svg
        class="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="transform scale-95 opacity-0 translate-y-2"
      enter-to-class="transform scale-100 opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform scale-100 opacity-100 translate-y-0"
      leave-to-class="transform scale-95 opacity-0 translate-y-2"
    >
      <div
        v-if="isOpen"
        class="absolute bottom-14 left-0 w-80 bg-white border border-slate-200 rounded-3xl shadow-2xl p-4 text-slate-800 overflow-hidden"
      >
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div>
            <p class="text-xs font-black text-slate-900 uppercase tracking-wider">Alternador de Lojas Lojio</p>
            <p class="text-[11px] text-slate-500">Navegue pelas lojas clientes em tempo real</p>
          </div>
          <button @click="isOpen = false" class="text-slate-400 hover:text-slate-700 text-xl leading-none">&times;</button>
        </div>

        <!-- Client Stores List -->
        <p class="text-[10px] uppercase font-bold text-blue-600 tracking-wider mb-2">Lojas Demonstrativas</p>
        <div class="space-y-1.5 max-h-52 overflow-y-auto pr-1">
          <button
            v-for="store in stores"
            :key="store.id"
            @click="switchStore(store.subdomain)"
            class="w-full flex items-center justify-between p-2.5 rounded-xl transition text-left group"
            :class="isCurrent(store.subdomain) ? 'bg-blue-50 border border-blue-200 text-blue-900' : 'hover:bg-slate-50 text-slate-700'"
          >
            <div class="flex items-center space-x-2.5 overflow-hidden">
              <div
                class="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs text-white shrink-0 shadow-xs"
                :style="{ backgroundColor: store.accentColor || '#2563eb' }"
              >
                {{ store.name.slice(0, 1).toUpperCase() }}
              </div>
              <div class="overflow-hidden">
                <p class="text-xs font-bold truncate group-hover:text-blue-600">{{ store.name }}</p>
                <p class="text-[10px] text-slate-400 font-mono">{{ store.subdomain }}.lojio.com.br</p>
              </div>
            </div>

            <span
              v-if="isCurrent(store.subdomain)"
              class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white shrink-0 shadow-xs"
            >
              Ativa
            </span>
          </button>
        </div>

        <!-- Fast Links Section -->
        <div class="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
          <NuxtLink
            to="/admin"
            class="flex items-center space-x-2.5 p-2 rounded-xl text-xs font-bold text-blue-700 hover:bg-blue-50 border border-blue-100 transition"
          >
            <svg class="w-4 h-4 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>Painel do Lojista (/admin)</span>
          </NuxtLink>

          <NuxtLink
            to="/master"
            class="flex items-center space-x-2.5 p-2 rounded-xl text-xs font-bold text-indigo-700 hover:bg-indigo-50 border border-indigo-100 transition"
          >
            <svg class="w-4 h-4 text-indigo-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Console Master SaaS (/master)</span>
          </NuxtLink>

          <NuxtLink
            to="/?tenant=none"
            class="flex items-center space-x-2.5 p-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 border border-slate-100 transition"
          >
            <svg class="w-4 h-4 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <span>Landing Page Oficial Lojio</span>
          </NuxtLink>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)
const stores = ref<any[]>([])
const route = useRoute()

const currentSubdomain = computed(() => {
  if (route.query.tenant) return String(route.query.tenant)
  if (process.client) {
    const match = document.cookie.match(/selected_tenant=([^;]+)/)
    if (match) return match[1]
  }
  return 'moda-urbana'
})

const currentStoreName = computed(() => {
  const found = stores.value.find(s => s.subdomain === currentSubdomain.value)
  return found ? found.name : 'Moda Urbana'
})

const isCurrent = (subdomain: string) => {
  return currentSubdomain.value === subdomain
}

const switchStore = (subdomain: string) => {
  isOpen.value = false
  if (process.client) {
    document.cookie = `selected_tenant=${subdomain}; path=/; max-age=2592000`
    window.location.href = `/?tenant=${subdomain}`
  }
}

const loadStores = async () => {
  try {
    const res: any = await $fetch('/api/public/stores')
    stores.value = res.stores || []
  } catch {
    // fallback
  }
}

onMounted(() => {
  loadStores()
})
</script>
