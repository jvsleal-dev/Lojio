<script setup lang="ts">
const route = useRoute()
const orderNumber = route.params.orderNumber as string
const tenantQuery = computed(() => (route.query.tenant as string) || '')

const { data, refresh } = await useFetch<any>(`/api/store/orders/${orderNumber}`, {
  query: { tenant: tenantQuery },
})
const order = computed<any>(() => data.value?.order)
const pixCopied = ref(false)

const whatsappContactLink = computed(() => {
  if (!order.value) return '#'
  const rawPhone = (order.value.store?.contactWhatsapp || '11999998888').replace(/\D/g, '')
  const phone = rawPhone.startsWith('55') ? rawPhone : `55${rawPhone}`
  const msg = `Olá! Gostaria de falar sobre o meu pedido *#${order.value.orderNumber}* no valor de *R$ ${Number(order.value.total).toFixed(2)}*.`
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
})

const copyPix = () => {
  if (order.value?.payment?.qrCode) {
    navigator.clipboard.writeText(order.value.payment.qrCode)
    pixCopied.value = true
    setTimeout(() => (pixCopied.value = false), 3000)
  }
}

const printReceipt = () => {
  if (import.meta.client) {
    window.print()
  }
}

let pollInterval: any = null

onMounted(() => {
  if (order.value?.paymentStatus === 'pending' && order.value?.paymentMethod === 'pix') {
    pollInterval = setInterval(async () => {
      await refresh()
      if (order.value?.paymentStatus === 'paid') {
        clearInterval(pollInterval)
      }
    }, 3000)
  }
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-600 selection:text-white">
    <!-- Header (Hidden on print) -->
    <header class="bg-white border-b border-slate-200 py-4 print:hidden">
      <div class="max-w-4xl mx-auto px-4 flex items-center justify-between">
        <NuxtLink :to="tenantQuery ? `/?tenant=${tenantQuery}` : '/'" class="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-1.5 hover:text-emerald-600 transition">
          <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Voltar para a Loja</span>
        </NuxtLink>
        <div class="flex items-center space-x-3">
          <button
            @click="printReceipt"
            class="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center space-x-1.5 transition"
            title="Imprimir ou Salvar em PDF"
          >
            <svg class="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Imprimir Recibo</span>
          </button>
          <span class="text-xs font-semibold text-slate-500">
            Pedido: <strong class="text-slate-900 font-mono">#{{ orderNumber }}</strong>
          </span>
        </div>
      </div>
    </header>

    <main v-if="order" class="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6 print:p-0 print:m-0 print:max-w-none">
      <!-- Status Header Card -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
        <!-- Brand / Invoice Header for Print -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Comprovante de Compra</span>
              <span class="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono">Lojio E-commerce</span>
            </div>
            <h1 class="text-2xl font-black text-slate-900 mt-1">Pedido #{{ order.orderNumber }}</h1>
            <p class="text-xs text-slate-500 mt-1">
              Data: {{ new Date(order.createdAt).toLocaleDateString('pt-BR') }} às {{ new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }}
            </p>
          </div>

          <div class="flex items-center space-x-2">
            <span
              class="px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide inline-flex items-center space-x-1.5"
              :class="{
                'bg-emerald-100 text-emerald-800': order.paymentMethod === 'whatsapp' || order.paymentMethod === 'credit_card' || order.paymentStatus === 'paid',
                'bg-amber-100 text-amber-800': order.paymentMethod === 'pix' && order.paymentStatus === 'pending',
                'bg-red-100 text-red-800': order.paymentStatus === 'failed',
              }"
            >
              <svg v-if="order.paymentMethod === 'whatsapp'" class="w-3.5 h-3.5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <svg v-else-if="order.paymentMethod === 'credit_card'" class="w-3.5 h-3.5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <svg v-else class="w-3.5 h-3.5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>

              <span v-if="order.paymentMethod === 'whatsapp'">Pedido no WhatsApp</span>
              <span v-else-if="order.paymentMethod === 'credit_card'">Cartão Aprovado</span>
              <span v-else-if="order.paymentStatus === 'paid'">PIX Aprovado</span>
              <span v-else>Aguardando PIX</span>
            </span>

            <button
              @click="printReceipt"
              class="print:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              title="Imprimir Comprovante"
            >
              <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- WhatsApp Direct Contact Banner (Hidden on print) -->
        <div class="print:hidden p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center font-bold text-lg shrink-0">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-bold text-emerald-950">Dúvidas ou atualizações sobre este pedido?</p>
              <p class="text-[11px] text-emerald-700">Fale diretamente com nossa equipe no WhatsApp oficial.</p>
            </div>
          </div>
          <a
            :href="whatsappContactLink"
            target="_blank"
            class="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs transition shadow-md shadow-emerald-600/20 inline-flex items-center space-x-2 shrink-0 self-stretch sm:self-auto justify-center"
          >
            <span>Conversar no WhatsApp</span>
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

        <!-- Tracking Code Alert if shipped -->
        <div v-if="order.trackingCode" class="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-emerald-900">Código de Rastreamento dos Correios / Transportadora:</p>
            <p class="text-base font-mono font-bold text-emerald-700 mt-0.5">{{ order.trackingCode }}</p>
          </div>
          <a
            :href="`https://rastreamento.correios.com.br/app/index.php?objeto=${order.trackingCode}`"
            target="_blank"
            class="print:hidden text-xs font-bold text-emerald-600 bg-white px-4 py-2 rounded-xl shadow-sm hover:bg-emerald-50 transition-colors inline-flex items-center gap-1.5"
          >
            <span>Rastrear Encomenda</span>
            <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        <!-- PIX Display if still pending (Hidden on print) -->
        <div v-if="order.paymentStatus === 'pending' && order.payment?.qrCode" class="print:hidden p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-4">
          <div class="flex items-center justify-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider">Aguardando Pagamento Pix Imediato</h3>
          </div>
          <div class="p-3 bg-white rounded-2xl inline-block shadow-sm border border-slate-200">
            <img
              :src="order.payment?.qrCodeBase64 ? `data:image/png;base64,${order.payment.qrCodeBase64}` : `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(order.payment.qrCode)}`"
              alt="QR Code PIX"
              class="w-44 h-44 mx-auto rounded-xl"
            />
          </div>
          <div class="max-w-md mx-auto space-y-2">
            <input
              type="text"
              readonly
              :value="order.payment.qrCode"
              class="w-full bg-white border border-slate-200 text-xs px-3 py-2 rounded-xl text-center text-slate-600 font-mono"
            />
            <button
              @click="copyPix"
              class="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
            >
              {{ pixCopied ? 'Código Copiado com Sucesso!' : 'Copiar Código PIX (Copia e Cola)' }}
            </button>
          </div>
        </div>

        <!-- Order Items -->
        <div class="space-y-4 pt-4 border-t border-slate-100">
          <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider">Itens do Pedido</h3>
          <div class="divide-y divide-slate-100">
            <div v-for="item in order.items" :key="item.id" class="py-3.5 flex justify-between items-center text-xs">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                  {{ item.quantity }}x
                </div>
                <div>
                  <p class="font-bold text-slate-900">{{ item.productName }}</p>
                  <p v-if="item.variantName" class="text-[11px] text-slate-400">{{ item.variantName }}</p>
                  <p class="text-[11px] text-slate-500">Unitário: R$ {{ Number(item.unitPrice || item.price || 0).toFixed(2).replace('.', ',') }}</p>
                </div>
              </div>
              <span class="font-black text-slate-900 text-sm">
                R$ {{ Number(item.total || 0).toFixed(2).replace('.', ',') }}
              </span>
            </div>
          </div>
        </div>

        <!-- Totals & Address -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100 text-xs">
          <div>
            <h4 class="font-bold text-slate-900 mb-2">Destinatário & Endereço de Entrega</h4>
            <div class="text-slate-700 leading-relaxed">
              <p class="font-bold text-slate-900">{{ order.customerName }}</p>
              <p class="text-slate-500">{{ order.customerEmail }} &bull; {{ order.customerPhone || '' }}</p>
              <div v-if="order.shippingAddress" class="mt-2 text-slate-600">
                <p>{{ order.shippingAddress.street }}, {{ order.shippingAddress.number }}</p>
                <p v-if="order.shippingAddress.complement">{{ order.shippingAddress.complement }}</p>
                <p>{{ order.shippingAddress.neighborhood }} - {{ order.shippingAddress.city }}/{{ order.shippingAddress.state }}</p>
                <p class="font-mono mt-1 font-bold">CEP: {{ order.shippingAddress.zipcode }}</p>
              </div>
            </div>
          </div>

          <div class="space-y-2.5 bg-slate-50 p-5 rounded-2xl border border-slate-200/60">
            <div class="flex justify-between text-slate-600">
              <span>Subtotal dos Produtos:</span>
              <span class="font-semibold">R$ {{ Number(order.subtotal || 0).toFixed(2).replace('.', ',') }}</span>
            </div>
            <div class="flex justify-between text-slate-600">
              <span>Frete:</span>
              <span class="font-semibold">{{ Number(order.shippingCost) > 0 ? `R$ ${Number(order.shippingCost).toFixed(2).replace('.', ',')}` : 'Grátis' }}</span>
            </div>
            <div v-if="(order.discount || order.discountAmount) && Number(order.discount || order.discountAmount) > 0" class="flex justify-between text-emerald-600 font-semibold">
              <span>Desconto (Cupom):</span>
              <span>- R$ {{ Number(order.discount || order.discountAmount).toFixed(2).replace('.', ',') }}</span>
            </div>
            <div class="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
              <span>Total Pago:</span>
              <span class="text-emerald-600">R$ {{ Number(order.total || 0).toFixed(2).replace('.', ',') }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-else class="flex-1 flex items-center justify-center p-12 text-slate-400">
      <div class="text-center">
        <div class="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p class="text-sm font-semibold">Carregando dados do pedido...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  body {
    background: white !important;
    color: black !important;
  }
}
</style>
