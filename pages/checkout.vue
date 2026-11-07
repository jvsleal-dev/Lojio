<script setup lang="ts">
import { useCart } from '~/composables/useCart'

const route = useRoute()
const tenantQuery = computed(() => (route.query.tenant as string) || '')

const { items, subtotal, clearCart } = useCart()
const { data: storeData } = await useFetch<any>('/api/store/info', {
  query: { tenant: tenantQuery },
})
const store = computed<any>(() => storeData.value?.store)

const form = ref({
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  customerDocument: '',
  shippingAddress: {
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipcode: '',
  },
  shippingService: 'SEDEX - Expresso',
  shippingCost: 24.50,
  paymentMethod: 'pix',
})

const shippingOptions = ref([
  { id: 'sedex', name: 'SEDEX - Expresso Prioritário', price: 24.50, days: 2 },
  { id: 'pac', name: 'PAC - Correios Econômico', price: 16.90, days: 5 },
])

const loading = ref(false)
const cepLoading = ref(false)
const errorMsg = ref('')
const createdOrder = ref<any>(null)
const pixCopied = ref(false)

// Card State
const cardForm = ref({
  cardNumber: '',
  cardHolder: '',
  cardExpiry: '',
  cardCvv: '',
  installments: 1,
})

const cardBrand = computed(() => {
  const num = cardForm.value.cardNumber.replace(/\D/g, '')
  if (num.startsWith('4')) return 'Visa'
  if (num.startsWith('5')) return 'Mastercard'
  if (num.startsWith('6')) return 'Elo'
  if (num.startsWith('3')) return 'Amex'
  return 'Cartão'
})

const formatCardNumber = (e: any) => {
  let val = e.target.value.replace(/\D/g, '').substring(0, 16)
  val = val.replace(/(\d{4})/g, '$1 ').trim()
  cardForm.value.cardNumber = val
}

const formatCardExpiry = (e: any) => {
  let val = e.target.value.replace(/\D/g, '').substring(0, 4)
  if (val.length >= 2) {
    val = val.substring(0, 2) + '/' + val.substring(2)
  }
  cardForm.value.cardExpiry = val
}

const couponCodeInput = ref('')
const couponLoading = ref(false)
const couponError = ref('')
const appliedCoupon = ref<{
  code: string
  discountAmount: number
  discountType: string
  discountValue: number
} | null>(null)

const discountAmount = computed(() => appliedCoupon.value?.discountAmount || 0)

const applyCoupon = async () => {
  if (!couponCodeInput.value.trim()) return
  couponLoading.value = true
  couponError.value = ''
  try {
    const res: any = await $fetch('/api/store/coupons/validate', {
      method: 'POST',
      body: {
        code: couponCodeInput.value.trim(),
        cartSubtotal: subtotal.value,
      }
    })
    appliedCoupon.value = {
      code: res.coupon.code,
      discountAmount: res.discountAmount,
      discountType: res.coupon.discountType,
      discountValue: res.coupon.discountValue,
    }
  } catch (err: any) {
    couponError.value = err?.data?.message || 'Cupom inválido ou expirado'
  } finally {
    couponLoading.value = false
  }
}

const removeCoupon = () => {
  appliedCoupon.value = null
  couponCodeInput.value = ''
  couponError.value = ''
}

const handleCepBlur = async () => {
  const cleanZip = form.value.shippingAddress.zipcode.replace(/\D/g, '')
  if (cleanZip.length === 8) {
    cepLoading.value = true
    try {
      const [viaCepRes, shippingRes]: [any, any] = await Promise.all([
        $fetch(`https://viacep.com.br/ws/${cleanZip}/json/`).catch(() => null),
        $fetch('/api/store/shipping/calculate', {
          method: 'POST',
          body: { zipcode: cleanZip },
          query: { tenant: tenantQuery.value },
        }).catch(() => null),
      ])

      if (viaCepRes && !viaCepRes.erro) {
        form.value.shippingAddress.street = viaCepRes.logradouro || form.value.shippingAddress.street
        form.value.shippingAddress.neighborhood = viaCepRes.bairro || form.value.shippingAddress.neighborhood
        form.value.shippingAddress.city = viaCepRes.localidade || form.value.shippingAddress.city
        form.value.shippingAddress.state = viaCepRes.uf || form.value.shippingAddress.state
      }

      if (shippingRes?.rates && shippingRes.rates.length > 0) {
        shippingOptions.value = shippingRes.rates.map((r: any) => ({
          id: r.id,
          name: r.name,
          price: r.price,
          days: r.deliveryTimeDays,
        }))
        const currentMatch = shippingOptions.value.find((o) => o.name === form.value.shippingService)
        if (currentMatch) {
          form.value.shippingCost = currentMatch.price
        } else if (shippingOptions.value[0]) {
          form.value.shippingService = shippingOptions.value[0].name
          form.value.shippingCost = shippingOptions.value[0].price
        }
      }
    } catch {}
    cepLoading.value = false
  }
}

const totalOrder = computed(() => {
  const tot = subtotal.value - discountAmount.value + form.value.shippingCost
  return Number(Math.max(0, tot).toFixed(2))
})

const installmentOptions = computed(() => {
  const tot = totalOrder.value
  const list = []
  for (let i = 1; i <= 12; i++) {
    const val = (tot / i).toFixed(2).replace('.', ',')
    list.push({
      count: i,
      label: `${i}x de R$ ${val} sem juros`,
    })
  }
  return list
})

const submitOrder = async () => {
  if (!items.value.length) {
    errorMsg.value = 'Seu carrinho está vazio.'
    return
  }

  if (
    !form.value.customerName ||
    !form.value.customerEmail ||
    !form.value.customerPhone ||
    !form.value.customerDocument ||
    !form.value.shippingAddress.zipcode ||
    !form.value.shippingAddress.number
  ) {
    errorMsg.value = 'Preencha todos os campos obrigatórios.'
    return
  }

  if (form.value.paymentMethod === 'credit_card') {
    if (!cardForm.value.cardNumber || !cardForm.value.cardHolder || !cardForm.value.cardExpiry || !cardForm.value.cardCvv) {
      errorMsg.value = 'Preencha todos os campos do cartão de crédito.'
      return
    }
  }

  errorMsg.value = ''
  loading.value = true

  try {
    const payload = {
      customerName: form.value.customerName,
      customerEmail: form.value.customerEmail,
      customerPhone: form.value.customerPhone,
      customerDocument: form.value.customerDocument,
      shippingAddress: form.value.shippingAddress,
      shippingService: form.value.shippingService,
      shippingCost: form.value.shippingCost,
      paymentMethod: form.value.paymentMethod,
      couponCode: appliedCoupon.value?.code || undefined,
      cardDetails: form.value.paymentMethod === 'credit_card' ? cardForm.value : undefined,
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

    // Se selecionou Pix, inicia polling automático do status de pagamento em tempo real
    if (res.order?.paymentMethod === 'pix' && res.order?.paymentStatus !== 'paid') {
      startPollingOrderStatus(res.order.orderNumber)
    }

    // Se selecionou WhatsApp, abre a conversa automaticamente
    if (form.value.paymentMethod === 'whatsapp' && res.whatsappLink) {
      window.open(res.whatsappLink, '_blank')
    }
  } catch (err: any) {
    errorMsg.value = err.data?.statusMessage || 'Erro ao processar o pedido. Tente novamente.'
  } finally {
    loading.value = false
  }
}

let pollInterval: any = null

const startPollingOrderStatus = (orderNumber: string) => {
  if (pollInterval) clearInterval(pollInterval)
  pollInterval = setInterval(async () => {
    try {
      const activeTenant = route.query.tenant ? `?tenant=${route.query.tenant}` : ''
      const res: any = await $fetch(`/api/store/orders/${orderNumber}${activeTenant}`)
      if (res?.order?.paymentStatus === 'paid') {
        if (createdOrder.value?.order) {
          createdOrder.value.order.paymentStatus = 'paid'
        }
        clearInterval(pollInterval)
      }
    } catch {}
  }, 3000)
}

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})

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
  <div class="min-h-screen bg-slate-50 flex flex-col">
    <!-- Simplified Checkout Header -->
    <header class="bg-white border-b border-slate-200 py-5">
      <div class="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <NuxtLink :to="tenantQuery ? `/?tenant=${tenantQuery}` : '/'" class="flex items-center gap-2">
          <span class="font-extrabold text-xl text-slate-900 tracking-tight">
            {{ store?.name || 'Checkout Seguro' }}
          </span>
        </NuxtLink>
        <div class="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Ambiente Criptografado & Seguro</span>
        </div>
      </div>
    </header>

    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Success Screen -->
      <div v-if="createdOrder" class="max-w-xl mx-auto py-6">
        <div class="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-2xl space-y-6 text-center relative overflow-hidden">
          <!-- Ambient subtle green accent -->
          <div class="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div>
            <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Pedido confirmado!
            </h2>
            <p class="text-sm text-slate-500 mt-1 font-medium">
              <span v-if="createdOrder?.order?.paymentMethod === 'pix'" :class="createdOrder?.order?.paymentStatus === 'paid' ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'">
                {{ createdOrder?.order?.paymentStatus === 'paid' ? 'Pagamento aprovado via Pix' : 'Aguardando pagamento via Pix' }}
              </span>
              <span v-else-if="createdOrder?.order?.paymentMethod === 'credit_card'" class="text-blue-600 font-bold">
                Pagamento aprovado no Cartão de Crédito
              </span>
              <span v-else class="text-emerald-600 font-bold">
                Pedido recebido! Continue o atendimento no WhatsApp
              </span>
            </p>
          </div>

          <!-- Offstore Item Card Preview -->
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-left shadow-sm">
            <div class="flex items-center space-x-3.5">
              <div class="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden text-slate-600">
                <svg class="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <p class="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">
                  Pedido #{{ createdOrder?.order?.orderNumber }}
                </p>
                <p class="text-xs text-slate-500 font-medium mt-0.5">
                  {{ createdOrder?.order?.items?.length || 1 }} {{ createdOrder?.order?.items?.length === 1 ? 'item' : 'itens' }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <span class="text-base sm:text-lg font-black text-slate-900">
                R$ {{ Number(createdOrder?.order?.total || 0).toFixed(2).replace('.', ',') }}
              </span>
            </div>
          </div>

          <!-- PIX Approved State Banner -->
          <div v-if="createdOrder?.order?.paymentMethod === 'pix' && createdOrder?.order?.paymentStatus === 'paid'" class="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
            <div class="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="text-base font-extrabold text-emerald-900">Pagamento Pix Confirmado com Sucesso!</h3>
            <p class="text-xs text-emerald-700">Identificamos o seu pagamento no Mercado Pago. O lojista já foi notificado e seu pedido está sendo preparado.</p>
          </div>

          <!-- PIX Box if method is pix and not paid yet -->
          <div v-else-if="createdOrder?.order?.paymentMethod === 'pix' && createdOrder?.payment?.qrCode" class="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-center">
            <div class="flex items-center justify-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Aguardando Pagamento Pix (Confirmação Automática)
              </span>
            </div>
            <div class="p-3 bg-white rounded-2xl inline-block shadow-sm border border-slate-200">
              <img
                :src="createdOrder?.payment?.qrCodeBase64 ? `data:image/png;base64,${createdOrder.payment.qrCodeBase64}` : `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(createdOrder?.payment?.qrCode || '')}`"
                alt="QR Code PIX Mercado Pago"
                class="w-44 h-44 mx-auto rounded-xl"
              />
            </div>
            <div class="space-y-2">
              <input
                type="text"
                readonly
                :value="createdOrder?.payment?.qrCode || ''"
                class="w-full bg-white border border-slate-200 text-xs px-3 py-2.5 rounded-xl text-slate-600 font-mono text-center select-all focus:ring-2 focus:ring-blue-500"
              />
              <button
                @click="copyPix"
                class="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <svg v-if="pixCopied" class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <svg v-else class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>{{ pixCopied ? 'Código PIX Copiado com Sucesso!' : 'Copiar Código PIX (Copia e Cola)' }}</span>
              </button>
            </div>
            <p class="text-[11px] text-slate-500 flex items-center justify-center gap-1.5 pt-1">
              <svg class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Abra o app do seu banco, escolha Pix e leia o QR Code ou cole o código acima.</span>
            </p>
          </div>

          <!-- WhatsApp Button (Prominent for WhatsApp payment, helper for other methods) -->
          <a
            v-if="createdOrder?.whatsappLink"
            :href="createdOrder.whatsappLink"
            target="_blank"
            class="w-full font-extrabold py-3.5 px-6 rounded-2xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 hover:scale-[1.01] active:scale-[0.99]"
            :class="createdOrder?.order?.paymentMethod === 'whatsapp' ? 'bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-emerald-500/25' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'"
          >
            <!-- WhatsApp SVG Icon -->
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>{{ createdOrder?.order?.paymentMethod === 'whatsapp' ? 'Enviar pedido via WhatsApp' : 'Falar com Atendente sobre este Pedido' }}</span>
          </a>

          <!-- Secondary Links -->
          <div class="flex flex-col sm:flex-row gap-3 pt-2">
            <NuxtLink
              :to="`/pedido/${createdOrder?.order?.orderNumber}${tenantQuery ? `?tenant=${tenantQuery}` : ''}`"
              class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 rounded-xl text-xs transition-colors text-center"
            >
              Acompanhar Detalhes do Pedido
            </NuxtLink>
            <NuxtLink
              :to="tenantQuery ? `/?tenant=${tenantQuery}` : '/'"
              class="px-6 py-3.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors text-center"
            >
              Voltar à Loja
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Checkout Form -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <!-- Left Steps (7 cols) -->
        <div class="lg:col-span-7 space-y-8">
          <!-- Step 1: Personal Info -->
          <section class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <h3 class="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">1</span>
              <span>Dados Pessoais</span>
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label class="block text-xs font-bold text-slate-700 mb-1">Nome Completo *</label>
                <input
                  v-model="form.customerName"
                  type="text"
                  placeholder="Nome e Sobrenome"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">E-mail *</label>
                <input
                  v-model="form.customerEmail"
                  type="email"
                  placeholder="seu@email.com"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Telefone / WhatsApp *</label>
                <input
                  v-model="form.customerPhone"
                  type="text"
                  placeholder="(11) 99999-8888"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-xs font-bold text-slate-700 mb-1">CPF (obrigatório para envio) *</label>
                <input
                  v-model="form.customerDocument"
                  type="text"
                  placeholder="000.000.000-00"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
            </div>
          </section>

          <!-- Step 2: Shipping Address -->
          <section class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <h3 class="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">2</span>
              <span>Endereço de Entrega</span>
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">CEP *</label>
                <div class="relative">
                  <input
                    v-model="form.shippingAddress.zipcode"
                    @blur="handleCepBlur"
                    type="text"
                    placeholder="00000-000"
                    maxlength="9"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                  <span v-if="cepLoading" class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-blue-600 font-bold">
                    Buscando...
                  </span>
                </div>
              </div>
              <div class="sm:col-span-2">
                <label class="block text-xs font-bold text-slate-700 mb-1">Rua / Logradouro *</label>
                <input
                  v-model="form.shippingAddress.street"
                  type="text"
                  placeholder="Avenida Paulista"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Número *</label>
                <input
                  v-model="form.shippingAddress.number"
                  type="text"
                  placeholder="1000"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-xs font-bold text-slate-700 mb-1">Complemento</label>
                <input
                  v-model="form.shippingAddress.complement"
                  type="text"
                  placeholder="Apto 42, Bloco B"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Bairro *</label>
                <input
                  v-model="form.shippingAddress.neighborhood"
                  type="text"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Cidade *</label>
                <input
                  v-model="form.shippingAddress.city"
                  type="text"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Estado (UF) *</label>
                <input
                  v-model="form.shippingAddress.state"
                  type="text"
                  placeholder="SP"
                  maxlength="2"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-500 outline-none uppercase"
                />
              </div>
            </div>

            <!-- Shipping Option Selection -->
            <div class="pt-4 space-y-2">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Opção de Envio
              </label>
              <div class="space-y-2">
                <label
                  v-for="opt in shippingOptions"
                  :key="opt.id"
                  class="flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all"
                  :class="form.shippingService === opt.name ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300 bg-white'"
                >
                  <div class="flex items-center gap-3">
                    <input
                      type="radio"
                      :value="opt.name"
                      v-model="form.shippingService"
                      @change="form.shippingCost = opt.price"
                      class="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p class="font-bold text-xs text-slate-900">{{ opt.name }}</p>
                      <p class="text-[11px] text-slate-500">Prazo estimado: {{ opt.days }} dias úteis</p>
                    </div>
                  </div>
                  <span class="font-extrabold text-xs text-slate-900">
                    R$ {{ opt.price.toFixed(2).replace('.', ',') }}
                  </span>
                </label>
              </div>
            </div>
          </section>

          <!-- Step 3: Payment Method -->
          <section class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
            <h3 class="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">3</span>
              <span>Forma de Pagamento & Finalização</span>
            </h3>

            <!-- 3 Payment Method Pills -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <!-- PIX -->
              <label
                class="flex flex-col items-center justify-center p-4 rounded-2xl border cursor-pointer transition-all text-center"
                :class="form.paymentMethod === 'pix' ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-100 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'"
              >
                <input type="radio" value="pix" v-model="form.paymentMethod" class="sr-only" />
                <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1.5">
                  <svg class="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span class="text-xs font-extrabold text-slate-900">PIX</span>
                <span class="text-[10px] text-emerald-600 font-semibold mt-0.5">Aprovação imediata</span>
              </label>

              <!-- Cartão de Crédito -->
              <label
                class="flex flex-col items-center justify-center p-4 rounded-2xl border cursor-pointer transition-all text-center"
                :class="form.paymentMethod === 'credit_card' ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-100 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'"
              >
                <input type="radio" value="credit_card" v-model="form.paymentMethod" class="sr-only" />
                <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-1.5">
                  <svg class="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <span class="text-xs font-extrabold text-slate-900">Cartão de Crédito</span>
                <span class="text-[10px] text-slate-500 font-semibold mt-0.5">Até 12x sem juros</span>
              </label>

              <!-- WhatsApp -->
              <label
                class="flex flex-col items-center justify-center p-4 rounded-2xl border cursor-pointer transition-all text-center"
                :class="form.paymentMethod === 'whatsapp' ? 'border-[#25D366] bg-emerald-50/50 ring-2 ring-emerald-200 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'"
              >
                <input type="radio" value="whatsapp" v-model="form.paymentMethod" class="sr-only" />
                <div class="w-10 h-10 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center mb-1.5">
                  <svg class="w-5 h-5 text-[#25D366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span class="text-xs font-extrabold text-slate-900">Finalizar no WhatsApp</span>
                <span class="text-[10px] text-emerald-600 font-semibold mt-0.5">Atendimento humano</span>
              </label>
            </div>

            <!-- Credit Card Form Fields -->
            <div v-if="form.paymentMethod === 'credit_card'" class="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-slate-200/80">
                <span class="text-xs font-bold text-slate-800 uppercase tracking-wider">Dados do Cartão</span>
                <span class="text-xs font-bold text-blue-600 bg-blue-100/60 px-2.5 py-0.5 rounded-full">{{ cardBrand }}</span>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Número do Cartão *</label>
                <input
                  :value="cardForm.cardNumber"
                  @input="formatCardNumber"
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  maxlength="19"
                  class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-mono tracking-wider focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Nome Impresso no Cartão *</label>
                <input
                  v-model="cardForm.cardHolder"
                  type="text"
                  placeholder="COMO NO CARTÃO"
                  class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 uppercase focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Validade (MM/AA) *</label>
                  <input
                    :value="cardForm.cardExpiry"
                    @input="formatCardExpiry"
                    type="text"
                    placeholder="12/28"
                    maxlength="5"
                    class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">CVV (Código) *</label>
                  <input
                    v-model="cardForm.cardCvv"
                    type="password"
                    placeholder="123"
                    maxlength="4"
                    class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Parcelamento *</label>
                <select
                  v-model="cardForm.installments"
                  class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                >
                  <option v-for="opt in installmentOptions" :key="opt.count" :value="opt.count">
                    {{ opt.label }}
                  </option>
                </select>
              </div>
            </div>

            <!-- WhatsApp Explanatory Banner -->
            <div v-else-if="form.paymentMethod === 'whatsapp'" class="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start space-x-3.5 text-xs text-emerald-900">
              <div class="w-8 h-8 rounded-lg bg-[#25D366] text-white flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </div>
              <div>
                <strong class="font-bold block text-emerald-950 mb-0.5">Finalize com nosso atendente no WhatsApp</strong>
                <p class="text-emerald-800 leading-relaxed">
                  Ao clicar em <strong>Confirmar Pedido</strong>, registraremos seu pedido no sistema da loja e abriremos uma conversa no WhatsApp com todos os produtos, endereço e total prontos para envio.
                </p>
              </div>
            </div>

            <!-- PIX Explanatory Banner -->
            <div v-else class="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center space-x-3 text-xs text-slate-700">
              <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <strong>Aprovação instantânea via PIX</strong>
                <p class="text-slate-500 text-[11px] mt-0.5">O QR Code e a chave Copia e Cola serão exibidos na próxima tela para você pagar no app do banco.</p>
              </div>
            </div>
          </section>
        </div>

        <!-- Right Summary (5 cols) -->
        <div class="lg:col-span-5">
          <div class="sticky top-28 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <h3 class="text-base font-extrabold text-slate-900">Resumo da Compra</h3>

            <!-- Order Items -->
            <div class="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1 space-y-3">
              <div v-for="item in items" :key="item.productId + (item.variantId || '')" class="pt-3 first:pt-0 flex gap-3">
                <img :src="item.imageUrl" :alt="item.name" class="w-12 h-12 rounded-xl object-cover bg-slate-100 flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-bold text-slate-900 truncate">{{ item.name }}</p>
                  <p v-if="item.variantName" class="text-[10px] text-slate-400">{{ item.variantName }}</p>
                  <p class="text-[11px] text-slate-600 mt-0.5">Qtd: {{ item.quantity }} × R$ {{ item.price.toFixed(2).replace('.', ',') }}</p>
                </div>
                <span class="text-xs font-bold text-slate-900">
                  R$ {{ (item.price * item.quantity).toFixed(2).replace('.', ',') }}
                </span>
              </div>
            </div>

            <!-- Cupom de Desconto Box -->
            <div class="pt-3 border-t border-slate-100">
              <div v-if="!appliedCoupon" class="space-y-1.5">
                <div class="flex gap-2">
                  <input
                    v-model="couponCodeInput"
                    type="text"
                    placeholder="Possui um cupom?"
                    class="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono uppercase text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
                    @keyup.enter="applyCoupon"
                  />
                  <button
                    @click="applyCoupon"
                    :disabled="couponLoading || !couponCodeInput.trim()"
                    type="button"
                    class="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition"
                  >
                    {{ couponLoading ? '...' : 'Aplicar' }}
                  </button>
                </div>
                <p v-if="couponError" class="text-[11px] text-rose-600 font-medium">
                  {{ couponError }}
                </p>
              </div>

              <div v-else class="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <div>
                    <span class="font-bold text-emerald-800 font-mono">{{ appliedCoupon.code }}</span>
                    <span class="text-[11px] text-emerald-600 block">
                      {{ appliedCoupon.discountType === 'PERCENTAGE' ? `${appliedCoupon.discountValue}% OFF aplicado` : `R$ ${appliedCoupon.discountValue.toFixed(2)} OFF aplicado` }}
                    </span>
                  </div>
                </div>
                <button
                  @click="removeCoupon"
                  class="text-rose-500 hover:text-rose-700 p-1 rounded-md hover:bg-rose-50 transition-colors"
                  title="Remover cupom"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Totals -->
            <div class="space-y-2 pt-4 border-t border-slate-100 text-xs">
              <div class="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span class="font-semibold text-slate-800">R$ {{ subtotal.toFixed(2).replace('.', ',') }}</span>
              </div>
              <div v-if="discountAmount > 0" class="flex justify-between text-emerald-600 font-semibold">
                <span>Desconto Cupom</span>
                <span>- R$ {{ discountAmount.toFixed(2).replace('.', ',') }}</span>
              </div>
              <div class="flex justify-between text-slate-500">
                <span>Frete ({{ form.shippingService.split('-')[0] }})</span>
                <span class="font-semibold text-slate-800">R$ {{ form.shippingCost.toFixed(2).replace('.', ',') }}</span>
              </div>
              <div class="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-200">
                <span>Total a Pagar</span>
                <span class="text-blue-600">R$ {{ totalOrder.toFixed(2).replace('.', ',') }}</span>
              </div>
            </div>

            <p v-if="errorMsg" class="text-xs text-red-600 font-semibold bg-red-50 p-3 rounded-xl border border-red-100">
              {{ errorMsg }}
            </p>

            <button
              @click="submitOrder"
              :disabled="loading"
              class="w-full disabled:opacity-50 text-white font-bold py-4 px-6 rounded-2xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
              :style="form.paymentMethod !== 'whatsapp' ? { backgroundColor: store?.accentColor || '#2563eb' } : {}"
              :class="form.paymentMethod === 'whatsapp' ? 'bg-[#25D366] hover:bg-[#20bd5a] shadow-emerald-500/25' : 'hover:opacity-90 shadow-blue-600/30'"
            >
              <span v-if="loading">Processando Pedido...</span>
              <span v-else-if="form.paymentMethod === 'whatsapp'">Finalizar Pedido no WhatsApp</span>
              <span v-else-if="form.paymentMethod === 'credit_card'">Pagar com Cartão de Crédito</span>
              <span v-else>Confirmar e Pagar via PIX</span>
              <svg v-if="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <!-- Trust Badges Configurados no Editor de Tema -->
            <div class="pt-4 border-t border-slate-100 text-[11px] text-slate-600 space-y-2">
              <div class="flex items-center gap-2 font-medium">
                <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>{{ store?.themeConfig?.checkoutBadge1 || 'Compra 100% Segura & Criptografada SSL' }}</span>
              </div>
              <div class="flex items-center gap-2 font-medium">
                <svg class="w-4 h-4 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>{{ store?.themeConfig?.checkoutBadge2 || 'Garantia de 7 dias para troca ou devolução' }}</span>
              </div>
              <div class="flex items-center gap-2 font-medium">
                <svg class="w-4 h-4 text-indigo-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>{{ store?.themeConfig?.checkoutBadge3 || 'Envio Rápido e Rastreável pelos Correios' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

