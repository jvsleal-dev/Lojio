<template>
  <div class="min-h-screen bg-slate-950 flex text-slate-100">
    <AdminSidebar />

    <main class="flex-1 overflow-y-auto p-8 space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <h1 class="text-2xl font-black text-white">Gestão de Pedidos & Vendas</h1>
          <p class="text-slate-400 text-sm">Monitore pagamentos PIX, emita códigos de rastreio e avise clientes pelo WhatsApp.</p>
        </div>

        <div class="flex items-center space-x-2 text-xs">
          <span class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold">
            Total: {{ filteredOrders.length }} pedidos
          </span>
        </div>
      </div>

      <!-- Filters & Search Bar -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <!-- Search Input -->
        <div class="relative w-full md:w-96">
          <input
            v-model="search"
            type="text"
            placeholder="Buscar por cliente, nº do pedido ou rastreio..."
            class="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg class="w-4 h-4 text-slate-500 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>

        <!-- Status Filter Pills -->
        <div class="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            v-for="tab in filterTabs"
            :key="tab.value"
            @click="activeTab = tab.value"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap"
            :class="activeTab === tab.value ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="py-20 text-center">
        <div class="inline-block animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-3"></div>
        <p class="text-slate-400 text-sm">Carregando pedidos...</p>
      </div>

      <!-- Orders Table -->
      <div v-else class="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-bold uppercase tracking-wider">
                <th class="py-4 px-6">Pedido & Data</th>
                <th class="py-4 px-6">Cliente & Contato</th>
                <th class="py-4 px-6">Total & Pagamento</th>
                <th class="py-4 px-6">Envio / Rastreio</th>
                <th class="py-4 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 font-medium">
              <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-slate-800/40 transition">
                <!-- Pedido -->
                <td class="py-4 px-6">
                  <p class="font-bold text-white text-sm">{{ order.orderNumber }}</p>
                  <p class="text-slate-500 text-[11px] mt-0.5">{{ formatDate(order.createdAt) }}</p>
                  <span class="text-[10px] text-blue-400 font-mono">{{ order.items?.length || 1 }} itens</span>
                </td>

                <!-- Cliente -->
                <td class="py-4 px-6">
                  <p class="font-bold text-slate-200 text-sm">{{ order.customerName }}</p>
                  <p class="text-slate-400 text-[11px]">{{ order.customerEmail }}</p>
                  <p class="text-slate-500 text-[11px] font-mono">{{ order.customerPhone }}</p>
                </td>

                <!-- Total & Pagamento -->
                <td class="py-4 px-6">
                  <p class="font-black text-emerald-400 text-sm">{{ formatCurrency(order.total) }}</p>
                  <div class="flex flex-wrap gap-1 mt-1">
                    <span
                      class="inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase"
                      :class="{
                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30': order.paymentMethod === 'whatsapp' || order.paymentStatus === 'paid',
                        'bg-blue-500/20 text-blue-400 border border-blue-500/30': order.paymentMethod === 'credit_card',
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30': order.paymentMethod === 'pix' && order.paymentStatus === 'pending',
                      }"
                    >
                      <span v-if="order.paymentMethod === 'whatsapp'">💬 WhatsApp</span>
                      <span v-else-if="order.paymentMethod === 'credit_card'">💳 Cartão (Pago)</span>
                      <span v-else-if="order.paymentStatus === 'paid'">⚡ PIX (Pago)</span>
                      <span v-else>⚡ PIX (Pendente)</span>
                    </span>
                  </div>
                </td>

                <!-- Envio -->
                <td class="py-4 px-6">
                  <span
                    class="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
                    :class="{
                      'bg-blue-500/20 text-blue-400': order.orderStatus === 'shipped',
                      'bg-emerald-500/20 text-emerald-400': order.orderStatus === 'delivered',
                      'bg-slate-800 text-slate-300': order.orderStatus === 'processing',
                      'bg-amber-500/20 text-amber-400': order.orderStatus === 'pending',
                    }"
                  >
                    {{ formatOrderStatus(order.orderStatus) }}
                  </span>
                  <div v-if="order.trackingCode" class="mt-1 text-[11px] text-blue-400 font-mono flex items-center space-x-1">
                    <span>📦</span>
                    <span>{{ order.trackingCode }}</span>
                  </div>
                </td>

                <!-- Ações -->
                <td class="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                  <!-- WhatsApp Notifier (Inspired by Offstore) -->
                  <a
                    :href="getWhatsAppLink(order)"
                    target="_blank"
                    class="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition"
                    title="Avisar cliente pelo WhatsApp"
                  >
                    <span>💬 WhatsApp</span>
                  </a>

                  <!-- Manage Button -->
                  <button
                    @click="openDetails(order)"
                    class="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition"
                  >
                    Detalhes &bull; Atualizar
                  </button>
                </td>
              </tr>

              <tr v-if="!filteredOrders.length">
                <td colspan="5" class="py-12 text-center text-slate-400">
                  Nenhum pedido encontrado para o filtro selecionado.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Order Details & Update Modal -->
      <div v-if="selectedOrder" class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
          <!-- Modal Header -->
          <div class="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
            <div>
              <h3 class="font-black text-white text-base">Pedido {{ selectedOrder.orderNumber }}</h3>
              <p class="text-xs text-slate-400">{{ formatDate(selectedOrder.createdAt) }} &bull; {{ selectedOrder.customerName }}</p>
            </div>
            <button @click="selectedOrder = null" class="text-slate-400 hover:text-white text-xl">&times;</button>
          </div>

          <!-- Items Ordered List -->
          <div class="mb-5 space-y-2">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Produtos Comprados</p>
            <div class="bg-slate-950 p-3 rounded-2xl border border-slate-800 divide-y divide-slate-800/60">
              <div v-for="item in selectedOrder.items" :key="item.id" class="py-2 flex items-center justify-between text-xs">
                <div>
                  <p class="font-bold text-white">{{ item.productName }}</p>
                  <p v-if="item.variantName" class="text-[11px] text-slate-400">{{ item.variantName }}</p>
                  <span class="text-[11px] text-slate-500">{{ item.quantity }}x {{ formatCurrency(item.unitPrice) }}</span>
                </div>
                <span class="font-black text-emerald-400">{{ formatCurrency(item.total) }}</span>
              </div>
            </div>
          </div>

          <!-- Shipping Address -->
          <div v-if="parsedAddress" class="mb-5 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
            <p class="font-bold text-blue-400 uppercase tracking-wider text-[10px]">Endereço de Entrega</p>
            <p class="text-white">{{ parsedAddress.street }}, nº {{ parsedAddress.number }} {{ parsedAddress.complement ? `(${parsedAddress.complement})` : '' }}</p>
            <p class="text-slate-400">{{ parsedAddress.neighborhood }} &bull; {{ parsedAddress.city }}/{{ parsedAddress.state }} &bull; CEP: {{ parsedAddress.zipcode }}</p>
            <p class="text-[11px] text-slate-500">Frete: {{ selectedOrder.shippingService }} ({{ formatCurrency(selectedOrder.shippingCost) }})</p>
          </div>

          <!-- Status Update Form -->
          <form @submit.prevent="saveStatus" class="space-y-4 pt-4 border-t border-slate-800">
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Status do Pagamento</label>
              <select
                v-model="editForm.paymentStatus"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold focus:outline-none"
              >
                <option value="pending">Pendente (Aguardando PIX)</option>
                <option value="paid">Pago (Aprovado)</option>
                <option value="failed">Falhou / Cancelado</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Status de Envio</label>
              <select
                v-model="editForm.orderStatus"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold focus:outline-none"
              >
                <option value="pending">Aguardando Pagamento</option>
                <option value="processing">Em Separação no Estoque</option>
                <option value="shipped">Enviado (Com Rastreamento)</option>
                <option value="delivered">Entregue ao Cliente</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Código de Rastreio dos Correios</label>
              <input
                v-model="editForm.trackingCode"
                type="text"
                placeholder="Ex: BR123456789BR"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs uppercase focus:outline-none"
              />
            </div>

            <div class="pt-3 flex justify-end space-x-3">
              <button
                type="button"
                @click="selectedOrder = null"
                class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Fechar
              </button>
              <button
                type="submit"
                :disabled="updating"
                class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
              >
                {{ updating ? 'Salvando...' : 'Salvar Alterações' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { fetchWithAuth, isAuthenticated, initAuth } = useAuth()
const router = useRouter()

const orders = ref<any[]>([])
const loading = ref(true)
const search = ref('')
const activeTab = ref('all')

const selectedOrder = ref<any>(null)
const editForm = reactive({
  paymentStatus: 'paid',
  orderStatus: 'shipped',
  trackingCode: '',
})
const updating = ref(false)

const filterTabs = [
  { label: 'Todos', value: 'all' },
  { label: '⚡ Pix', value: 'pix' },
  { label: '💳 Cartão', value: 'credit_card' },
  { label: '💬 WhatsApp', value: 'whatsapp' },
  { label: 'Pagos', value: 'paid' },
  { label: 'Enviados', value: 'shipped' },
]

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0)
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const formatOrderStatus = (status: string) => {
  const map: Record<string, string> = {
    pending: 'Aguardando',
    processing: 'Em Separação',
    shipped: 'Enviado',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  }
  return map[status] || status
}

const filteredOrders = computed(() => {
  let list = orders.value

  if (activeTab.value === 'paid') {
    list = list.filter(o => o.paymentStatus === 'paid')
  } else if (activeTab.value === 'pix') {
    list = list.filter(o => o.paymentMethod === 'pix')
  } else if (activeTab.value === 'credit_card') {
    list = list.filter(o => o.paymentMethod === 'credit_card')
  } else if (activeTab.value === 'whatsapp') {
    list = list.filter(o => o.paymentMethod === 'whatsapp')
  } else if (activeTab.value === 'shipped') {
    list = list.filter(o => o.orderStatus === 'shipped')
  } else if (activeTab.value === 'delivered') {
    list = list.filter(o => o.orderStatus === 'delivered')
  }

  if (search.value.trim()) {
    const q = search.value.toLowerCase().trim()
    list = list.filter(o =>
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      (o.trackingCode && o.trackingCode.toLowerCase().includes(q))
    )
  }

  return list
})

const parsedAddress = computed(() => {
  if (!selectedOrder.value?.shippingAddress) return null
  try {
    return JSON.parse(selectedOrder.value.shippingAddress)
  } catch {
    return null
  }
})

const getWhatsAppLink = (order: any) => {
  const cleanPhone = (order.customerPhone || '').replace(/\D/g, '')
  const phone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`
  const statusLabel = order.paymentStatus === 'paid' ? 'pagamento aprovado' : 'aguardando pagamento'
  const tracking = order.trackingCode ? ` Código de rastreio: ${order.trackingCode}` : ''
  const message = encodeURIComponent(`Olá ${order.customerName}! Seu pedido #${order.orderNumber} está com ${statusLabel}.${tracking} Agradecemos pela preferência!`)
  return `https://wa.me/${phone}?text=${message}`
}

const openDetails = (order: any) => {
  selectedOrder.value = order
  editForm.paymentStatus = order.paymentStatus
  editForm.orderStatus = order.orderStatus
  editForm.trackingCode = order.trackingCode || ''
}

const saveStatus = async () => {
  if (!selectedOrder.value) return
  updating.value = true

  try {
    const res: any = await fetchWithAuth(`/api/admin/orders/${selectedOrder.value.id}/status`, {
      method: 'PATCH',
      body: editForm,
    })
    selectedOrder.value.paymentStatus = res.order.paymentStatus
    selectedOrder.value.orderStatus = res.order.orderStatus
    selectedOrder.value.trackingCode = res.order.trackingCode
    selectedOrder.value = null
    await loadOrders()
  } catch (err) {
    console.error(err)
  } finally {
    updating.value = false
  }
}

const loadOrders = async () => {
  loading.value = true
  try {
    const res: any = await fetchWithAuth('/api/admin/orders')
    orders.value = res.orders || []
  } catch {
    router.push('/admin/login')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  initAuth()
  if (!isAuthenticated.value) {
    router.push('/admin/login')
    return
  }
  loadOrders()
})
</script>
