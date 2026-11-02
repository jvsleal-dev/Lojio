<template>
  <div class="min-h-screen bg-slate-950 flex text-slate-100">
    <AdminSidebar />

    <main class="flex-1 overflow-y-auto p-8 space-y-6 max-w-5xl">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <h1 class="text-2xl font-black text-white">Configurações & Personalização</h1>
          <p class="text-slate-400 text-sm">Defina identidade visual, cores, WhatsApp e meios de pagamento da sua loja.</p>
        </div>

        <a
          :href="`/?tenant=${form.subdomain || ''}`"
          target="_blank"
          class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center space-x-1.5 transition border border-slate-700 self-start sm:self-auto"
        >
          <span>Visualizar Loja</span>
          <span>↗</span>
        </a>
      </div>

      <!-- Toast Feedback -->
      <div v-if="successMsg" class="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between">
        <span>✓ {{ successMsg }}</span>
        <button @click="successMsg = ''" class="text-emerald-400 hover:text-white">&times;</button>
      </div>

      <!-- Live Store Header Preview Card -->
      <div class="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div class="flex items-center justify-between">
          <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Pré-visualização em Tempo Real</p>
          <span class="text-[11px] text-blue-400 font-semibold">Atualiza enquanto você digita</span>
        </div>

        <!-- Simulated Announcement Bar -->
        <div
          v-if="form.showAnnouncement && form.announcementBar"
          class="py-2 px-4 rounded-xl text-center text-xs font-medium text-white shadow-sm transition-colors"
          :style="{ backgroundColor: form.primaryColor || '#0f172a' }"
        >
          {{ form.announcementBar }}
        </div>

        <!-- Simulated Store Navbar -->
        <div class="p-4 rounded-2xl bg-white text-slate-900 border border-slate-200 flex items-center justify-between shadow-sm">
          <div class="flex items-center space-x-3">
            <div
              class="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm"
              :style="{ backgroundColor: form.accentColor || '#2563eb' }"
            >
              {{ form.name ? form.name.slice(0, 2).toUpperCase() : 'LJ' }}
            </div>
            <div>
              <p class="font-extrabold text-sm text-slate-900 leading-tight">{{ form.name || 'Nome da Minha Loja' }}</p>
              <p class="text-[10px] text-slate-400 font-semibold uppercase">Loja Oficial</p>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <button
              type="button"
              class="px-4 py-2 rounded-full text-xs font-bold text-white shadow transition"
              :style="{ backgroundColor: form.accentColor || '#2563eb' }"
            >
              Comprar Agora
            </button>
          </div>
        </div>
      </div>

      <!-- Form Settings -->
      <form @submit.prevent="saveSettings" class="space-y-6">
        <!-- Visual Colors Card -->
        <div class="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <h2 class="text-xs font-bold uppercase tracking-wider text-blue-400">Cores da Identidade Visual</h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">Cor Primária (Topo e Fundo)</label>
              <div class="flex items-center space-x-3">
                <input
                  v-model="form.primaryColor"
                  type="color"
                  class="w-12 h-10 rounded-xl bg-slate-800 border border-slate-700 p-1 cursor-pointer"
                />
                <input
                  v-model="form.primaryColor"
                  type="text"
                  class="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">Cor de Acento (Botões e Destaques)</label>
              <div class="flex items-center space-x-3">
                <input
                  v-model="form.accentColor"
                  type="color"
                  class="w-12 h-10 rounded-xl bg-slate-800 border border-slate-700 p-1 cursor-pointer"
                />
                <input
                  v-model="form.accentColor"
                  type="text"
                  class="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Announcement Bar Card -->
        <div class="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <div class="flex items-center justify-between">
            <h2 class="text-xs font-bold uppercase tracking-wider text-blue-400">Barra de Avisos no Topo</h2>
            <label class="flex items-center space-x-2 cursor-pointer text-xs font-bold text-slate-300">
              <input type="checkbox" v-model="form.showAnnouncement" class="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500" />
              <span>Exibir barra no site</span>
            </label>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1.5">Mensagem do Topo</label>
            <input
              v-model="form.announcementBar"
              type="text"
              placeholder="Ex: 🎉 Frete grátis em compras acima de R$ 199 com o cupom BEMVINDO"
              class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- Store Details & Contact -->
        <div class="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <h2 class="text-xs font-bold uppercase tracking-wider text-blue-400">Informações da Marca & Contato</h2>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">Nome da Loja</label>
              <input
                v-model="form.name"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">Biografia / Descrição da Loja</label>
              <textarea
                v-model="form.description"
                rows="3"
                placeholder="Conte sobre sua marca, proposta de valor e diferenciais..."
                class="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1.5">
                  WhatsApp para Pedidos & Atendimento
                </label>
                <div class="relative">
                  <input
                    v-model="form.contactWhatsapp"
                    type="text"
                    placeholder="11999998888 (DDD + Número)"
                    class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                  <span class="absolute right-3 top-2.5 text-xs text-emerald-400 font-bold">📲 Pedidos & SAC</span>
                </div>
                <p class="text-[11px] text-slate-500 mt-1">Os clientes poderão finalizar pedidos e tirar dúvidas diretamente no seu WhatsApp.</p>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1.5">CEP de Origem (Para cálculo de frete)</label>
                <input
                  v-model="form.originZipcode"
                  type="text"
                  placeholder="01310-100"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Gateway Settings -->
        <div class="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xs font-bold uppercase tracking-wider text-emerald-400">Meios de Pagamento & Integrações</h2>
              <p class="text-xs text-slate-400 mt-0.5">Configure credenciais do Mercado Pago para PIX e Cartão automáticos</p>
            </div>
            <span class="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              ⚡ PIX + Cartão + WhatsApp
            </span>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">Mercado Pago Public Key (Chave Pública)</label>
              <input
                v-model="form.mpPublicKey"
                type="text"
                placeholder="APP_USR-xxxxxx..."
                class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p class="text-[11px] text-slate-500 mt-1">Opcional. Se não preenchido, o sistema simula aprovações de teste automaticamente.</p>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">Mercado Pago Access Token</label>
              <input
                v-model="form.mpAccessToken"
                type="password"
                placeholder="APP_USR-xxxxxx..."
                class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p class="text-[11px] text-slate-500 mt-1">Utilizado para liquidação de PIX e cartão no checkout transparente.</p>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end pt-2">
          <button
            type="submit"
            :disabled="saving"
            class="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition hover:scale-105 disabled:opacity-50"
          >
            {{ saving ? 'Salvando Alterações...' : 'Salvar Todas as Configurações' }}
          </button>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
const { fetchWithAuth, isAuthenticated, initAuth } = useAuth()
const router = useRouter()

const form = reactive({
  name: '',
  subdomain: '',
  description: '',
  primaryColor: '#0f172a',
  accentColor: '#2563eb',
  announcementBar: '',
  showAnnouncement: true,
  contactWhatsapp: '',
  contactEmail: '',
  originZipcode: '01310-100',
  mpAccessToken: '',
  mpPublicKey: '',
})

const loading = ref(true)
const saving = ref(false)
const successMsg = ref('')

const loadStore = async () => {
  loading.value = true
  try {
    const res: any = await fetchWithAuth('/api/admin/store')
    const t = res.tenant || {}
    form.name = t.name || ''
    form.subdomain = t.subdomain || ''
    form.description = t.description || ''
    form.primaryColor = t.primaryColor || '#0f172a'
    form.accentColor = t.accentColor || '#2563eb'
    form.announcementBar = t.announcementBar || ''
    form.showAnnouncement = t.showAnnouncement ?? true
    form.contactWhatsapp = t.contactWhatsapp || ''
    form.contactEmail = t.contactEmail || ''
    form.originZipcode = t.originZipcode || '01310-100'
    form.mpAccessToken = t.mpAccessToken || ''
    form.mpPublicKey = t.mpPublicKey || ''
  } catch {
    router.push('/admin/login')
  } finally {
    loading.value = false
  }
}

const saveSettings = async () => {
  saving.value = true
  successMsg.value = ''

  try {
    await fetchWithAuth('/api/admin/store', {
      method: 'PUT',
      body: form,
    })
    successMsg.value = 'Configurações e cores da loja salvas com sucesso!'
    setTimeout(() => { successMsg.value = '' }, 4000)
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Erro ao salvar.')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  initAuth()
  if (!isAuthenticated.value) {
    router.push('/admin/login')
    return
  }
  loadStore()
})
</script>
