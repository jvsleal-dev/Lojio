<script setup lang="ts">
import { useCart } from '~/composables/useCart'
import { getStoreTheme } from '~/lib/store-themes'

const { addItem } = useCart()
const route = useRoute()

// Active tenant and filter queries
const tenantQuery = computed(() => (route.query.tenant as string) || '')
const currentCategory = computed(() => (route.query.category as string) || '')
const searchQuery = computed(() => (route.query.q as string) || '')

// Fetch public store data and categories reactively with Nuxt 3 query binding
const { data: storeData, error: storeError } = await useFetch<any>('/api/store/info', {
  query: { tenant: tenantQuery },
})

const { data: catData } = await useFetch<any>('/api/store/categories', {
  query: { tenant: tenantQuery },
})

// Fetch products based on category/search/tenant reactively
const { data: productsData } = await useFetch<any>('/api/store/products', {
  query: {
    tenant: tenantQuery,
    category: currentCategory,
    q: searchQuery,
  },
})

const store = computed<any>(() => storeData.value?.store)
const storeTheme = computed(() => getStoreTheme(store.value?.themeConfig?.themeId))
const isPlatform = computed(() => {
  if (['none', 'saas', 'plataforma', 'home'].includes(tenantQuery.value.toLowerCase())) return true
  if (!store.value) return true
  return false
})
const categories = computed<any[]>(() => (catData.value as any)?.categories || [])
const products = computed<any[]>(() => (productsData.value as any)?.products || [])
const isSuspended = computed(() => (storeError.value as any)?.statusCode === 403)

const { user, tenant, isAuthenticated, initAuth } = useAuth()
onMounted(() => initAuth())

const isOwner = computed(() => {
  if (!isAuthenticated.value) return false
  if (user.value?.role === 'SUPERADMIN' || user.value?.role === 'MASTER') return true
  return (tenant.value as any)?.id === store.value?.id || (tenant.value as any)?.subdomain === store.value?.subdomain
})

const selectedFont = computed(() => store.value?.themeConfig?.fontFamily || 'Inter')

const currentCategoryName = computed(() => {
  if (!currentCategory.value) return 'Catálogo de Produtos'
  const found = categories.value.find((c: any) => c?.slug === currentCategory.value)
  return found?.name || 'Catálogo de Produtos'
})

useHead(() => ({
  title: store.value ? `${store.value.name} | Loja online` : 'Lojio - Crie sua loja online',
  meta: [
    {
      name: 'description',
      content: store.value?.description || 'Crie sua loja virtual com a Lojio, a base para sua marca vender mais no site e no WhatsApp.',
    },
  ],
  link: selectedFont.value && selectedFont.value !== 'Inter' ? [
    {
      rel: 'stylesheet',
      href: `https://fonts.googleapis.com/css2?family=${encodeURIComponent(selectedFont.value).replace(/%20/g, '+')}:wght@400;500;600;700;800;900&display=swap`,
    },
  ] : [],
}))

const quickAddToCart = (product: any) => {
  addItem({
    productId: product.id,
    variantId: product.variants?.[0]?.id || null,
    name: product.name,
    variantName: product.variants?.[0]?.name || null,
    price: Number(product.price) || 0,
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
    <div
      v-else
      class="min-h-screen flex flex-col selection:bg-emerald-600 selection:text-white"
      :style="{
        '--store-primary': storeTheme.primaryColor,
        '--store-accent': storeTheme.accentColor,
        '--store-bg': storeTheme.bgColor,
        '--store-container': storeTheme.containerWidth,
        '--store-section-gap': storeTheme.sectionGap,
        '--store-card-radius': storeTheme.cardRadius,
        '--store-button-radius': storeTheme.buttonRadius,
        fontFamily: `'${store?.themeConfig?.fontFamily || storeTheme.fontFamily}', sans-serif`,
        backgroundColor: store?.themeConfig?.bgColor || storeTheme.bgColor
      }"
    >
      <!-- Store Suspended Alert -->
      <div v-if="isSuspended" class="bg-rose-500 text-white text-xs font-bold py-3 px-4 text-center flex items-center justify-center space-x-2 shadow-md">
        <svg class="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>Esta loja está temporariamente suspensa pelo administrador da plataforma SaaS.</span>
        <NuxtLink to="/master" class="underline hover:text-rose-100">Acessar Painel Master</NuxtLink>
      </div>

      <div v-if="store && store.isActive === false && isOwner" class="bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-bold py-2.5 px-4 text-center flex flex-wrap items-center justify-center gap-2 shadow-md">
        <svg class="w-4 h-4 text-amber-200 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <span>Modo Rascunho / Pré-visualização: Apenas você pode ver esta loja. Os clientes externos não têm acesso.</span>
        <NuxtLink to="/admin" class="px-3 py-1 bg-white text-amber-900 rounded-lg font-black hover:bg-amber-50 transition shadow inline-flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.458 14.96 14.96 0 01.06-.312m-2.24 7.99a4.5 4.5 0 01-1.414-1.414m3.654 3.654l-1.06-1.06m-2.594-2.594l-1.06-1.06" />
          </svg>
          <span>Publicar Loja no Painel</span>
        </NuxtLink>
      </div>

      <!-- Header Navigation -->
      <Navbar :store="store" :categories="categories" />

      <!-- If Store is Unpublished & Visitor is NOT owner: Show Coming Soon -->
      <div v-if="store && store.isActive === false && !isOwner" class="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto py-24 space-y-6">
        <div class="w-20 h-20 rounded-3xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center shadow-lg">
          <svg class="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div class="space-y-2">
          <h2 class="text-3xl font-extrabold text-slate-900">{{ store?.name }}</h2>
          <p class="text-xs font-bold text-amber-600 uppercase tracking-wider">Loja em Construção &bull; Em Breve</p>
          <p class="text-sm text-slate-500 leading-relaxed max-w-md">
            Estamos preparando novidades e organizando nosso catálogo de produtos. Em breve nossa vitrine estará aberta para pedidos!
          </p>
        </div>

        <div class="pt-8 border-t border-slate-200 text-xs text-slate-400">
          Você é o proprietário desta loja?
          <NuxtLink to="/admin/login" class="font-bold text-emerald-600 hover:underline ml-1">
            Fazer login e publicar loja
          </NuxtLink>
        </div>
      </div>

      <!-- Main Storefront Content (When published or when viewed by owner) -->
      <template v-else>
        <!-- Announcement Bar -->
        <AnnouncementBar
          v-if="store?.showAnnouncement && !isSuspended"
          :text="store?.announcementBar || ''"
          :bg="store?.primaryColor || '#0f172a'"
        />

      <main class="flex flex-col flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" :style="{ maxWidth: 'var(--store-container)', gap: 'var(--store-section-gap)' }">
        <!-- Dynamic Hero Banner for Active Store -->
        <section
          v-if="!searchQuery && !currentCategory && store"
          class="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[380px] md:min-h-[460px] flex items-center shadow-xl shadow-slate-900/10"
        >
          <img
            :src="store?.bannerUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80'"
            :alt="store?.name || 'Loja'"
            class="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-overlay"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
          <div class="relative z-10 max-w-2xl p-8 sm:p-12 md:p-16 space-y-6">
            <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
              <svg class="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Loja Oficial &bull; {{ store?.name }}</span>
            </div>
            <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
              {{ store?.name }}
            </h1>
            <p class="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed">
              {{ store?.description || 'Produtos de alta qualidade, compra 100% segura e envio com rastreamento para todo o Brasil.' }}
            </p>
            <div class="pt-2 flex flex-wrap items-center gap-4">
              <a
                :href="store?.themeConfig?.bannerButtonLink || '#catalogo'"
                :style="{ backgroundColor: store?.accentColor || '#2563eb' }"
                class="hover:opacity-90 text-white font-bold text-sm px-7 py-3.5 rounded-full transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                {{ store?.themeConfig?.bannerButtonText || 'Explorar Catálogo' }}
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

        <!-- Trust Bar / Diferenciais da Loja -->
        <section class="grid grid-cols-2 md:grid-cols-4 gap-3 py-3 border-y border-slate-200/80 bg-white/70 backdrop-blur-xs rounded-2xl px-4 text-xs text-slate-700 shadow-2xs">
          <div class="flex items-center gap-2.5 py-1">
            <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p class="font-bold text-slate-900 leading-tight">Pix com Desconto</p>
              <p class="text-[10px] text-slate-500">Aprovação imediata</p>
            </div>
          </div>
          <div class="flex items-center gap-2.5 py-1">
            <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <p class="font-bold text-slate-900 leading-tight">Em até 12x no Cartão</p>
              <p class="text-[10px] text-slate-500">Com parcelamento seguro</p>
            </div>
          </div>
          <div class="flex items-center gap-2.5 py-1">
            <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div>
              <p class="font-bold text-slate-900 leading-tight">Envio Rastreável</p>
              <p class="text-[10px] text-slate-500">Entrega garantida</p>
            </div>
          </div>
          <div class="flex items-center gap-2.5 py-1">
            <div class="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p class="font-bold text-slate-900 leading-tight">Troca Fácil em 7 Dias</p>
              <p class="text-[10px] text-slate-500">Satisfação 100% garantida</p>
            </div>
          </div>
        </section>

        <!-- Category Filter Pills -->
        <section v-if="categories.length > 0" class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Departamentos</h2>
            <NuxtLink v-if="currentCategory || searchQuery" to="/" class="text-xs font-bold text-emerald-600 hover:underline">
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

        <!-- Secondary Promo Banner (Configured in Theme Editor) -->
        <section
          v-if="store?.themeConfig?.secondaryBannerUrl"
          class="relative rounded-3xl overflow-hidden min-h-[220px] flex items-center shadow-lg my-6"
        >
          <img
            :src="store?.themeConfig?.secondaryBannerUrl"
            alt="Promoção"
            class="absolute inset-0 w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent"></div>
          <div class="relative z-10 p-6 sm:p-10 space-y-3 max-w-lg text-white">
            <span class="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
              Destaque Especial
            </span>
            <h3 class="text-2xl sm:text-3xl font-black">
              {{ store?.themeConfig?.secondaryBannerTitle || 'Condições Especiais da Semana' }}
            </h3>
            <a
              :href="store?.themeConfig?.secondaryBannerLink || '#catalogo'"
              class="inline-flex items-center px-5 py-2.5 rounded-full text-xs font-extrabold text-white shadow-md transition hover:scale-105"
              :style="{ backgroundColor: store?.accentColor || '#2563eb' }"
            >
              Aproveitar Oferta &rarr;
            </a>
          </div>
        </section>

        <!-- Active Search Header -->
        <div v-if="searchQuery" class="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
          <p class="text-sm font-semibold text-emerald-900">
            Resultados para: <span class="font-bold">"{{ searchQuery }}"</span>
          </p>
          <NuxtLink to="/" class="text-xs font-bold text-emerald-700 hover:underline">
            Remover busca
          </NuxtLink>
        </div>

        <!-- Products Grid -->
        <section id="catalogo" class="space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xl font-extrabold text-slate-900 tracking-tight">
                {{ currentCategoryName }}
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
              class="group bg-white border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden"
              :class="store?.themeConfig?.cardRadius || 'rounded-2xl'"
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
                  v-if="store?.themeConfig?.showDiscountBadge !== false && prod.compareAtPrice && Number(prod.compareAtPrice) > Number(prod.price)"
                  class="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm"
                >
                  {{ Math.round(((Number(prod.compareAtPrice) - Number(prod.price)) / Number(prod.compareAtPrice)) * 100) }}% OFF
                </span>
                <span
                  v-if="prod.isFeatured"
                  class="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md"
                >
                  Destaque
                </span>
              </NuxtLink>

              <!-- Product Details -->
              <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div class="text-[10px] text-slate-400 font-bold mb-1">
                    <span class="uppercase tracking-wider">
                      {{ prod.category?.name || 'Geral' }}
                    </span>
                  </div>
                  <NuxtLink :to="`/produto/${prod.slug}`" class="font-extrabold text-xs sm:text-sm text-slate-900 hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
                    {{ prod.name }}
                  </NuxtLink>
                </div>

                <div>
                  <div class="flex items-baseline gap-2">
                    <span class="font-black text-base sm:text-lg text-slate-900 tracking-tight">
                      R$ {{ Number(prod.price || 0).toFixed(2).replace('.', ',') }}
                    </span>
                    <span
                      v-if="prod.compareAtPrice && Number(prod.compareAtPrice) > Number(prod.price)"
                      class="text-xs text-slate-400 line-through font-medium"
                    >
                      R$ {{ Number(prod.compareAtPrice).toFixed(2).replace('.', ',') }}
                    </span>
                  </div>
                  <button
                    @click="quickAddToCart(prod)"
                    :style="{ backgroundColor: store?.accentColor || '#0f172a' }"
                    class="mt-3 w-full text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm hover:opacity-90 active:scale-95 cursor-pointer"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>{{ store?.themeConfig?.cardButtonText || 'Adicionar à Sacola' }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- Storefront Footer -->
      <Footer :store="store" />
      </template>
    </div>
  </div>
</template>
