<script setup lang="ts">
import { useCart } from '~/composables/useCart'

const route = useRoute()
const tenantQuery = computed(() => (route.query.tenant as string) || '')

const { items, subtotal, count, updateQuantity, removeItem, clearCart } = useCart()

const { data: storeData } = await useFetch<any>('/api/store/info', {
  query: { tenant: tenantQuery },
})
const store = computed<any>(() => storeData.value?.store)

// Timer regressivo idêntico à imagem (00 : 00 : 02 : 26)
const timeLeft = ref({
  hours: 0,
  minutes: 2,
  seconds: 26,
})

let timerInterval: any = null

onMounted(() => {
  timerInterval = setInterval(() => {
    if (timeLeft.value.seconds > 0) {
      timeLeft.value.seconds--
    } else if (timeLeft.value.minutes > 0) {
      timeLeft.value.minutes--
      timeLeft.value.seconds = 59
    } else if (timeLeft.value.hours > 0) {
      timeLeft.value.hours--
      timeLeft.value.minutes = 59
      timeLeft.value.seconds = 59
    }
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

const pad = (n: number) => String(n).padStart(2, '0')

// CEP e Opções de Envio idênticas à imagem
const cepInput = ref('62700000')
const isEditingCep = ref(false)
const selectedShipping = ref('jt')

const shippingOptions = ref([
  {
    id: 'jt',
    name: 'Frete Grátis - J&T Express',
    daysText: 'Chega em 17 dias úteis',
    price: 0,
    priceText: 'Grátis',
  },
  {
    id: 'loggi',
    name: 'Frete Fixo - Loggi',
    daysText: 'Chega em 16 dias úteis',
    price: 19.90,
    priceText: 'R$19,90',
  },
  {
    id: 'sedex',
    name: 'Expresso - Correios Sedex',
    daysText: 'Chega em 8 dias úteis',
    price: 24.90,
    priceText: 'R$24,90',
  },
])

const activeShippingPrice = computed(() => {
  const selected = shippingOptions.value.find((s) => s.id === selectedShipping.value)
  return selected ? selected.price : 0
})

const totalWithShipping = computed(() => {
  return subtotal.value + activeShippingPrice.value
})

const goToCheckout = () => {
  const tenantParam = tenantQuery.value ? `?tenant=${encodeURIComponent(tenantQuery.value)}` : ''
  navigateTo(`/checkout${tenantParam}`)
}

const closeCart = () => {
  const tenantParam = tenantQuery.value ? `?tenant=${encodeURIComponent(tenantQuery.value)}` : ''
  navigateTo(`/${tenantParam}`)
}
</script>

<template>
  <div class="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
    <!-- Top Header -->
    <header class="max-w-xl w-full mx-auto px-5 py-4 flex items-center justify-between border-b border-slate-100">
      <h1 class="text-xl sm:text-2xl font-black text-black tracking-tight">
        Carrinho de compras
      </h1>
      <button
        @click="closeCart"
        class="p-2 text-slate-900 hover:text-slate-600 transition-colors"
        aria-label="Fechar carrinho"
      >
        <svg class="w-6 h-6 stroke-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </header>

    <!-- Urgency Black Timer Bar (Image 1 reference) -->
    <div class="bg-black text-white py-3 px-4 text-center">
      <div class="flex items-center justify-center gap-3 font-mono text-xl sm:text-2xl font-black tracking-widest">
        <div class="flex flex-col items-center">
          <span>00</span>
          <span class="text-[10px] uppercase font-sans text-slate-400 font-bold -mt-1">Dia(s)</span>
        </div>
        <span class="text-slate-500 font-sans pb-3">:</span>
        <div class="flex flex-col items-center">
          <span>{{ pad(timeLeft.hours) }}</span>
          <span class="text-[10px] uppercase font-sans text-slate-400 font-bold -mt-1">Hora(s)</span>
        </div>
        <span class="text-slate-500 font-sans pb-3">:</span>
        <div class="flex flex-col items-center">
          <span>{{ pad(timeLeft.minutes) }}</span>
          <span class="text-[10px] uppercase font-sans text-slate-400 font-bold -mt-1">Min(s)</span>
        </div>
        <span class="text-slate-500 font-sans pb-3">:</span>
        <div class="flex flex-col items-center">
          <span>{{ pad(timeLeft.seconds) }}</span>
          <span class="text-[10px] uppercase font-sans text-slate-400 font-bold -mt-1">Seg(s)</span>
        </div>
      </div>
    </div>

    <!-- Main Content Area (Max Width centered like mobile/drawer) -->
    <main class="max-w-xl w-full mx-auto px-5 py-6 flex-1 flex flex-col justify-between space-y-6">
      <!-- Empty Cart State -->
      <div v-if="items.length === 0" class="py-16 text-center space-y-4">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 class="text-lg font-black text-slate-900">Seu carrinho está vazio</h2>
        <p class="text-xs text-slate-500">Volte para a vitrine e escolha os seus produtos favoritos.</p>
        <button
          @click="closeCart"
          class="inline-block mt-2 px-6 py-3 rounded-xl bg-black text-white text-xs font-bold hover:bg-slate-800 transition"
        >
          Ir às compras
        </button>
      </div>

      <div v-else class="space-y-6">
        <!-- Products List -->
        <div class="space-y-4 divide-y divide-slate-100">
          <div
            v-for="item in items"
            :key="item.productId + (item.variantId || '')"
            class="pt-4 first:pt-0 flex items-center justify-between gap-4"
          >
            <!-- Product Thumbnail Image -->
            <div class="w-16 h-20 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-100 p-1">
              <img
                :src="item.imageUrl || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300'"
                :alt="item.name"
                class="w-full h-full object-contain"
              />
            </div>

            <!-- Product Details -->
            <div class="flex-1 min-w-0 pr-2">
              <div class="flex items-start justify-between gap-2">
                <p class="text-xs sm:text-sm font-medium text-slate-800 leading-snug line-clamp-2">
                  {{ item.name }}
                </p>
                <button
                  @click="removeItem(item.productId, item.variantId)"
                  class="text-xs font-medium text-slate-900 hover:text-rose-600 underline shrink-0 transition"
                >
                  Apagar
                </button>
              </div>

              <!-- Quantity selector and Price row -->
              <div class="flex items-center justify-between mt-3">
                <div class="inline-flex items-center border border-slate-300 rounded-md bg-white">
                  <button
                    @click="updateQuantity(item.productId, item.quantity - 1, item.variantId)"
                    class="px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                  >
                    –
                  </button>
                  <span class="px-3 text-xs font-bold text-slate-900">{{ item.quantity }}</span>
                  <button
                    @click="updateQuantity(item.productId, item.quantity + 1, item.variantId)"
                    class="px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                  >
                    +
                  </button>
                </div>

                <span class="text-sm sm:text-base font-black text-black">
                  R${{ (item.price * item.quantity).toFixed(2).replace('.', ',') }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Subtotal Line -->
        <div class="flex items-center justify-between pt-4 border-t border-slate-100">
          <span class="text-xs sm:text-sm text-slate-700 font-semibold">Subtotal (sem frete) :</span>
          <span class="text-base sm:text-lg font-black text-black">
            R${{ subtotal.toFixed(2).replace('.', ',') }}
          </span>
        </div>

        <!-- Meios de Envio Section (Image 1 style) -->
        <div class="pt-4 border-t border-slate-200/80 space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-xs">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 class="text-sm font-bold text-slate-900">Meios de envio</h3>
            </div>
            <button class="text-slate-400 hover:text-slate-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <div class="flex items-center justify-between text-xs text-slate-700">
            <p>
              Entregas para o CEP: <strong class="font-bold text-black">{{ cepInput }}</strong>
            </p>
            <button
              @click="isEditingCep = !isEditingCep"
              class="font-semibold text-black underline hover:text-emerald-700 transition"
            >
              Alterar CEP
            </button>
          </div>

          <div v-if="isEditingCep" class="flex gap-2 pt-1">
            <input
              v-model="cepInput"
              type="text"
              maxlength="9"
              placeholder="00000-000"
              class="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              @click="isEditingCep = false"
              class="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition"
            >
              Calcular
            </button>
          </div>

          <!-- Envio a domicílio Label -->
          <p class="text-xs font-bold text-slate-900 pt-1">Envio a domicílio</p>

          <!-- Radio Shipping Options Cards -->
          <div class="space-y-2.5">
            <label
              v-for="option in shippingOptions"
              :key="option.id"
              class="flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all"
              :class="selectedShipping === option.id ? 'border-slate-400 bg-slate-50/80' : 'border-slate-200 bg-white hover:border-slate-300'"
            >
              <div class="flex items-start gap-3">
                <div class="pt-0.5">
                  <div
                    class="w-4 h-4 rounded-full border flex items-center justify-center transition"
                    :class="selectedShipping === option.id ? 'border-black' : 'border-slate-400'"
                  >
                    <div
                      v-if="selectedShipping === option.id"
                      class="w-2 h-2 rounded-full bg-black"
                    />
                  </div>
                  <input
                    type="radio"
                    :value="option.id"
                    v-model="selectedShipping"
                    class="sr-only"
                  />
                </div>
                <div>
                  <p class="text-xs font-medium text-slate-900">{{ option.name }}</p>
                  <p class="text-[11px] text-slate-500 mt-0.5">{{ option.daysText }}</p>
                </div>
              </div>

              <span class="text-xs font-bold text-slate-900">{{ option.priceText }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Bottom Sticky Action (Image 1 style) -->
      <div v-if="items.length > 0" class="pt-4 border-t border-slate-100">
        <button
          @click="goToCheckout"
          class="w-full bg-black hover:bg-slate-900 text-white font-extrabold py-4 px-6 rounded-lg text-sm sm:text-base tracking-wide transition shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
        >
          <span>Iniciar Compra</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </main>
  </div>
</template>
