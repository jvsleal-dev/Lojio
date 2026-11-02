<script setup lang="ts">
import { useCart } from '~/composables/useCart'

const route = useRoute()
const slug = route.params.slug as string
const { addItem } = useCart()

// Fetch product & store details
const { data: prodData } = await useFetch(`/api/store/products/${slug}`)
const { data: storeData } = await useFetch('/api/store/info')

const product = computed(() => prodData.value?.product)
const store = computed(() => storeData.value?.store)

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
    navigateTo('/checkout')
  }
}

const buyViaWhatsapp = () => {
  if (!product.value) return
  const pName = product.value.name
  const price = (selectedVariant.value?.price || product.value.price).toFixed(2).replace('.', ',')
  const variant = selectedVariant.value ? ` (${selectedVariant.value.name})` : ''
  const msg = `Olá! Gostaria de fazer o pedido do produto:\n• *${pName}*${variant}\n• Quantidade: *${quantity.value}*\n• Valor: *R$ ${price}*\n\nPode me passar os dados para pagamento via Pix/Cartão?`
  const rawPhone = (store.value?.contactWhatsapp || '11999998888').replace(/\D/g, '')
  const phone = rawPhone.startsWith('55') ? rawPhone : `55${rawPhone}`
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank')
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
        <NuxtLink to="/" class="hover:text-slate-900 transition-colors">Início</NuxtLink>
        <span>/</span>
        <span v-if="product.category" class="hover:text-slate-900 transition-colors">
          {{ product.category.name }}
        </span>
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
              :class="selectedImage === img ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300'"
            >
              <img :src="img" :alt="product.name" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Product Purchase Column -->
        <div class="space-y-6">
          <div>
            <span class="text-xs font-bold text-blue-600 uppercase tracking-wider block">
              {{ product.category?.name || 'Catálogo Oficial' }}
            </span>
            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
              {{ product.name }}
            </h1>
            <p v-if="product.sku" class="text-xs text-slate-400 mt-1">SKU: {{ product.sku }}</p>
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
                R$ {{ product.compareAtPrice.toFixed(2).replace('.', ',') }}
              </span>
            </div>
            <p class="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
              <span>💳 Em até 12x no cartão ou com 5% de desconto no PIX</span>
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
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl text-sm transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
            >
              <span>Comprar Agora</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <!-- WhatsApp Direct Buy Button (Offstore style) -->
            <button
              @click="buyViaWhatsapp"
              type="button"
              class="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold py-3.5 px-6 rounded-2xl text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
            >
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>Pedir pelo WhatsApp</span>
            </button>
          </div>

          <!-- Shipping Simulator -->
          <div class="pt-6 border-t border-slate-200 space-y-3">
            <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                class="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
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
    </main>

    <CartDrawer />
    <Footer :store="store" />
  </div>
</template>
