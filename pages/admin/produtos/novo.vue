<template>
  <div class="min-h-screen bg-slate-950 flex text-slate-100">
    <AdminSidebar />

    <main class="flex-1 overflow-y-auto p-8 space-y-6 max-w-5xl">
      <!-- Top Breadcrumb & Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <NuxtLink to="/admin/produtos" class="text-xs font-bold text-blue-400 hover:text-blue-300 transition mb-1 inline-block">
            &larr; Voltar para catálogo de produtos
          </NuxtLink>
          <h1 class="text-2xl font-black text-white">Cadastrar Novo Produto</h1>
          <p class="text-slate-400 text-sm">Adicione fotos, preços, estoque e descrições para vender na sua loja.</p>
        </div>
      </div>

      <form @submit.prevent="submitProduct" class="space-y-6">
        <!-- Error Alert -->
        <div v-if="errorMsg" class="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold">
          {{ errorMsg }}
        </div>

        <!-- Basic Info Card -->
        <div class="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <h2 class="text-xs font-bold uppercase tracking-wider text-blue-400">Informações Principais</h2>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">Título do Produto *</label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="Ex: Camiseta Streetwear Heavyweight 100% Algodão"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1.5">Categoria / Departamento</label>
                <select
                  v-model="form.categoryId"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sem Categoria (Geral)</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1.5">Código SKU (Identificador)</label>
                <input
                  v-model="form.sku"
                  type="text"
                  placeholder="EX: CMS-OVR-01"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-xs font-bold text-slate-300">Descrição do Produto</label>
                <button
                  type="button"
                  @click="generateAiDescription"
                  :disabled="aiGenerating || !form.name"
                  class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-[11px] font-bold shadow-md shadow-purple-600/30 transition disabled:opacity-50"
                  title="Gera uma descrição persuasiva com base no título do produto"
                >
                  <span>✨</span>
                  <span>{{ aiGenerating ? 'Lumi IA gerando...' : 'Lumi IA Gerar Descrição' }}</span>
                </button>
              </div>
              <textarea
                v-model="form.description"
                rows="6"
                placeholder="Detalhes sobre tecido, medidas, modelagem e garantia..."
                class="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans leading-relaxed"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Pricing & Stock Card -->
        <div class="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <h2 class="text-xs font-bold uppercase tracking-wider text-blue-400">Preços & Estoque</h2>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">Preço de Venda (R$) *</label>
              <input
                v-model="form.price"
                type="number"
                step="0.01"
                required
                placeholder="129.90"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">Preço Original ("De")</label>
              <input
                v-model="form.compareAtPrice"
                type="number"
                step="0.01"
                placeholder="159.90"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">Estoque Disponível *</label>
              <input
                v-model="form.stockQuantity"
                type="number"
                required
                class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <!-- Images Card -->
        <div class="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <h2 class="text-xs font-bold uppercase tracking-wider text-blue-400">Fotos do Produto</h2>

          <div class="flex space-x-2">
            <input
              v-model="newImageUrl"
              type="url"
              placeholder="Cole a URL da foto (ex: https://images.unsplash.com/...)"
              class="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              @click="addImage"
              class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
            >
              + Adicionar Foto
            </button>
          </div>

          <div class="flex flex-wrap gap-3 pt-2">
            <div
              v-for="(img, idx) in form.images"
              :key="idx"
              class="w-24 h-24 rounded-2xl overflow-hidden border border-slate-700 relative group"
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
            class="px-6 py-3 rounded-full text-xs font-bold text-slate-400 hover:text-white transition"
          >
            Cancelar
          </NuxtLink>
          <button
            type="submit"
            :disabled="loading"
            class="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition hover:scale-105 disabled:opacity-50"
          >
            {{ loading ? 'Publicando...' : 'Salvar e Publicar Produto' }}
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
  if (!form.value.name) return
  aiGenerating.value = true
  setTimeout(() => {
    const pName = form.value.name
    form.value.description = `🔥 **${pName}** - Exclusividade e Qualidade Premium\n\nProjetado para quem valoriza estilo, durabilidade e autenticidade. Cada detalhe foi desenvolvido com materiais de alta performance, garantindo conforto inigualável e um caimento impecável para todas as ocasiões.\n\n✨ **Destaques do Produto:**\n• Acabamento de alto padrão com costura reforçada\n• Conforto térmico e toque macio ao longo de todo o dia\n• Modelagem anatômica que valoriza a silhueta\n• Peça versátil: ideal do casual ao evento sofisticado\n\n📦 **Envio Seguro:** Pronta entrega com rastreamento detalhado e garantia de satisfação ou seu dinheiro de volta.`
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
