<script setup lang="ts">
import { Menu, Search, ShoppingBag, X } from 'lucide-vue-next'
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
    <div class="store-container">
      <div class="flex items-center justify-between h-20 gap-4">
        <!-- Mobile Menu Trigger -->
        <button
          type="button"
          @click="mobileMenuOpen = !mobileMenuOpen"
          :aria-expanded="mobileMenuOpen"
          aria-controls="store-mobile-menu"
          :aria-label="mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'"
          class="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
        >
          <X v-if="mobileMenuOpen" :size="20" aria-hidden="true" />
          <Menu v-else :size="20" aria-hidden="true" />
        </button>

        <!-- Store Logo / Brand -->
        <NuxtLink :to="store?.subdomain ? `/?tenant=${store.subdomain}` : '/'" class="flex items-center gap-3 group">
          <div
            v-if="store?.logoUrl"
            class="h-10 w-10 rounded-xl overflow-hidden border border-slate-200"
          >
            <img :src="store.logoUrl" :alt="store.name" class="h-full w-full object-cover" />
          </div>
          <div v-else class="h-10 w-10 rounded-xl bg-emerald-700 text-white font-extrabold flex items-center justify-center text-lg shadow-sm shadow-emerald-700/20 group-hover:scale-105 transition-transform">
            {{ store?.name ? store.name.charAt(0) : 'L' }}
          </div>
          <div class="flex flex-col">
            <span class="font-black text-xl text-slate-900 tracking-tight leading-none group-hover:text-emerald-700 transition-colors">
              {{ store?.name || 'Minha Loja' }}
            </span>
            <span class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
              Loja online
            </span>
          </div>
        </NuxtLink>

        <!-- Search Bar -->
        <div class="hidden md:flex flex-1 max-w-md mx-6">
          <form @submit.prevent="handleSearch" class="relative w-full">
            <label for="store-search" class="sr-only">Buscar produtos</label>
            <input
              id="store-search"
              v-model="searchQuery"
              type="text"
              placeholder="Buscar produtos, coleções, novidades..."
              class="w-full bg-slate-50 hover:bg-white focus:bg-white text-sm text-slate-800 placeholder-slate-400 pl-11 pr-4 py-2.5 rounded-full border border-slate-200 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all shadow-xs"
            />
            <Search :size="17" aria-hidden="true" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </form>
        </div>

        <!-- Right Action Items -->
        <div class="flex items-center gap-3">
          <!-- Cart Button -->
          <button
            type="button"
            @click="isOpen = true"
            :style="{ backgroundColor: store?.accentColor || '#059669' }"
            class="relative flex items-center gap-2 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-transform hover:scale-105 active:scale-95 shadow-md shadow-emerald-600/20"
            aria-label="Abrir carrinho de compras"
          >
            <ShoppingBag :size="18" aria-hidden="true" />
            <span class="hidden sm:inline">Sacola</span>
            <span
              v-if="count > 0"
              aria-live="polite"
              class="flex items-center justify-center bg-white text-emerald-800 text-xs font-black w-5 h-5 rounded-full shadow-xs tabular-nums"
            >
              {{ count }}
            </span>
          </button>
        </div>
      </div>

      <!-- Categories Bar -->
      <nav v-if="categories && categories.length > 0" aria-label="Categorias da loja" class="hidden lg:flex items-center gap-8 py-3 border-t border-slate-100 overflow-x-auto text-sm">
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
    <div v-if="mobileMenuOpen" id="store-mobile-menu" class="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
      <div class="py-2">
        <form @submit.prevent="handleSearch" class="relative">
          <label for="store-mobile-search" class="sr-only">Buscar produtos</label>
          <input
            id="store-mobile-search"
            v-model="searchQuery"
            type="text"
            placeholder="Buscar produtos..."
            class="w-full bg-slate-100 text-sm px-4 py-2.5 rounded-lg border border-slate-200"
          />
        </form>
      </div>
      <nav aria-label="Categorias da loja no celular" class="space-y-1">
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
      </nav>
    </div>
  </header>
</template>
