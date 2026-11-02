<template>
  <div class="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
    <AdminSidebar :tenant="tenant" />

    <main class="flex-1 p-6 md:p-8 overflow-y-auto">
      <!-- Top Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div class="flex items-center space-x-2">
            <span class="text-xl">🏷️</span>
            <h1 class="text-2xl font-black text-white">Cupons de Desconto</h1>
          </div>
          <p class="text-slate-400 text-sm mt-1">
            Crie campanhas promocionais, cupons em porcentagem (%) ou desconto fixo (R$) para alavancar suas vendas.
          </p>
        </div>

        <button
          @click="openModal = true"
          class="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition hover:scale-105 active:scale-95 shrink-0"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
          </svg>
          <span>Novo Cupom</span>
        </button>
      </div>

      <!-- Quick Metrics -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <p class="text-xs text-slate-400 font-bold uppercase tracking-wider">Total de Cupons</p>
          <p class="text-2xl font-black text-white mt-1">{{ coupons.length }}</p>
          <p class="text-xs text-slate-500 mt-1">Cadastrados para sua loja</p>
        </div>

        <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <p class="text-xs text-emerald-400 font-bold uppercase tracking-wider">Cupons Ativos</p>
          <p class="text-2xl font-black text-emerald-400 mt-1">
            {{ coupons.filter(c => c.isActive).length }}
          </p>
          <p class="text-xs text-slate-500 mt-1">Prontos para uso no checkout</p>
        </div>

        <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <p class="text-xs text-blue-400 font-bold uppercase tracking-wider">Vezes Utilizados</p>
          <p class="text-2xl font-black text-blue-400 mt-1">
            {{ coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0) }}
          </p>
          <p class="text-xs text-slate-500 mt-1">Resgates realizados por clientes</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20 text-slate-400">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
        Carregando cupons...
      </div>

      <!-- Empty State -->
      <div v-else-if="coupons.length === 0" class="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800">
        <div class="w-16 h-16 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-4 text-3xl">
          🏷️
        </div>
        <h3 class="text-lg font-bold text-white mb-2">Nenhum cupom cadastrado</h3>
        <p class="text-slate-400 text-sm max-w-md mx-auto mb-6">
          Cupons promocionais aumentam em até 35% as conversões de checkout na sua loja. Crie o seu primeiro cupom agora!
        </p>
        <button
          @click="openModal = true"
          class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition"
        >
          Criar Primeiro Cupom
        </button>
      </div>

      <!-- Coupons Table -->
      <div v-else class="overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/40">
              <th class="p-4 pl-6">Código</th>
              <th class="p-4">Desconto</th>
              <th class="p-4">Regra Mínima</th>
              <th class="p-4">Utilizações</th>
              <th class="p-4">Validade</th>
              <th class="p-4">Status</th>
              <th class="p-4 pr-6 text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800 text-sm">
            <tr v-for="coupon in coupons" :key="coupon.id" class="hover:bg-slate-800/40 transition">
              <td class="p-4 pl-6">
                <div class="flex items-center space-x-2">
                  <span class="px-2.5 py-1 rounded-md bg-slate-800 font-mono font-bold text-blue-400 border border-slate-700 text-xs">
                    {{ coupon.code }}
                  </span>
                  <button
                    @click="copyCode(coupon.code)"
                    class="p-1 text-slate-500 hover:text-white transition"
                    title="Copiar código"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                  </button>
                </div>
              </td>

              <td class="p-4">
                <span class="font-extrabold text-white text-base">
                  {{ coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% OFF` : `R$ ${coupon.discountValue.toFixed(2)} OFF` }}
                </span>
              </td>

              <td class="p-4 text-xs text-slate-300">
                <span v-if="coupon.minOrderValue">
                  A partir de <strong class="text-white">R$ {{ coupon.minOrderValue.toFixed(2) }}</strong>
                </span>
                <span v-else class="text-slate-500">
                  Sem valor mínimo
                </span>
              </td>

              <td class="p-4 text-xs">
                <div class="space-y-1">
                  <div class="flex justify-between text-slate-400 text-[11px]">
                    <span>{{ coupon.usedCount }} usado{{ coupon.usedCount === 1 ? '' : 's' }}</span>
                    <span v-if="coupon.maxUses">{{ coupon.maxUses }} máx</span>
                  </div>
                  <div v-if="coupon.maxUses" class="w-24 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      class="h-full bg-blue-500 rounded-full"
                      :style="{ width: `${Math.min(100, (coupon.usedCount / coupon.maxUses) * 100)}%` }"
                    ></div>
                  </div>
                </div>
              </td>

              <td class="p-4 text-xs">
                <span v-if="coupon.expiresAt" :class="new Date(coupon.expiresAt) < new Date() ? 'text-rose-400 font-bold' : 'text-slate-300'">
                  {{ formatDate(coupon.expiresAt) }}
                </span>
                <span v-else class="text-slate-500">Ilimitada</span>
              </td>

              <td class="p-4">
                <button
                  @click="toggleStatus(coupon)"
                  :class="coupon.isActive ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'"
                  class="px-2.5 py-1 rounded-full text-xs font-bold border transition hover:opacity-80 inline-flex items-center space-x-1.5"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="coupon.isActive ? 'bg-emerald-400' : 'bg-slate-500'"></span>
                  <span>{{ coupon.isActive ? 'Ativo' : 'Pausado' }}</span>
                </button>
              </td>

              <td class="p-4 pr-6 text-right">
                <button
                  @click="deleteCoupon(coupon)"
                  class="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                  title="Excluir cupom"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Criar Cupom -->
      <div v-if="openModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div class="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
          <button
            @click="openModal = false"
            class="absolute top-5 right-5 text-slate-500 hover:text-white transition p-2"
          >
            ✕
          </button>

          <h2 class="text-xl font-black text-white mb-1">Criar Novo Cupom</h2>
          <p class="text-slate-400 text-xs mb-6">Defina as regras do desconto para atrair mais clientes.</p>

          <form @submit.prevent="createCoupon" class="space-y-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Código do Cupom *
              </label>
              <input
                v-model="form.code"
                type="text"
                required
                placeholder="Ex: PROMO10, FRETEGRATIS"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono uppercase focus:outline-none focus:border-blue-500"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Tipo de Desconto *
                </label>
                <select
                  v-model="form.discountType"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="PERCENTAGE">Porcentagem (%)</option>
                  <option value="FIXED">Valor Fixo (R$)</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Valor do Desconto *
                </label>
                <input
                  v-model.number="form.discountValue"
                  type="number"
                  step="0.01"
                  min="0.1"
                  required
                  :placeholder="form.discountType === 'PERCENTAGE' ? 'Ex: 15 (para 15%)' : 'Ex: 20.00 (para R$ 20)'"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Compra Mínima (R$)
                </label>
                <input
                  v-model.number="form.minOrderValue"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 100.00 (Opcional)"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Limite de Usos
                </label>
                <input
                  v-model.number="form.maxUses"
                  type="number"
                  placeholder="Ex: 50 (Opcional)"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Data de Validade (Opcional)
              </label>
              <input
                v-model="form.expiresAt"
                type="date"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div v-if="errorMsg" class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {{ errorMsg }}
            </div>

            <div class="pt-4 flex items-center justify-end space-x-3">
              <button
                type="button"
                @click="openModal = false"
                class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
              >
                {{ saving ? 'Salvando...' : 'Criar Cupom' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
})

const { token } = useAuth()
const loading = ref(true)
const saving = ref(false)
const openModal = ref(false)
const coupons = ref([])
const tenant = ref(null)
const errorMsg = ref('')

const form = ref({
  code: '',
  discountType: 'PERCENTAGE',
  discountValue: 10,
  minOrderValue: null,
  maxUses: null,
  expiresAt: '',
})

async function loadData() {
  loading.value = true
  try {
    const [couponsRes, storeRes] = await Promise.all([
      $fetch('/api/admin/coupons', {
        headers: { Authorization: `Bearer ${token.value}` },
      }),
      $fetch('/api/admin/store', {
        headers: { Authorization: `Bearer ${token.value}` },
      }),
    ])
    coupons.value = couponsRes || []
    tenant.value = storeRes?.tenant || null
  } catch (err) {
    console.error('Erro ao carregar dados:', err)
  } finally {
    loading.value = false
  }
}

async function createCoupon() {
  saving.value = true
  errorMsg.value = ''
  try {
    const res = await $fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
      body: form.value,
    })
    coupons.value.unshift(res)
    openModal.value = false
    form.value = {
      code: '',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderValue: null,
      maxUses: null,
      expiresAt: '',
    }
  } catch (err) {
    errorMsg.value = err?.data?.message || 'Falha ao criar cupom'
  } finally {
    saving.value = false
  }
}

async function toggleStatus(coupon) {
  try {
    const res = await $fetch(`/api/admin/coupons/${coupon.id}/toggle`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token.value}` },
    })
    coupon.isActive = res.isActive
  } catch (err) {
    alert('Erro ao atualizar status do cupom')
  }
}

async function deleteCoupon(coupon) {
  if (!confirm(`Deseja realmente excluir o cupom "${coupon.code}"?`)) return
  try {
    await $fetch(`/api/admin/coupons/${coupon.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token.value}` },
    })
    coupons.value = coupons.value.filter(c => c.id !== coupon.id)
  } catch (err) {
    alert('Erro ao excluir cupom')
  }
}

function copyCode(code) {
  navigator.clipboard.writeText(code)
  alert(`Código "${code}" copiado para a área de transferência!`)
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

onMounted(() => {
  loadData()
})
</script>

