<script setup lang="ts">
import { useCart } from '~/composables/useCart'

const { addItem } = useCart()
const route = useRoute()

// Fetch public store data and categories
const { data: storeData, error: storeError } = await useFetch('/api/store/info')
const { data: catData } = await useFetch('/api/store/categories')
const { data: publicStoresData } = await useFetch('/api/public/stores')

// Active filters
const currentCategory = computed(() => route.query.category as string || '')
const searchQuery = computed(() => route.query.q as string || '')

// Fetch products based on category/search
const { data: productsData, refresh: refreshProducts } = await useFetch(() => {
  let url = '/api/store/products'
  const params: string[] = []
  if (currentCategory.value) params.push(`category=${currentCategory.value}`)
  if (searchQuery.value) params.push(`q=${encodeURIComponent(searchQuery.value)}`)
  return params.length ? `${url}?${params.join('&')}` : url
})

watch(() => route.query, () => {
  refreshProducts()
})

const store = computed(() => storeData.value?.store)
const isPlatform = computed(() => !store.value || route.query.tenant === 'none' || route.query.tenant === 'saas')
const categories = computed(() => catData.value?.categories || [])
const products = computed(() => productsData.value?.products || [])
const allStores = computed(() => publicStoresData.value?.stores || [])
const isSuspended = computed(() => storeError.value?.statusCode === 403)

useHead({
  title: computed(() => store.value ? `${store.value.name} | Loja Oficial` : 'Lojio - Crie sua Loja Virtual Profissional'),
  meta: [
    { name: 'description', content: computed(() => store.value?.description || 'Crie sua loja virtual com a Lojio, a base para sua marca vender mais no site e no WhatsApp.') }
  ]
})

const quickAddToCart = (product: any) => {
  addItem({
    productId: product.id,
    variantId: product.variants?.[0]?.id || null,
    name: product.name,
    variantName: product.variants?.[0]?.name || null,
    price: product.price,
    quantity: 1,
    imageUrl: product.coverImage,
  })
}
</script>

<template>
  <div>
    <!-- When no tenant is selected, show the Lojio landing page -->
    <SaasLanding v-if="isPlatform" />

    <!-- When a client tenant is selected, show that Client's Storefront -->
    <div v-else class="min-h-screen flex flex-col bg-slate-50 selection:bg-blue-600 selection:text-white">
      <!-- Store Suspended Alert -->
      <div v-if="isSuspended" class="bg-rose-500 text-white text-xs font-bold py-3 px-4 text-center flex items-center justify-center space-x-2 shadow-md">
        <span>⚠️ Esta loja está temporariamente suspensa pelo administrador da plataforma SaaS.</span>
        <NuxtLink to="/master" class="underline hover:text-rose-100">Acessar Painel Master</NuxtLink>
      </div>

      <!-- Announcement Bar -->
      <AnnouncementBar
        v-if="store?.showAnnouncement && !isSuspended"
        :text="store?.announcementBar"
        :bg="store?.primaryColor || '#0f172a'"
      />

      <!-- Header Navigation -->
      <Navbar :store="store" :categories="categories" />

      <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <!-- Dynamic Hero Banner for Active Store -->
        <section
          v-if="!searchQuery && !currentCategory && store"
          class="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[380px] md:min-h-[460px] flex items-center shadow-xl shadow-slate-900/10"
        >
          <img
            :src="store.bannerUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80'"
            :alt="store.name"
            class="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-overlay"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
          <div class="relative z-10 max-w-2xl p-8 sm:p-12 md:p-16 space-y-6">
            <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
              <span>✨ Loja Oficial &bull; {{ store.name }}</span>
            </div>
            <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
              {{ store.name }}
            </h1>
            <p class="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed">
              {{ store.description || 'Produtos de alta qualidade, compra 100% segura e envio com rastreamento para todo o Brasil.' }}
            </p>
            <div class="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#catalogo"
                :style="{ backgroundColor: store?.accentColor || '#2563eb' }"
                class="hover:opacity-90 text-white font-bold text-sm px-7 py-3.5 rounded-full transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                Explorar Catálogo
              </a>
              <span class="text-xs text-slate-300 flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Parcelamento e PIX com Aprovação Imediata
              </span>
            </div>
          </div>
        </section>

        <!-- Category Filter Pills -->
        <section v-if="categories.length > 0" class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Departamentos</h2>
            <NuxtLink v-if="currentCategory || searchQuery" to="/" class="text-xs font-bold text-blue-600 hover:underline">
              Limpar Filtros
            </NuxtLink>
          </div>
          <div class="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            <NuxtLink
              to="/"
              class="px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-sm"
              :class="!currentCategory ? 'bg-slate-900 text-white shadow-slate-900/10' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'"
            >
              Todos os Produtos
            </NuxtLink>
            <NuxtLink
              v-for="cat in categories"
              :key="cat.id"
              :to="`/?category=${cat.slug}`"
              class="px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-sm"
              :class="currentCategory === cat.slug ? 'bg-slate-900 text-white shadow-slate-900/10' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'"
            >
              {{ cat.name }}
            </NuxtLink>
          </div>
        </section>

        <!-- Active Search Header -->
        <div v-if="searchQuery" class="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
          <p class="text-sm font-semibold text-blue-900">
            Resultados para: <span class="font-bold">"{{ searchQuery }}"</span>
          </p>
          <NuxtLink to="/" class="text-xs font-bold text-blue-700 hover:underline">
            Remover busca
          </NuxtLink>
        </div>

        <!-- Products Grid -->
        <section id="catalogo" class="space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xl font-extrabold text-slate-900 tracking-tight">
                {{ currentCategory ? categories.find(c => c.slug === currentCategory)?.name : 'Catálogo de Produtos' }}
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">
                {{ products.length }} {{ products.length === 1 ? 'item disponível' : 'itens disponíveis' }}
              </p>
            </div>
          </div>

          <div v-if="products.length === 0" class="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
            <div class="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 class="font-bold text-slate-800 text-base">Nenhum produto encontrado</h4>
            <p class="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Não encontramos itens com estes critérios de busca. Tente selecionar outra categoria.
            </p>
            <NuxtLink to="/" class="inline-block mt-6 text-xs font-bold text-white bg-slate-900 px-6 py-2.5 rounded-full hover:bg-slate-800 transition-colors">
              Ver Todos
            </NuxtLink>
          </div>

          <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            <div
              v-for="prod in products"
              :key="prod.id"
              class="group bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden"
            >
              <!-- Product Image -->
              <NuxtLink :to="`/produto/${prod.slug}`" class="relative aspect-[4/5] bg-slate-100 overflow-hidden block">
                <img
                  :src="prod.coverImage"
                  :alt="prod.name"
                  class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span
                  v-if="prod.compareAtPrice && prod.compareAtPrice > prod.price"
                  class="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm"
                >
                  Oferta
                </span>
                <span
                  v-if="prod.isFeatured"
                  class="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md"
                >
                  Destaque
                </span>
              </NuxtLink>

              <!-- Product Details -->
              <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {{ prod.category?.name || 'Geral' }}
                  </span>
                  <NuxtLink :to="`/produto/${prod.slug}`" class="font-bold text-xs sm:text-sm text-slate-900 hover:text-blue-600 transition-colors line-clamp-2 mt-1">
                    {{ prod.name }}
                  </NuxtLink>
                </div>

                <div>
                  <div class="flex items-baseline gap-2">
                    <span class="font-extrabold text-base sm:text-lg text-slate-900">
                      R$ {{ prod.price.toFixed(2).replace('.', ',') }}
                    </span>
                    <span
                      v-if="prod.compareAtPrice && prod.compareAtPrice > prod.price"
                      class="text-xs text-slate-400 line-through"
                    >
                      R$ {{ prod.compareAtPrice.toFixed(2).replace('.', ',') }}
                    </span>
                  </div>
                  <p class="text-[11px] text-emerald-600 font-semibold mt-0.5">
                    ou até 3x de R$ {{ (prod.price / 3).toFixed(2).replace('.', ',') }} sem juros
                  </p>

                  <button
                    @click="quickAddToCart(prod)"
                    class="mt-3 w-full bg-slate-100 hover:bg-slate-900 text-slate-800 hover:text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Adicionar à Sacola</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- Global Cart Drawer & Footer -->
      <CartDrawer />
      <Footer :store="store" />
    </div>
  </div>
</template>
