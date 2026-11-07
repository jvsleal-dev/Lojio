<template>
  <div class="min-h-screen bg-slate-50 flex text-slate-900 font-sans selection:bg-emerald-600 selection:text-white">
    <AdminSidebar />

    <main class="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-5xl">
      <!-- Top Breadcrumb & Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <NuxtLink to="/admin/produtos" class="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition mb-1.5 inline-flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Voltar para catálogo de produtos</span>
          </NuxtLink>
          <h1 class="text-2xl font-black text-slate-900">Cadastrar Novo Produto</h1>
          <p class="text-slate-500 text-sm">Adicione fotos, preços, estoque e descrições para vender na sua loja.</p>
        </div>
      </div>

      <form @submit.prevent="submitProduct" class="space-y-6">
        <!-- Error Alert -->
        <div v-if="errorMsg" class="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
          {{ errorMsg }}
        </div>

        <!-- Basic Info Card -->
        <div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
          <h2 class="text-xs font-bold uppercase tracking-wider text-emerald-700">Informações Principais</h2>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">Título do Produto *</label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="Ex: Camiseta Streetwear Heavyweight 100% Algodão"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">Categoria / Departamento</label>
                <select
                  v-model="form.categoryId"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
                >
                  <option value="">Sem Categoria (Geral)</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">Código SKU (Identificador)</label>
                <input
                  v-model="form.sku"
                  type="text"
                  placeholder="EX: CMS-OVR-01"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
                />
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-xs font-bold text-slate-700">Descrição do Produto</label>
                <button
                  type="button"
                  @click="generateAiDescription"
                  :disabled="aiGenerating || !form.name"
                  class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-sm transition disabled:opacity-50"
                  title="Gera uma descrição com base no título do produto"
                >
                  <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>{{ aiGenerating ? 'Lumi gerando...' : 'Lumi Gerar Descrição' }}</span>
                </button>
              </div>
              <textarea
                v-model="form.description"
                rows="6"
                placeholder="Detalhes sobre tecido, medidas, modelagem e garantia..."
                class="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-sans leading-relaxed transition"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Pricing & Stock Card -->
        <div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
          <h2 class="text-xs font-bold uppercase tracking-wider text-emerald-700">Preços & Estoque</h2>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">Preço de Venda (R$) *</label>
              <input
                v-model="form.price"
                type="number"
                step="0.01"
                required
                placeholder="129.90"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-black text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">Preço Original ("De")</label>
              <input
                v-model="form.compareAtPrice"
                type="number"
                step="0.01"
                placeholder="159.90"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">Estoque Disponível *</label>
              <input
                v-model="form.stockQuantity"
                type="number"
                required
                class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
              />
            </div>
          </div>
        </div>

        <!-- Images Card -->
        <div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
          <h2 class="text-xs font-bold uppercase tracking-wider text-emerald-700">Fotos do Produto</h2>

          <div class="flex space-x-2">
            <input
              v-model="newImageUrl"
              type="url"
              placeholder="Cole a URL da foto (ex: https://images.unsplash.com/...)"
              class="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
            />
            <button
              type="button"
              @click="addImage"
              class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition"
            >
              + Adicionar Foto
            </button>
          </div>

          <div class="flex flex-wrap gap-3 pt-2">
            <div
              v-for="(img, idx) in form.images"
              :key="idx"
              class="w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 relative group shadow-xs"
            >
              <img :src="img" class="w-full h-full object-cover" />
              <button
                type="button"
                @click="removeImage(idx)"
                class="absolute inset-0 bg-rose-600/90 text-white font-bold opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs"
              >
                Remover
              </button>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end space-x-4 pt-2">
          <NuxtLink
            to="/admin/produtos"
            class="px-6 py-3 rounded-full text-xs font-bold text-slate-500 hover:text-slate-900 transition"
          >
            Cancelar
          </NuxtLink>
          <button
            type="submit"
            :disabled="loading"
            class="px-8 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {{ loading ? 'Publicando...' : 'Salvar e Publicar Produto' }}
          </button>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
})

const { fetchWithAuth, isAuthenticated, initAuth } = useAuth()
const router = useRouter()

const form = reactive({
  name: '',
  categoryId: '',
  description: '',
  price: '',
  compareAtPrice: '',
  costPrice: '',
  sku: '',
  stockQuantity: '20',
  weightGrams: '300',
  images: [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
  ],
})

const newImageUrl = ref('')
const categories = ref<any[]>([])
const loading = ref(false)
const aiGenerating = ref(false)
const errorMsg = ref('')

const generateAiDescription = () => {
  if (!form.name) return
  aiGenerating.value = true
  setTimeout(() => {
    const pName = form.name
    form.description = `**${pName}** - Exclusividade e Qualidade Premium\n\nProjetado para quem valoriza estilo, durabilidade e autenticidade. Cada detalhe foi desenvolvido com materiais de alta performance, garantindo conforto inigualável e um caimento impecável para todas as ocasiões.\n\n**Destaques do Produto:**\n• Acabamento de alto padrão com costura reforçada\n• Conforto térmico e toque macio ao longo de todo o dia\n• Modelagem anatômica que valoriza a silhueta\n• Peça versátil: ideal do casual ao evento sofisticado\n\n**Envio Seguro:** Pronta entrega com rastreamento detalhado e garantia de satisfação ou seu dinheiro de volta.`
    aiGenerating.value = false
  }, 450)
}

const addImage = () => {
  if (newImageUrl.value.trim()) {
    form.images.push(newImageUrl.value.trim())
    newImageUrl.value = ''
  }
}

const removeImage = (idx: number) => {
  form.images.splice(idx, 1)
}

const submitProduct = async () => {
  if (!form.name || !form.price) {
    errorMsg.value = 'Preencha o nome e o preço de venda do produto.'
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    await fetchWithAuth('/api/admin/products', {
      method: 'POST',
      body: {
        ...form,
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
        stockQuantity: Number(form.stockQuantity),
        weightGrams: Number(form.weightGrams),
      }
    })

    router.push('/admin/produtos')
  } catch (err: any) {
    errorMsg.value = err.data?.statusMessage || 'Erro ao cadastrar produto.'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  initAuth()
  if (!isAuthenticated.value) {
    router.push('/admin/login')
    return
  }

  try {
    const res: any = await fetchWithAuth('/api/admin/categories')
    categories.value = res.categories || []
    if (categories.value.length) {
      form.categoryId = categories.value[0].id
    }
  } catch {}
})
</script>
