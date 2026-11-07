<script setup lang="ts">
import { useCart } from '~/composables/useCart'

const route = useRoute()
const slug = route.params.slug as string
const tenantQuery = computed(() => (route.query.tenant as string) || '')
const { addItem } = useCart()

// Fetch product & store details with reactive tenant propagation
const { data: prodData } = await useFetch<any>(`/api/store/products/${slug}`, {
  query: { tenant: tenantQuery },
})
const { data: storeData } = await useFetch<any>('/api/store/info', {
  query: { tenant: tenantQuery },
})

const product = computed<any>(() => prodData.value?.product)
const store = computed<any>(() => storeData.value?.store)

const selectedImage = ref('')
const selectedVariant = ref<any>(null)
const quantity = ref(1)

// Shipping calculator state
const zipcode = ref('')
const shippingLoading = ref(false)
const shippingRates = ref<any[]>([])
const shippingError = ref('')

onMounted(() => {
  if (product.value) {
    selectedImage.value = product.value.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800'
    if (product.value.variants && product.value.variants.length > 0) {
      selectedVariant.value = product.value.variants[0]
    }
  }
})

const handleCalculateShipping = async () => {
  const cleanZip = zipcode.value.replace(/\D/g, '')
  if (cleanZip.length !== 8) {
    shippingError.value = 'Digite um CEP válido com 8 dígitos.'
    return
  }

  shippingError.value = ''
  shippingLoading.value = true

  try {
    const res: any = await $fetch('/api/store/shipping/calculate', {
      method: 'POST',
      body: { zipcode: cleanZip },
      query: { tenant: tenantQuery.value },
    })
    shippingRates.value = res.rates || []
  } catch (err: any) {
    shippingError.value = err.data?.statusMessage || 'Erro ao calcular frete.'
  } finally {
    shippingLoading.value = false
  }
}

const addToCart = (redirectCheckout = false) => {
  if (!product.value) return

  addItem({
    productId: product.value.id,
    variantId: selectedVariant.value?.id || null,
    name: product.value.name,
    variantName: selectedVariant.value?.name || null,
    price: selectedVariant.value?.price || product.value.price,
    quantity: quantity.value,
    imageUrl: selectedImage.value || product.value.images?.[0],
  })

  if (redirectCheckout) {
    const tenantParam = tenantQuery.value ? `?tenant=${encodeURIComponent(tenantQuery.value)}` : ''
    navigateTo(`/checkout${tenantParam}`)
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50">
    <AnnouncementBar
      v-if="store?.showAnnouncement"
      :text="store?.announcementBar"
      :bg="store?.primaryColor || '#0f172a'"
    />
    <Navbar :store="store" />

    <main v-if="product" class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-2 text-xs text-slate-500">
        <NuxtLink :to="tenantQuery ? `/?tenant=${tenantQuery}` : '/'" class="hover:text-slate-900 transition-colors">Início</NuxtLink>
        <span>/</span>
        <NuxtLink
          v-if="product.category"
          :to="tenantQuery ? `/?tenant=${tenantQuery}&category=${product.category.slug}` : `/?category=${product.category.slug}`"
          class="hover:text-slate-900 transition-colors"
        >
          {{ product.category.name }}
        </NuxtLink>
        <span v-if="product.category">/</span>
        <span class="text-slate-900 font-semibold truncate">{{ product.name }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        <!-- Image Gallery -->
        <div class="space-y-4">
          <div class="aspect-[4/5] bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm relative">
            <img
              :src="selectedImage || product.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800'"
              :alt="product.name"
              class="w-full h-full object-cover object-center transition-all duration-300"
            />
            <span
              v-if="product.compareAtPrice && product.compareAtPrice > product.price"
              class="absolute top-4 left-4 bg-red-600 text-white text-xs font-extrabold uppercase px-3 py-1 rounded-full shadow-md"
            >
              Oferta Especial
            </span>
          </div>

          <!-- Thumbnails -->
          <div v-if="product.images && product.images.length > 1" class="flex items-center gap-3 overflow-x-auto pb-2">
            <button
              v-for="img in product.images"
              :key="img"
              @click="selectedImage = img"
              class="w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0"
              :class="selectedImage === img ? 'border-emerald-600 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300'"
            >
              <img :src="img" :alt="product.name" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Product Purchase Column -->
        <div class="space-y-6">
          <div>
            <span class="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
              {{ product.category?.name || 'Catálogo Oficial' }}
            </span>
            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
              {{ product.name }}
            </h1>
            <div class="flex items-center gap-3 mt-2">
              <div class="flex items-center text-amber-500">
                <svg v-for="i in 5" :key="i" class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <span class="text-xs font-semibold text-slate-500">4.9 &bull; 48 avaliações de clientes verificados</span>
            </div>
            <p v-if="product.sku" class="text-xs text-slate-400 mt-1 font-mono">SKU: {{ product.sku }}</p>
          </div>

          <!-- Price Display -->
          <div class="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-1">
            <div class="flex items-baseline gap-3">
              <span class="text-3xl font-extrabold text-slate-900">
                R$ {{ (selectedVariant?.price || product.price).toFixed(2).replace('.', ',') }}
              </span>
              <span
                v-if="product.compareAtPrice && product.compareAtPrice > product.price"
                class="text-base text-slate-400 line-through font-medium"
              >
                R$ {{ Number(product.compareAtPrice).toFixed(2).replace('.', ',') }}
              </span>
            </div>
            <p class="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span>Em até 12x no cartão ou com 5% de desconto no PIX</span>
            </p>
          </div>

          <!-- Variants Selector -->
          <div v-if="product.variants && product.variants.length > 0" class="space-y-3">
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Escolha a Variação: <span class="text-slate-900">{{ selectedVariant?.name }}</span>
            </label>
            <div class="flex flex-wrap gap-2.5">
              <button
                v-for="v in product.variants"
                :key="v.id"
                @click="selectedVariant = v"
                class="px-4 py-2.5 rounded-xl text-xs font-bold border transition-all"
                :class="selectedVariant?.id === v.id
                  ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'"
              >
                {{ v.name }}
              </button>
            </div>
          </div>

          <!-- Stock Indicator -->
          <div class="flex items-center gap-2 text-xs font-semibold text-emerald-600">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Produto em estoque e pronto para envio</span>
          </div>

          <!-- Quantity & Action Buttons -->
          <div class="space-y-3 pt-2">
            <div class="flex items-center gap-4">
              <div class="flex items-center border border-slate-200 rounded-xl bg-white px-2 py-1 shadow-sm">
                <button
                  @click="quantity = Math.max(1, quantity - 1)"
                  class="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 rounded-lg text-sm"
                >
                  -
                </button>
                <span class="w-10 text-center font-bold text-sm text-slate-900">{{ quantity }}</span>
                <button
                  @click="quantity++"
                  class="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 rounded-lg text-sm"
                >
                  +
                </button>
              </div>

              <button
                @click="addToCart(false)"
                class="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-2xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Adicionar à Sacola</span>
              </button>
            </div>

            <button
              @click="addToCart(true)"
              class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-2xl text-sm transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2"
            >
              <span>Comprar Agora</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <!-- Trust Grid -->
            <div class="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-500 text-center font-medium">
              <div class="p-2.5 rounded-xl bg-slate-100/70 border border-slate-200/60 flex flex-col items-center gap-1">
                <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Compra Segura</span>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-100/70 border border-slate-200/60 flex flex-col items-center gap-1">
                <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Troca em 7 dias</span>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-100/70 border border-slate-200/60 flex flex-col items-center gap-1">
                <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <span>Rastreio Oficial</span>
              </div>
            </div>
          </div>

          <!-- Shipping Simulator -->
          <div class="pt-6 border-t border-slate-200 space-y-3">
            <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span>Calcular Prazo e Frete</span>
            </h4>
            <div class="flex gap-2">
              <input
                v-model="zipcode"
                type="text"
                placeholder="Digite seu CEP (ex: 01310-100)"
                maxlength="9"
                class="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
              />
              <button
                @click="handleCalculateShipping"
                :disabled="shippingLoading"
                class="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors disabled:opacity-50"
              >
                {{ shippingLoading ? 'Calculando...' : 'Calcular' }}
              </button>
            </div>
            <p v-if="shippingError" class="text-xs text-red-500">{{ shippingError }}</p>

            <div v-if="shippingRates.length > 0" class="space-y-2 pt-2">
              <div
                v-for="rate in shippingRates"
                :key="rate.id"
                class="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 text-xs"
              >
                <div>
                  <p class="font-bold text-slate-800">{{ rate.name }}</p>
                  <p class="text-[11px] text-slate-500">Entrega em até {{ rate.deliveryTimeDays }} dias úteis</p>
                </div>
                <span class="font-extrabold text-slate-900">
                  R$ {{ rate.price.toFixed(2).replace('.', ',') }}
                </span>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="pt-6 border-t border-slate-200 space-y-2">
            <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider">Descrição do Produto</h4>
            <div class="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {{ product.description || 'Nenhuma descrição detalhada disponível.' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Sticky Mobile Bottom Bar (High-Converting Retail UX) -->
      <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 z-30 flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <span class="text-[10px] text-slate-400 font-bold uppercase block leading-none">Preço à vista</span>
          <span class="text-base font-black text-slate-900 tracking-tight">
            R$ {{ Number(selectedVariant?.price || product.price || 0).toFixed(2).replace('.', ',') }}
          </span>
        </div>
        <button
          @click="addToCart(true)"
          class="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 px-5 rounded-xl text-xs transition-transform active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Comprar Agora</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </main>

    <Footer :store="store" />
  </div>
</template>
