<script setup lang="ts">
import { useCart } from '~/composables/useCart'
import { getStoreTheme } from '~/lib/store-themes'
import { getStoreTemplate } from '~/lib/store-templates'

const { addItem } = useCart()
const route = useRoute()

// Active tenant and filter queries
const tenantQuery = computed(() => (route.query.tenant as string) || '')
const currentCategory = computed(() => (route.query.category as string) || '')
const searchQuery = computed(() => (route.query.q as string) || '')

// Fetch public store data and categories reactively with Nuxt 3 query binding
const { data: storeData, error: storeError, pending: storePending } = await useFetch<any>('/api/store/info', {
  query: { tenant: tenantQuery },
})

const { data: catData, pending: categoriesPending } = await useFetch<any>('/api/store/categories', {
  query: { tenant: tenantQuery },
})

// Fetch products based on category/search/tenant reactively
const { data: productsData, error: productsError, pending: productsPending } = await useFetch<any>('/api/store/products', {
  query: {
    tenant: tenantQuery,
    category: currentCategory,
    q: searchQuery,
  },
})

const store = computed<any>(() => storeData.value?.store)
const storeTheme = computed(() => getStoreTheme(store.value?.themeConfig?.themeId))
const storeTemplate = computed(() => getStoreTemplate(store.value?.themeConfig?.templateId))
const builderBlocks = computed<any[]>(() => store.value?.themeConfig?.builderBlocks || [])
const isPlatform = computed(() => {
  if (!tenantQuery.value) return true
  if (['none', 'saas', 'plataforma', 'home'].includes(tenantQuery.value.toLowerCase())) return true
  return !storePending.value && !store.value && !storeError.value
})
const isStoreLoading = computed(() => Boolean(tenantQuery.value) && storePending.value)
const isStoreUnavailable = computed(() => Boolean(tenantQuery.value) && !storePending.value && (Boolean(storeError.value) || !store.value))
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

const getCategoryLink = (category?: string) => {
  const params = new URLSearchParams()
  if (tenantQuery.value) params.set('tenant', tenantQuery.value)
  if (category) params.set('category', category)
  const query = params.toString()
  return query ? `/?${query}` : '/'
}

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

    <main v-else-if="isStoreLoading" class="min-h-screen flex items-center justify-center bg-[#f7f8f6] px-6 text-center">
      <div class="w-full max-w-sm space-y-4" aria-live="polite">
        <div class="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-700"></div>
        <div class="space-y-2">
          <p class="font-bold text-slate-900">Carregando a loja</p>
          <p class="text-sm text-slate-500">Estamos preparando o catálogo para você.</p>
        </div>
      </div>
    </main>

    <main v-else-if="isStoreUnavailable" class="min-h-screen flex items-center justify-center bg-[#f7f8f6] px-6 text-center">
      <div class="w-full max-w-md space-y-4">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-700" aria-hidden="true">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 9v3m0 4h.01M10.3 4.7l-7.1 12.6A1.8 1.8 0 004.8 20h14.4a1.8 1.8 0 001.6-2.7L13.7 4.7a2 2 0 00-3.4 0z" />
          </svg>
        </div>
        <div class="space-y-2">
          <h1 class="text-xl font-extrabold text-slate-900">Loja indisponível</h1>
          <p class="text-sm leading-6 text-slate-500">Não conseguimos encontrar esta loja agora. Confira o endereço ou tente novamente.</p>
        </div>
        <NuxtLink to="/" class="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-900 px-5 text-sm font-bold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2">
          Voltar para a página inicial
        </NuxtLink>
      </div>
    </main>

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
        '--store-template': storeTemplate.id,
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
          v-if="(store?.showAnnouncement || store?.announcementBar) && !isSuspended"
          :text="store?.announcementBar || ''"
          :bg="store?.primaryColor || '#0f172a'"
        />

        <!-- SEÇÕES DINÂMICAS DO CONSTRUTOR DE LOJA (Quando existirem builderBlocks configurados no banco de dados) -->
        <div v-if="builderBlocks.length > 0 && !searchQuery && !currentCategory" class="divide-y divide-slate-100">
          <div v-for="block in builderBlocks" :key="block.id">
            <!-- 1. HERO SLIDE / BANNER -->
            <section
              v-if="block.type === 'hero'"
              :class="[block.props?.padding || 'py-16 md:py-24', block.props?.align === 'text-left' ? 'text-left items-start px-8' : 'text-center']"
              class="relative overflow-hidden text-white flex items-center justify-center transition-all"
              :style="{ backgroundColor: block.props?.bgColor || store?.primaryColor || '#0f172a' }"
            >
              <img
                v-if="block.props?.bgImage || store?.bannerUrl"
                :src="block.props?.bgImage || store?.bannerUrl"
                :alt="block.props?.title || store?.name"
                class="absolute inset-0 w-full h-full object-cover opacity-85"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
              <div class="relative z-10 max-w-2xl px-6 py-4 space-y-4">
                <span class="inline-block px-3.5 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-sm">
                  Destaque Especial
                </span>
                <h1
                  class="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight"
                  :style="{ color: block.props?.textColor || '#ffffff' }"
                >
                  {{ block.props?.title || store?.name }}
                </h1>
                <p
                  v-if="block.props?.subtitle || store?.description"
                  class="text-sm sm:text-base font-medium max-w-lg mx-auto"
                  :style="{ color: block.props?.textColor || '#e2e8f0' }"
                >
                  {{ block.props?.subtitle || store?.description }}
                </p>
                <div class="pt-2">
                  <a
                    href="#catalogo"
                    class="inline-block px-8 py-3.5 rounded-full text-xs sm:text-sm font-black shadow-lg transition hover:scale-105 active:scale-95"
                    :style="{
                      backgroundColor: block.props?.btnColor || store?.accentColor || '#10b981',
                      color: block.props?.btnTextColor || '#ffffff'
                    }"
                  >
                    {{ block.props?.buttonText || 'Conferir Produtos' }}
                  </a>
                </div>
              </div>
            </section>

            <!-- 2. BANNER DE CUPOM / AVISO -->
            <div
              v-else-if="block.type === 'banner'"
              class="p-4 bg-emerald-50 border-y border-emerald-100 flex items-center justify-center space-x-2 text-xs sm:text-sm font-bold text-emerald-950"
            >
              <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span class="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] uppercase font-black">
                {{ block.props?.badge || 'CUPOM' }}
              </span>
              <span>{{ block.props?.text || 'Aproveite nossas promoções exclusivas com envio para todo o Brasil!' }}</span>
            </div>

            <!-- 3. VITRINE DE PRODUTOS EM DESTAQUE (Dentro do Construtor) -->
            <div v-else-if="block.type === 'products'" class="store-container py-10 space-y-6">
              <div class="flex items-center justify-between">
                <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {{ block.props?.title || 'Produtos em Destaque' }}
                </h2>
                <a href="#catalogo" class="text-xs font-bold text-emerald-700 hover:underline">Ver catálogo &rarr;</a>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  v-for="prod in products.slice(0, 4)"
                  :key="prod.id"
                  class="group bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
                >
                  <NuxtLink :to="`/produto/${prod.slug}`" class="relative aspect-square bg-slate-100 overflow-hidden block">
                    <img :src="prod.coverImage" :alt="prod.name" class="w-full h-full object-cover group-hover:scale-105 transition" />
                  </NuxtLink>
                  <div class="p-3.5 space-y-2">
                    <p class="text-xs font-bold text-slate-800 line-clamp-1">{{ prod.name }}</p>
                    <div class="flex items-baseline justify-between">
                      <span class="text-xs sm:text-sm font-black text-slate-900">R$ {{ Number(prod.price || 0).toFixed(2).replace('.', ',') }}</span>
                      <span class="text-[10px] text-emerald-600 font-bold">PIX</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 4. VANTAGENS / FEATURES -->
            <div v-else-if="block.type === 'features'" class="bg-slate-50 border-y border-slate-200/80 py-8">
              <div class="store-container grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                  <p class="text-xs sm:text-sm font-bold text-slate-900">{{ block.props?.feature1 || 'Frete Rápido' }}</p>
                  <p class="text-xs text-slate-500 mt-0.5">Envio para todo o Brasil</p>
                </div>
                <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                  <p class="text-xs sm:text-sm font-bold text-slate-900">{{ block.props?.feature2 || 'PIX com Confirmação Instantânea' }}</p>
                  <p class="text-xs text-slate-500 mt-0.5">Aprovação imediata</p>
                </div>
                <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                  <p class="text-xs sm:text-sm font-bold text-slate-900">{{ block.props?.feature3 || 'Compra 100% Segura' }}</p>
                  <p class="text-xs text-slate-500 mt-0.5">Garantia total CDC</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      <main class="store-container flex flex-col flex-1 py-8" :style="{ gap: 'var(--store-section-gap)' }">
        <!-- Dynamic Hero Banner Padrão (Usado quando o tema não tem builderBlocks customizados) -->
        <section
          v-if="builderBlocks.length === 0 && !searchQuery && !currentCategory && store"
          class="relative overflow-hidden bg-slate-900 text-white min-h-[380px] md:min-h-[460px] flex items-center shadow-xl shadow-slate-900/10"
          :class="storeTemplate.heroStyle === 'editorial' ? 'rounded-none' : 'rounded-3xl'"
        >
          <img
            :src="store?.bannerUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80'"
            :alt="store?.name || 'Loja'"
            class="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-overlay"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
          <div class="relative z-10 max-w-2xl p-8 sm:p-12 md:p-16 space-y-6">
            <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
              <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Loja Oficial &bull; {{ store?.name }}</span>
            </div>
            <h1 class="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08]">
              {{ store?.name }}
            </h1>
            <p class="text-sm sm:text-base text-slate-200 max-w-lg leading-relaxed">
              {{ store?.description || 'Produtos de alta qualidade, compra 100% segura e envio com rastreamento para todo o Brasil.' }}
            </p>
            <div class="pt-2 flex flex-wrap items-center gap-4">
              <a
                :href="store?.themeConfig?.bannerButtonLink || '#catalogo'"
                :style="{ backgroundColor: store?.accentColor || '#059669' }"
                class="hover:opacity-90 text-white font-extrabold text-sm px-8 py-3.5 rounded-full transition-all shadow-lg shadow-emerald-900/30 hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span>{{ store?.themeConfig?.bannerButtonText || 'Explorar Coleção' }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </a>
              <span class="text-xs text-slate-200 flex items-center gap-2 font-medium">
                <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Parcelamento em 12x &bull; Pix Imediato
              </span>
            </div>
          </div>
        </section>

        <!-- Trust Bar / Diferenciais da Loja -->
        <section v-if="storeTemplate.showTrustBar" class="grid grid-cols-2 md:grid-cols-4 gap-3 py-4 border border-slate-200/90 bg-white/90 backdrop-blur-xs rounded-2xl px-5 text-xs text-slate-700 shadow-sm">
          <div class="flex items-center gap-3 py-1">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/25">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p class="font-extrabold text-slate-900 leading-tight">Pix com Desconto</p>
              <p class="text-[11px] text-slate-500 font-medium">Aprovação imediata</p>
            </div>
          </div>
          <div class="flex items-center gap-3 py-1">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/25">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <p class="font-extrabold text-slate-900 leading-tight">Em até 12x no Cartão</p>
              <p class="text-[11px] text-slate-500 font-medium">Parcelamento protegido</p>
            </div>
          </div>
          <div class="flex items-center gap-3 py-1">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-teal-500/25">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div>
              <p class="font-extrabold text-slate-900 leading-tight">Envio Rastreável</p>
              <p class="text-[11px] text-slate-500 font-medium">Para todo o Brasil</p>
            </div>
          </div>
          <div class="flex items-center gap-3 py-1">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/25">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p class="font-extrabold text-slate-900 leading-tight">Troca Fácil 7 Dias</p>
              <p class="text-[11px] text-slate-500 font-medium">Garantida pelo CDC</p>
            </div>
          </div>
        </section>

        <!-- Category Filter Pills -->
        <section v-if="categoriesPending || categories.length > 0" class="space-y-4" aria-label="Categorias de produtos">
          <div class="flex items-center justify-between">
            <h2 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Departamentos</h2>
            <NuxtLink v-if="currentCategory || searchQuery" to="/" class="text-xs font-bold text-emerald-600 hover:underline">
              Limpar Filtros
            </NuxtLink>
          </div>
          <div v-if="categoriesPending" class="flex gap-2.5 overflow-hidden" aria-live="polite">
            <span v-for="item in 4" :key="item" class="h-10 w-28 shrink-0 animate-pulse rounded-lg bg-slate-200"></span>
          </div>
          <div v-else class="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            <NuxtLink
              :to="getCategoryLink()"
              class="px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-sm"
              :class="!currentCategory ? 'bg-slate-900 text-white shadow-slate-900/10' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'"
            >
              Todos os Produtos
            </NuxtLink>
            <NuxtLink
              v-for="cat in categories"
              :key="cat.id"
              :to="getCategoryLink(cat.slug)"
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
              :style="{ backgroundColor: store?.accentColor || '#059669' }"
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

          <div v-if="productsPending" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6" aria-label="Carregando produtos" aria-live="polite">
            <div v-for="item in 8" :key="item" class="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div class="aspect-[4/5] animate-pulse bg-slate-200"></div>
              <div class="space-y-3 p-4">
                <div class="h-3 w-2/3 animate-pulse rounded bg-slate-200"></div>
                <div class="h-4 w-full animate-pulse rounded bg-slate-200"></div>
                <div class="h-10 w-full animate-pulse rounded-lg bg-slate-200"></div>
              </div>
            </div>
          </div>

          <div v-else-if="productsError" class="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center" role="alert">
            <h4 class="font-bold text-rose-900">Não foi possível carregar os produtos</h4>
            <p class="mt-1 text-sm text-rose-800">Tente atualizar a página em alguns instantes.</p>
          </div>

          <div v-else-if="products.length === 0" class="bg-white rounded-xl p-12 text-center border border-slate-200">
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

          <div v-else class="grid gap-4 sm:gap-6" :class="storeTemplate.productColumns">
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
                    <span class="font-black text-base sm:text-lg text-slate-900 tracking-tight tabular-nums">
                      R$ {{ Number(prod.price || 0).toFixed(2).replace('.', ',') }}
                    </span>
                    <span
                      v-if="prod.compareAtPrice && Number(prod.compareAtPrice) > Number(prod.price)"
                      class="text-xs text-slate-400 line-through font-medium tabular-nums"
                    >
                      R$ {{ Number(prod.compareAtPrice).toFixed(2).replace('.', ',') }}
                    </span>
                  </div>
                  <p class="text-[11px] text-emerald-800 font-bold mt-0.5 tabular-nums">
                    ou até 12x de R$ {{ (Number(prod.price || 0) / 12).toFixed(2).replace('.', ',') }} sem juros
                  </p>
                  <button
                    @click="quickAddToCart(prod)"
                    :style="{ backgroundColor: store?.accentColor || '#059669' }"
                    class="mt-3 w-full text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-700/20 hover:opacity-90 active:scale-95 cursor-pointer"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
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
