<script setup lang="ts">
const route = useRoute()
const orderNumber = route.params.orderNumber as string

const { data, refresh } = await useFetch(`/api/store/orders/${orderNumber}`)
const order = computed(() => data.value?.order)
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
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-600 selection:text-white">
    <!-- Header (Hidden on print) -->
    <header class="bg-white border-b border-slate-200 py-4 print:hidden">
      <div class="max-w-4xl mx-auto px-4 flex items-center justify-between">
        <NuxtLink to="/" class="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-1.5 hover:text-blue-600 transition">
          <span>←</span>
          <span>Voltar para a Loja</span>
        </NuxtLink>
        <div class="flex items-center space-x-3">
          <button
            @click="printReceipt"
            class="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center space-x-1.5 transition"
            title="Imprimir ou Salvar em PDF"
          >
            <span>🖨️</span>
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
                'bg-emerald-100 text-emerald-800': order.paymentMethod === 'whatsapp' || order.paymentStatus === 'paid',
                'bg-amber-100 text-amber-800': order.paymentMethod === 'pix' && order.paymentStatus === 'pending',
                'bg-blue-100 text-blue-800': order.paymentMethod === 'credit_card',
                'bg-red-100 text-red-800': order.paymentStatus === 'failed',
              }"
            >
              <span v-if="order.paymentMethod === 'whatsapp'">💬 Pedido no WhatsApp</span>
              <span v-else-if="order.paymentMethod === 'credit_card'">💳 Cartão Aprovado</span>
              <span v-else-if="order.paymentStatus === 'paid'">⚡ PIX Aprovado</span>
              <span v-else>⚡ Aguardando PIX</span>
            </span>

            <button
              @click="printReceipt"
              class="print:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              title="Imprimir Comprovante"
            >
              🖨️
            </button>
          </div>
        </div>

        <!-- WhatsApp Direct Contact Banner (Hidden on print) -->
        <div class="print:hidden p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center font-bold text-lg shrink-0">
              💬
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
            <span>&rarr;</span>
          </a>
        </div>

        <!-- Tracking Code Alert if shipped -->
        <div v-if="order.trackingCode" class="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-blue-900">Código de Rastreamento dos Correios / Transportadora:</p>
            <p class="text-base font-mono font-bold text-blue-700 mt-0.5">{{ order.trackingCode }}</p>
          </div>
          <a
            :href="`https://rastreamento.correios.com.br/app/index.php?objeto=${order.trackingCode}`"
            target="_blank"
            class="print:hidden text-xs font-bold text-blue-600 bg-white px-4 py-2 rounded-xl shadow-sm hover:bg-blue-50 transition-colors"
          >
            Rastrear Encomenda ↗
          </a>
        </div>

        <!-- PIX Display if still pending (Hidden on print) -->
        <div v-if="order.paymentStatus === 'pending' && order.payment?.qrCode" class="print:hidden p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-4">
          <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider">Pagar com PIX Imediato</h3>
          <div class="p-3 bg-white rounded-xl inline-block shadow-sm border border-slate-200">
            <img
              :src="`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(order.payment.qrCode)}`"
              alt="QR Code PIX"
              class="w-40 h-40 mx-auto"
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
                  <p class="text-[11px] text-slate-500">Unitário: R$ {{ Number(item.price).toFixed(2).replace('.', ',') }}</p>
                </div>
              </div>
              <span class="font-black text-slate-900 text-sm">
                R$ {{ Number(item.total).toFixed(2).replace('.', ',') }}
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
              <p class="text-slate-500">{{ order.customerEmail }} &bull; {{ order.customerPhone }}</p>
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
              <span class="font-semibold">R$ {{ Number(order.subtotal).toFixed(2).replace('.', ',') }}</span>
            </div>
            <div class="flex justify-between text-slate-600">
              <span>Frete:</span>
              <span class="font-semibold">{{ Number(order.shippingCost) > 0 ? `R$ ${Number(order.shippingCost).toFixed(2).replace('.', ',')}` : 'Grátis' }}</span>
            </div>
            <div v-if="order.discountAmount && Number(order.discountAmount) > 0" class="flex justify-between text-emerald-600 font-semibold">
              <span>Desconto (Cupom):</span>
              <span>- R$ {{ Number(order.discountAmount).toFixed(2).replace('.', ',') }}</span>
            </div>
            <div class="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
              <span>Total Pago:</span>
              <span class="text-blue-600">R$ {{ Number(order.total).toFixed(2).replace('.', ',') }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-else class="flex-1 flex items-center justify-center p-12 text-slate-400">
      <div class="text-center">
        <div class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
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
