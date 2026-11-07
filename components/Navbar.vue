<script setup lang="ts">
import { useCart } from '~/composables/useCart'

const props = defineProps<{
  store?: any
  categories?: any[]
}>()

const route = useRoute()
const { count, isOpen } = useCart()
const mobileMenuOpen = ref(false)
const searchQuery = ref('')

const activeTenant = computed(() => {
  return (route.query.tenant as string) || props.store?.subdomain || ''
})

const getCategoryLink = (catSlug?: string) => {
  const params = new URLSearchParams()
  if (activeTenant.value) params.set('tenant', activeTenant.value)
  if (catSlug) params.set('category', catSlug)
  const qs = params.toString()
  return qs ? `/?${qs}` : '/'
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    const params = new URLSearchParams()
    if (activeTenant.value) params.set('tenant', activeTenant.value)
    params.set('q', searchQuery.value.trim())
    navigateTo(`/?${params.toString()}`)
  }
}
</script>

<template>
  <header class="sticky top-0 z-40 bg-white border-b border-slate-200 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20 gap-4">
        <!-- Mobile Menu Trigger -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="lg:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Store Logo / Brand -->
        <NuxtLink :to="store?.subdomain ? `/?tenant=${store.subdomain}` : '/'" class="flex items-center gap-3 group">
          <div
            v-if="store?.logoUrl"
            class="h-10 w-10 rounded-xl overflow-hidden border border-slate-200"
          >
            <img :src="store.logoUrl" :alt="store.name" class="h-full w-full object-cover" />
          </div>
          <div v-else class="h-10 w-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-lg shadow-md group-hover:scale-105 transition-transform">
            {{ store?.name ? store.name.charAt(0) : 'L' }}
          </div>
          <div class="flex flex-col">
            <span class="font-extrabold text-xl text-slate-900 tracking-tight leading-none group-hover:text-emerald-600 transition-colors">
              {{ store?.name || 'Minha Loja' }}
            </span>
            <span class="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
              Loja Oficial
            </span>
          </div>
        </NuxtLink>

        <!-- Search Bar -->
        <div class="hidden md:flex flex-1 max-w-md mx-6">
          <form @submit.prevent="handleSearch" class="relative w-full">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar produtos, coleções, novidades..."
              class="w-full bg-slate-50 hover:bg-white focus:bg-white text-sm text-slate-800 placeholder-slate-400 pl-11 pr-4 py-2.5 rounded-full border border-slate-200 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all shadow-xs"
            />
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </form>
        </div>

        <!-- Right Action Items -->
        <div class="flex items-center gap-3">
          <!-- Cart Button -->
          <button
            @click="isOpen = true"
            :style="{ backgroundColor: store?.accentColor || '#0f172a' }"
            class="relative flex items-center gap-2 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-transform hover:scale-105 active:scale-95 shadow-md"
            aria-label="Abrir carrinho"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span class="hidden sm:inline">Sacola</span>
            <span
              v-if="count > 0"
              class="flex items-center justify-center bg-white text-slate-900 text-xs font-black w-5 h-5 rounded-full shadow"
            >
              {{ count }}
            </span>
          </button>
        </div>
      </div>

      <!-- Categories Bar -->
      <nav v-if="categories && categories.length > 0" class="hidden lg:flex items-center gap-8 py-3 border-t border-slate-100 overflow-x-auto text-sm">
        <NuxtLink
          :to="getCategoryLink()"
          class="font-semibold text-slate-700 hover:text-emerald-600 transition-colors whitespace-nowrap"
        >
          Todos os Produtos
        </NuxtLink>
        <NuxtLink
          v-for="cat in categories"
          :key="cat.id"
          :to="getCategoryLink(cat.slug)"
          class="font-medium text-slate-600 hover:text-emerald-600 transition-colors whitespace-nowrap"
        >
          {{ cat.name }}
          <span v-if="cat.productsCount" class="text-xs text-slate-400 ml-1">({{ cat.productsCount }})</span>
        </NuxtLink>
      </nav>
    </div>

    <!-- Mobile Drawer Nav -->
    <div v-if="mobileMenuOpen" class="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
      <div class="py-2">
        <form @submit.prevent="handleSearch" class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar produtos..."
            class="w-full bg-slate-100 text-sm px-4 py-2.5 rounded-lg border border-slate-200"
          />
        </form>
      </div>
      <div class="space-y-1">
        <NuxtLink
          :to="getCategoryLink()"
          @click="mobileMenuOpen = false"
          class="block py-2 text-sm font-semibold text-slate-800"
        >
          Todos os Produtos
        </NuxtLink>
        <NuxtLink
          v-for="cat in categories"
          :key="cat.id"
          :to="getCategoryLink(cat.slug)"
          @click="mobileMenuOpen = false"
          class="block py-2 text-sm font-medium text-slate-600"
        >
          {{ cat.name }}
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
