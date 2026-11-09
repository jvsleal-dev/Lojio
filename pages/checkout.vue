<script setup lang="ts">
import { useCart } from '~/composables/useCart'

const route = useRoute()
const tenantQuery = computed(() => (route.query.tenant as string) || '')

const { items, subtotal, clearCart } = useCart()
const { data: storeData } = await useFetch<any>('/api/store/info', {
  query: { tenant: tenantQuery },
})
const store = computed<any>(() => storeData.value?.store)

// Step State: 'entrega' (Passo 2) ou 'pagamento' (Passo 3)
const currentStep = ref<'entrega' | 'pagamento'>('entrega')

// Top Urgency Bar Timer (Aproveite antes que acabe! 00 : 00 : 04 : 56)
const timeLeft = ref({
  hours: 0,
  minutes: 4,
  seconds: 56,
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

// Customer & Shipping Form
const form = ref({
  customerEmail: 'joaovitorleal146@gmail.com',
  newsletter: false,
  customerName: 'joao vitor',
  customerLastName: 'leal',
  customerPhone: '(85) 99699-1441',
  customerDocument: '',
  shippingAddress: {
    zipcode: '62700000',
    city: 'Canindé',
    state: 'CE',
    street: 'awigmre',
    number: '435',
    complement: 'aoibmtiobtr',
    neighborhood: 'sjv fjb g',
  },
  sameInvoiceAddress: true,
  shippingService: 'Frete Grátis - J&T Express',
  shippingCost: 0,
  paymentMethod: 'credit_card', // 'credit_card' | 'pix' | 'boleto' | 'pagaleve'
  additionalNotes: '',
})

// Shipping options
const shippingOptions = ref([
  { id: 'jt', name: 'Frete Grátis - J&T Express', days: 'Chega em 17 dias úteis', price: 0, label: 'Grátis' },
  { id: 'loggi', name: 'Frete Fixo - Loggi', days: 'Chega em 16 dias úteis', price: 19.90, label: 'R$19,90' },
  { id: 'sedex', name: 'Expresso - Correios Sedex', days: 'Chega em 8 dias úteis', price: 24.90, label: 'R$24,90' },
])

// Upsell / Quem viu também comprou (Image 3)
const crossSellItems = ref([
  { id: 'cs-1', name: 'Caixa de Presente Especial (Relógio)', price: 14.90, added: false },
  { id: 'cs-2', name: 'Sacola para Presente', price: 8.90, added: false },
])

const toggleCrossSell = (item: any) => {
  item.added = !item.added
}

const crossSellTotal = computed(() => {
  return crossSellItems.value
    .filter((i) => i.added)
    .reduce((acc, curr) => acc + curr.price, 0)
})

// Coupon
const showCouponInput = ref(false)
const couponCodeInput = ref('')
const couponDiscount = ref(0)
const appliedCoupon = ref('')

const applyCoupon = () => {
  if (couponCodeInput.value.trim().toUpperCase() === 'DESCONTO10') {
    couponDiscount.value = subtotal.value * 0.1
    appliedCoupon.value = 'DESCONTO10'
  }
}

// Total Calculation
const grandTotal = computed(() => {
  return Math.max(0, subtotal.value + form.value.shippingCost + crossSellTotal.value - couponDiscount.value)
})

// Edit Zipcode modal/toggle
const isEditingCep = ref(false)
const showMoreShipping = ref(false)
const isAddingNotes = ref(false)

// Order placement & processing
const loading = ref(false)
const errorMsg = ref('')
const createdOrder = ref<any>(null)
const pixCopied = ref(false)

const proceedToPayment = () => {
  currentStep.value = 'pagamento'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const submitOrder = async () => {
  errorMsg.value = ''
  loading.value = true

  try {
    const payload = {
      customerName: `${form.value.customerName} ${form.value.customerLastName}`.trim(),
      customerEmail: form.value.customerEmail,
      customerPhone: form.value.customerPhone,
      customerDocument: form.value.customerDocument || '000.000.000-00',
      shippingAddress: form.value.shippingAddress,
      shippingService: form.value.shippingService,
      shippingCost: form.value.shippingCost,
      paymentMethod: form.value.paymentMethod === 'credit_card' ? 'credit_card' : 'pix',
      couponCode: appliedCoupon.value || undefined,
      items: items.value.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: i.quantity,
      })),
    }

    const res: any = await $fetch('/api/store/checkout', {
      method: 'POST',
      body: payload,
      query: { tenant: tenantQuery.value },
    })

    createdOrder.value = res
    clearCart()
  } catch (err: any) {
    errorMsg.value = err.data?.statusMessage || 'Erro ao processar pedido. Tente novamente.'
  } finally {
    loading.value = false
  }
}

const copyPix = () => {
  if (createdOrder.value?.payment?.qrCode) {
    navigator.clipboard.writeText(createdOrder.value.payment.qrCode)
    pixCopied.value = true
    setTimeout(() => {
      pixCopied.value = false
    }, 3000)
  }
}
</script>

<template>
  <div class="min-h-screen bg-white text-black flex flex-col font-sans selection:bg-black selection:text-white">
    <!-- Brand Top Navbar (Centered uppercase clean logo) -->
    <header class="py-5 border-b border-slate-100 bg-white">
      <div class="max-w-5xl mx-auto px-4 text-center">
        <NuxtLink :to="tenantQuery ? `/?tenant=${tenantQuery}` : '/'" class="inline-block">
          <h1 class="text-xl sm:text-2xl font-black uppercase tracking-[0.25em] text-black">
            {{ store?.name || 'SAINT GERMAIN' }}
          </h1>
        </NuxtLink>
      </div>
    </header>

    <!-- Urgency Top Banner with Timer (Exact Images 2 and 3) -->
    <div class="bg-black text-white py-2.5 px-4">
      <div class="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-center text-xs">
        <span class="font-extrabold tracking-wide text-xs">Aproveite antes que acabe!</span>
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-1 text-[11px] text-slate-300">
            <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Oferta termina em:</span>
          </div>
          <div class="flex items-center gap-1 font-mono font-black text-sm">
            <span>00</span>
            <span class="text-[9px] font-sans text-slate-400">Dia(s)</span>
            <span>:</span>
            <span>{{ pad(timeLeft.hours) }}</span>
            <span class="text-[9px] font-sans text-slate-400">Hora(s)</span>
            <span>:</span>
            <span>{{ pad(timeLeft.minutes) }}</span>
            <span class="text-[9px] font-sans text-slate-400">Min(s)</span>
            <span>:</span>
            <span>{{ pad(timeLeft.seconds) }}</span>
            <span class="text-[9px] font-sans text-slate-400">Seg(s)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Stepper (Carrinho -> Entrega -> Pagamento) (Images 2 and 3) -->
    <div class="border-b border-slate-200 py-4 bg-white">
      <div class="max-w-md mx-auto px-4">
        <div class="flex items-center justify-between text-xs text-slate-600">
          <!-- Step 1: Carrinho -->
          <NuxtLink :to="`/carrinho${tenantQuery ? `?tenant=${tenantQuery}` : ''}`" class="flex flex-col items-center gap-1 group">
            <div class="w-6 h-6 rounded-full border border-slate-400 flex items-center justify-center text-slate-700 group-hover:border-black">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span class="text-[11px] font-medium text-slate-600">Carrinho</span>
          </NuxtLink>

          <div class="flex-1 h-px bg-slate-300 mx-3"></div>

          <!-- Step 2: Entrega -->
          <button
            @click="currentStep = 'entrega'"
            class="flex flex-col items-center gap-1"
          >
            <div
              class="w-6 h-6 rounded-full border flex items-center justify-center transition"
              :class="currentStep === 'entrega' ? 'border-black text-black ring-2 ring-slate-100' : 'border-slate-400 text-slate-700'"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span
              class="text-[11px] transition"
              :class="currentStep === 'entrega' ? 'font-black text-black' : 'font-medium text-slate-600'"
            >
              Entrega
            </span>
          </button>

          <div class="flex-1 h-px bg-slate-300 mx-3"></div>

          <!-- Step 3: Pagamento -->
          <button
            @click="currentStep = 'pagamento'"
            class="flex flex-col items-center gap-1"
          >
            <div
              class="w-6 h-6 rounded-full border flex items-center justify-center transition"
              :class="currentStep === 'pagamento' ? 'border-black text-black ring-2 ring-slate-100' : 'border-slate-300 text-slate-400'"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <span
              class="text-[11px] transition"
              :class="currentStep === 'pagamento' ? 'font-black text-black' : 'font-medium text-slate-400'"
            >
              Pagamento
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Success Screen (Pedido Confirmado) -->
    <main v-if="createdOrder" class="flex-1 max-w-xl w-full mx-auto px-4 py-12">
      <div class="p-8 border border-slate-200 rounded-2xl bg-white text-center space-y-6 shadow-sm">
        <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-black text-black">Pedido Confirmado!</h2>
          <p class="text-xs text-slate-600 mt-1">
            Pedido #{{ createdOrder?.order?.orderNumber }} registrado com sucesso.
          </p>
        </div>

        <!-- PIX QR Code if PIX -->
        <div v-if="createdOrder?.payment?.qrCode" class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <p class="text-xs font-bold text-black uppercase">Pague via Pix Copia e Cola</p>
          <img
            :src="`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(createdOrder.payment.qrCode)}`"
            alt="PIX QR"
            class="w-40 h-40 mx-auto rounded-lg border border-slate-200"
          />
          <button
            @click="copyPix"
            class="w-full bg-black hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-lg text-xs"
          >
            {{ pixCopied ? 'Código Pix Copiado!' : 'Copiar Chave Pix' }}
          </button>
        </div>

        <NuxtLink
          :to="tenantQuery ? `/?tenant=${tenantQuery}` : '/'"
          class="inline-block px-6 py-3 bg-black text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition"
        >
          Voltar à Loja
        </NuxtLink>
      </div>
    </main>

    <!-- Main Checkout Form Area (Grid Left Form, Right Order Summary) -->
    <main v-else class="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <!-- LEFT COLUMN: Forms -->
        <div class="lg:col-span-7 space-y-8">
          <!-- ============================================== -->
          <!-- PASSO 2: ENTREGA (Exatamente como a Imagem 2) -->
          <!-- ============================================== -->
          <div v-if="currentStep === 'entrega'" class="space-y-6">
            <!-- 1. DADOS DE CONTATO -->
            <section class="space-y-3">
              <h2 class="text-xs font-bold uppercase tracking-wider text-black">
                Dados de Contato
              </h2>
              <div>
                <input
                  v-model="form.customerEmail"
                  type="email"
                  placeholder="E-mail"
                  class="w-full border border-slate-400 rounded-none px-3.5 py-3 text-xs text-black placeholder:text-slate-400 focus:outline-none focus:border-black"
                />
              </div>
              <label class="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  v-model="form.newsletter"
                  class="rounded-none border-slate-400 text-black focus:ring-black"
                />
                <span>Receber ofertas e novidades por e-mail</span>
              </label>
            </section>

            <!-- 2. ENTREGA (Opção de Frete) -->
            <section class="space-y-3 pt-2">
              <h2 class="text-xs font-bold uppercase tracking-wider text-black">
                Entrega
              </h2>
              <div class="border border-slate-300 rounded-none divide-y divide-slate-200">
                <label
                  v-for="opt in (showMoreShipping ? shippingOptions : shippingOptions.slice(0, 1))"
                  :key="opt.id"
                  class="flex items-center justify-between p-3.5 cursor-pointer bg-slate-50/50 hover:bg-slate-100 transition"
                >
                  <div class="flex items-start gap-2.5">
                    <input
                      type="radio"
                      :value="opt.name"
                      v-model="form.shippingService"
                      @change="form.shippingCost = opt.price"
                      class="mt-0.5 text-black focus:ring-black"
                    />
                    <div>
                      <p class="text-xs font-medium text-black">{{ opt.name }}</p>
                      <p class="text-[11px] text-slate-500">{{ opt.days }}</p>
                    </div>
                  </div>
                  <span class="text-xs font-medium text-black">{{ opt.label }}</span>
                </label>
              </div>

              <div class="text-center pt-1">
                <button
                  type="button"
                  @click="showMoreShipping = !showMoreShipping"
                  class="text-xs text-slate-800 hover:text-black font-medium flex items-center justify-center gap-1 mx-auto"
                >
                  <span>{{ showMoreShipping ? 'Menos opções' : 'Mais opções' }}</span>
                  <svg
                    class="w-3.5 h-3.5 transition-transform"
                    :class="{ 'rotate-180': showMoreShipping }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </section>

            <!-- 3. DADOS PARA ENTREGA -->
            <section class="space-y-3 pt-2">
              <h2 class="text-xs font-bold uppercase tracking-wider text-black">
                Dados para Entrega
              </h2>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    v-model="form.customerName"
                    type="text"
                    placeholder="Nome"
                    class="w-full border border-slate-400 rounded-none px-3.5 py-3 text-xs text-black placeholder:text-slate-400 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <input
                    v-model="form.customerLastName"
                    type="text"
                    placeholder="Sobrenome"
                    class="w-full border border-slate-400 rounded-none px-3.5 py-3 text-xs text-black placeholder:text-slate-400 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <input
                  v-model="form.customerPhone"
                  type="text"
                  placeholder="Telefone com DDD"
                  class="w-full border border-slate-400 rounded-none px-3.5 py-3 text-xs text-black placeholder:text-slate-400 focus:outline-none focus:border-black"
                />
              </div>

              <!-- CEP Card with Icon (Image 2 exact style) -->
              <div class="border border-slate-400 rounded-none p-3.5 flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <div class="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shrink-0">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs font-bold text-black">CEP {{ form.shippingAddress.zipcode }}</p>
                    <p class="text-[11px] text-slate-600">{{ form.shippingAddress.city }} - {{ form.shippingAddress.state }}</p>
                  </div>
                </div>
                <button
                  type="button"
                  @click="isEditingCep = !isEditingCep"
                  class="text-xs text-black underline font-medium hover:text-emerald-700"
                >
                  Alterar
                </button>
              </div>

              <div v-if="isEditingCep" class="flex gap-2">
                <input
                  v-model="form.shippingAddress.zipcode"
                  type="text"
                  placeholder="Novo CEP"
                  class="flex-1 border border-slate-400 px-3 py-2 text-xs"
                />
                <button
                  type="button"
                  @click="isEditingCep = false"
                  class="bg-black text-white px-4 py-2 text-xs font-bold"
                >
                  Confirmar
                </button>
              </div>

              <div>
                <input
                  v-model="form.shippingAddress.street"
                  type="text"
                  placeholder="Endereço"
                  class="w-full border border-slate-400 rounded-none px-3.5 py-3 text-xs text-black placeholder:text-slate-400 focus:outline-none focus:border-black"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <input
                    v-model="form.shippingAddress.number"
                    type="text"
                    placeholder="Número"
                    class="w-full border border-slate-400 rounded-none px-3.5 py-3 text-xs text-black placeholder:text-slate-400 focus:outline-none focus:border-black"
                  />
                </div>
                <div class="sm:col-span-2">
                  <input
                    v-model="form.shippingAddress.complement"
                    type="text"
                    placeholder="Apto, Bloco, Referência, etc. (opcional)"
                    class="w-full border border-slate-400 rounded-none px-3.5 py-3 text-xs text-black placeholder:text-slate-400 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <input
                  v-model="form.shippingAddress.neighborhood"
                  type="text"
                  placeholder="Bairro"
                  class="w-full border border-slate-400 rounded-none px-3.5 py-3 text-xs text-black placeholder:text-slate-400 focus:outline-none focus:border-black"
                />
              </div>
            </section>

            <!-- 4. DADOS PARA NOTA FISCAL -->
            <section class="space-y-3 pt-2">
              <div class="flex items-center gap-1.5">
                <h2 class="text-xs font-bold uppercase tracking-wider text-black">
                  Dados para Nota Fiscal
                </h2>
                <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <div>
                <input
                  v-model="form.customerDocument"
                  type="text"
                  placeholder="CPF ou CNPJ"
                  class="w-full border border-slate-400 rounded-none px-3.5 py-3 text-xs text-black placeholder:text-slate-400 focus:outline-none focus:border-black"
                />
              </div>

              <label class="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  v-model="form.sameInvoiceAddress"
                  class="rounded-none border-slate-400 text-black focus:ring-black"
                />
                <span>Usar as mesmas informações da entrega</span>
              </label>
            </section>

            <!-- Botão Continuar para Pagamento -->
            <div class="pt-4">
              <button
                type="button"
                @click="proceedToPayment"
                class="w-full bg-black hover:bg-slate-900 text-white font-bold py-4 px-6 text-xs sm:text-sm uppercase tracking-wider transition shadow-sm cursor-pointer"
              >
                Continuar para pagamento
              </button>
            </div>
          </div>

          <!-- ============================================== -->
          <!-- PASSO 3: PAGAMENTO (Exatamente como a Imagem 3) -->
          <!-- ============================================== -->
          <div v-else class="space-y-6">
            <!-- Review Summary Contact & Delivery Info Cards -->
            <div class="border border-slate-200 rounded-none divide-y divide-slate-200 text-xs">
              <!-- Contact Review -->
              <div class="p-3.5 flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <div class="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shrink-0">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span class="text-black">{{ form.customerEmail }}</span>
                </div>
                <button
                  type="button"
                  @click="currentStep = 'entrega'"
                  class="text-black underline font-medium hover:text-emerald-700"
                >
                  Alterar
                </button>
              </div>

              <!-- Address Review -->
              <div class="p-3.5 flex items-center justify-between">
                <div class="flex items-start gap-2.5">
                  <div class="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-black">{{ form.shippingAddress.street }} {{ form.shippingAddress.number }}, {{ form.shippingAddress.complement }}</p>
                    <p class="text-slate-600">CEP {{ form.shippingAddress.zipcode }} - {{ form.shippingAddress.neighborhood }}</p>
                    <p class="text-slate-600">{{ form.shippingAddress.city }} - {{ form.customerPhone }}</p>
                  </div>
                </div>
                <button
                  type="button"
                  @click="currentStep = 'entrega'"
                  class="text-black underline font-medium hover:text-emerald-700"
                >
                  Alterar
                </button>
              </div>

              <!-- Shipping Method Review -->
              <div class="p-3.5 flex items-center justify-between">
                <div class="flex items-start gap-2.5">
                  <div class="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-black font-medium">{{ form.shippingService }} - Grátis</p>
                    <p class="text-slate-500">Chega em 17 dias úteis</p>
                  </div>
                </div>
                <button
                  type="button"
                  @click="currentStep = 'entrega'"
                  class="text-black underline font-medium hover:text-emerald-700"
                >
                  Alterar
                </button>
              </div>
            </div>

            <!-- Comentários adicionais -->
            <div class="flex items-center justify-between text-xs py-1">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span class="font-medium text-black">Comentários adicionais</span>
              </div>
              <button
                type="button"
                @click="isAddingNotes = !isAddingNotes"
                class="text-black underline font-medium"
              >
                {{ isAddingNotes ? 'Fechar' : 'Adicionar' }}
              </button>
            </div>
            <div v-if="isAddingNotes">
              <textarea
                v-model="form.additionalNotes"
                rows="2"
                placeholder="Instruções de entrega ou observações"
                class="w-full border border-slate-300 p-2.5 text-xs text-black"
              ></textarea>
            </div>

            <!-- Quem viu também comprou (Upsell Slider da Imagem 3) -->
            <div class="space-y-3 pt-2">
              <h3 class="text-xs font-bold text-black uppercase tracking-wider">
                Quem viu também comprou
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  v-for="cs in crossSellItems"
                  :key="cs.id"
                  class="border border-slate-200 p-3 flex items-center justify-between gap-3 bg-white hover:border-slate-400 transition"
                >
                  <div class="w-12 h-12 bg-black rounded-sm flex items-center justify-center shrink-0 text-white">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-[11px] font-medium text-black truncate">{{ cs.name }}</p>
                    <p class="text-xs font-black text-black">R$ {{ cs.price.toFixed(2).replace('.', ',') }}</p>
                  </div>
                  <button
                    type="button"
                    @click="toggleCrossSell(cs)"
                    class="px-3 py-1.5 rounded-none text-[11px] font-bold uppercase transition"
                    :class="cs.added ? 'bg-emerald-600 text-white' : 'bg-black text-white hover:bg-slate-800'"
                  >
                    {{ cs.added ? 'Adicionado' : 'Adicionar' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- FORMA DE PAGAMENTO (Cards da Imagem 3) -->
            <section class="space-y-3 pt-4">
              <h3 class="text-xs font-bold uppercase tracking-wider text-black">
                Forma de Pagamento
              </h3>

              <div class="space-y-2">
                <!-- 1. Cartão de Crédito -->
                <label
                  class="flex items-center justify-between p-4 border cursor-pointer transition bg-slate-50/50 hover:bg-slate-100"
                  :class="form.paymentMethod === 'credit_card' ? 'border-black ring-1 ring-black' : 'border-slate-200'"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shrink-0">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <span class="text-xs font-bold text-black">Cartão de crédito</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="bg-black text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-none">
                      Até 6 parcelas sem juros
                    </span>
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </label>

                <!-- 2. Pix -->
                <label
                  class="flex items-center justify-between p-4 border cursor-pointer transition bg-slate-50/50 hover:bg-slate-100"
                  :class="form.paymentMethod === 'pix' ? 'border-black ring-1 ring-black' : 'border-slate-200'"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center shrink-0">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span class="text-xs font-bold text-black">Pix</span>
                  </div>
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </label>

                <!-- 3. Boleto bancário -->
                <label
                  class="flex items-center justify-between p-4 border cursor-pointer transition bg-slate-50/50 hover:bg-slate-100"
                  :class="form.paymentMethod === 'boleto' ? 'border-black ring-1 ring-black' : 'border-slate-200'"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center shrink-0">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span class="text-xs font-bold text-black">Boleto bancário</span>
                  </div>
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </label>

                <!-- 4. Pix 4x sem juros Pagaleve -->
                <label
                  class="flex items-center justify-between p-4 border cursor-pointer transition bg-slate-50/50 hover:bg-slate-100"
                  :class="form.paymentMethod === 'pagaleve' ? 'border-black ring-1 ring-black' : 'border-slate-200'"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-700 text-white flex items-center justify-center shrink-0">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-xs font-bold text-black">Pix 4x sem juros</p>
                      <p class="text-[10px] text-pink-600 font-extrabold flex items-center gap-1">
                        <span>pagaleve</span>
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="bg-black text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-none">
                      Pagaleve Pix parcelado com 2% de cashback
                    </span>
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </label>
              </div>
            </section>

            <!-- Nuvem/Fast Checkout Salvar Dados Box (Image 3) -->
            <div class="border border-slate-300 rounded-none p-4 space-y-2 bg-white">
              <div class="flex items-center justify-between">
                <label class="flex items-center gap-2 cursor-pointer text-xs font-bold text-black">
                  <input type="checkbox" checked class="text-black focus:ring-black" />
                  <span>Salvar dados para <strong>comprar mais rápido</strong></span>
                </label>
                <div class="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                  <div class="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[9px]">N</div>
                  <span>nuvem</span>
                </div>
              </div>
              <p class="text-[11px] text-slate-600">
                Nas próximas compras enviaremos um código para: <strong>{{ form.customerPhone }}</strong>
                <button type="button" class="underline ml-1 text-black font-semibold">Alterar</button>
              </p>
              <p class="text-[10px] text-slate-400 pt-1">
                Ao salvar, você aceita os Termos de uso e Política de Privacidade.
              </p>
            </div>

            <!-- Botão Fazer Pedido (Image 3 style) -->
            <div class="pt-2">
              <button
                type="button"
                @click="submitOrder"
                :disabled="loading"
                class="w-full bg-black hover:bg-slate-900 text-white font-extrabold py-4 px-6 text-sm uppercase tracking-wider transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                <span v-if="loading">Processando pedido...</span>
                <span v-else>Fazer pedido</span>
              </button>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: Order Summary (Images 2 and 3) -->
        <div class="lg:col-span-5">
          <div class="sticky top-10 border border-slate-200 p-6 space-y-6 bg-white">
            <!-- Product Item Row -->
            <div class="space-y-4">
              <div
                v-for="item in items"
                :key="item.productId + (item.variantId || '')"
                class="flex items-start gap-4 pb-4 border-b border-slate-100"
              >
                <!-- Watch / Product Thumbnail Image -->
                <div class="w-14 h-16 bg-slate-50 border border-slate-100 p-1 flex items-center justify-center shrink-0">
                  <img
                    :src="item.imageUrl || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300'"
                    :alt="item.name"
                    class="w-full h-full object-contain"
                  />
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <p class="text-xs font-medium text-black leading-snug line-clamp-2">{{ item.name }}</p>
                      <p class="text-[11px] text-slate-500 mt-0.5">Qtd: {{ item.quantity }}</p>
                    </div>
                    <div class="text-right shrink-0">
                      <span class="block text-[10px] text-slate-400 line-through">R$ {{ (item.price * item.quantity * 2).toFixed(2).replace('.', ',') }}</span>
                      <span class="text-xs font-black text-black">R$ {{ (item.price * item.quantity).toFixed(2).replace('.', ',') }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Price Breakdown -->
            <div class="space-y-2 text-xs">
              <div class="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span class="font-bold text-black">R${{ subtotal.toFixed(2).replace('.', ',') }}</span>
              </div>
              <div class="flex justify-between text-slate-600">
                <span>Custo de frete</span>
                <span class="font-bold text-black">
                  {{ form.shippingCost === 0 ? 'Grátis' : `R$ ${form.shippingCost.toFixed(2).replace('.', ',')}` }}
                </span>
              </div>
              <div v-if="crossSellTotal > 0" class="flex justify-between text-slate-600">
                <span>Embalagem Especial</span>
                <span class="font-bold text-black">R$ {{ crossSellTotal.toFixed(2).replace('.', ',') }}</span>
              </div>
              <div v-if="couponDiscount > 0" class="flex justify-between text-emerald-700 font-bold">
                <span>Desconto Cupom</span>
                <span>- R$ {{ couponDiscount.toFixed(2).replace('.', ',') }}</span>
              </div>
              <div class="flex justify-between text-base font-black text-black pt-3 border-t border-slate-200">
                <span>Total</span>
                <span>R${{ grandTotal.toFixed(2).replace('.', ',') }}</span>
              </div>
            </div>

            <!-- Adicionar Cupom Link -->
            <div class="pt-2">
              <button
                type="button"
                @click="showCouponInput = !showCouponInput"
                class="text-xs text-black underline font-semibold hover:text-emerald-700"
              >
                Adicionar cupom de desconto
              </button>

              <div v-if="showCouponInput" class="flex gap-2 mt-3">
                <input
                  v-model="couponCodeInput"
                  type="text"
                  placeholder="Código do cupom"
                  class="flex-1 border border-slate-400 p-2 text-xs uppercase"
                />
                <button
                  type="button"
                  @click="applyCoupon"
                  class="bg-black text-white px-4 text-xs font-bold hover:bg-slate-800"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
