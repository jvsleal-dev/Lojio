<template>
  <div class="min-h-screen bg-slate-50 flex text-slate-900 font-sans selection:bg-emerald-600 selection:text-white">
    <AdminSidebar />

    <main class="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 class="text-2xl font-black text-slate-900">Catálogo de Produtos</h1>
          <p class="text-slate-500 text-sm">Gerencie preços, estoque, fotos e visibilidade no e-commerce.</p>
        </div>

        <NuxtLink
          to="/admin/produtos/novo"
          class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center space-x-2 transition self-start sm:self-auto hover:scale-105 active:scale-95"
        >
          <span>+ Cadastrar Novo Produto</span>
        </NuxtLink>
      </div>

      <!-- Filters & Search Bar -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
        <div class="relative w-full sm:w-96">
          <input
            v-model="search"
            type="text"
            placeholder="Buscar por nome do produto ou SKU..."
            class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>

        <div class="flex items-center space-x-3 text-xs">
          <span class="text-slate-500">Total: <strong class="text-slate-900">{{ filteredProducts.length }}</strong> itens</span>
        </div>
      </div>

      <!-- Toast Feedback -->
      <div v-if="toastMsg" class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-sm">
        <span>{{ toastMsg }}</span>
        <button @click="toastMsg = ''" class="text-emerald-600 hover:text-emerald-900 p-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="py-20 text-center">
        <div class="inline-block animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mb-3"></div>
        <p class="text-slate-500 text-sm">Carregando catálogo de produtos...</p>
      </div>

      <!-- Products Table -->
      <div v-else class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider">
                <th class="py-4 px-6">Produto & Imagem</th>
                <th class="py-4 px-6">Categoria</th>
                <th class="py-4 px-6">Preço de Venda</th>
                <th class="py-4 px-6">Estoque</th>
                <th class="py-4 px-6">Status na Loja</th>
                <th class="py-4 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-medium">
              <tr v-for="p in filteredProducts" :key="p.id" class="hover:bg-slate-50/80 transition">
                <!-- Foto e Nome -->
                <td class="py-4 px-6">
                  <div class="flex items-center space-x-3.5">
                    <img
                      :src="p.coverImage"
                      :alt="p.name"
                      class="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0 shadow-xs"
                    />
                    <div>
                      <p class="font-bold text-slate-900 text-sm line-clamp-1">{{ p.name }}</p>
                      <p v-if="p.sku" class="text-[11px] text-slate-400 font-mono mt-0.5">SKU: {{ p.sku }}</p>
                      <span v-if="p.hasVariants && p.variants" class="text-[10px] text-emerald-700 font-semibold">
                        {{ p.variants.length }} variações
                      </span>
                    </div>
                  </div>
                </td>

                <!-- Categoria -->
                <td class="py-4 px-6">
                  <span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                    {{ p.category?.name || 'Geral' }}
                  </span>
                </td>

                <!-- Preço -->
                <td class="py-4 px-6">
                  <p class="font-black text-slate-900 text-sm">{{ formatCurrency(p.price) }}</p>
                  <p v-if="p.compareAtPrice && p.compareAtPrice > p.price" class="text-[11px] text-slate-400 line-through">
                    {{ formatCurrency(p.compareAtPrice) }}
                  </p>
                </td>

                <!-- Estoque -->
                <td class="py-4 px-6">
                  <span
                    class="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider"
                    :class="p.stockQuantity > 5 ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-amber-50 text-amber-700 border border-amber-200'"
                  >
                    {{ p.stockQuantity }} unid.
                  </span>
                </td>

                <!-- Status Toggle -->
                <td class="py-4 px-6">
                  <button
                    @click="toggleActive(p)"
                    class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold transition"
                    :class="p.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' : 'bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200'"
                  >
                    <span class="w-2 h-2 rounded-full" :class="p.isActive ? 'bg-emerald-500' : 'bg-slate-400'"></span>
                    <span>{{ p.isActive ? 'Ativo na Loja' : 'Pausado' }}</span>
                  </button>
                </td>

                <!-- Ações -->
                <td class="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                  <!-- Editar Produto -->
                  <button
                    @click="openEditModal(p)"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition"
                    title="Editar dados e preço do produto"
                  >
                    <svg class="w-3.5 h-3.5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>Editar</span>
                  </button>

                  <!-- Ver no site -->
                  <a
                    :href="`/produto/${p.slug}`"
                    target="_blank"
                    class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200"
                    title="Ver página do produto na loja"
                  >
                    <span>Ver</span>
                    <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                  </a>

                  <!-- Excluir -->
                  <button
                    @click="deleteProduct(p)"
                    class="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition"
                    title="Excluir produto"
                  >
                    Excluir
                  </button>
                </td>
              </tr>

              <tr v-if="!filteredProducts.length">
                <td colspan="6" class="py-12 text-center text-slate-400">
                  Nenhum produto encontrado. Cadastre seu primeiro produto no botão acima!
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal de Edição Rápida de Produto -->
      <div v-if="editingProduct" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
        <div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl text-slate-900 max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h3 class="font-black text-slate-900 text-base">Editar Produto</h3>
              <p class="text-xs text-slate-500">Atualize dados, fotos e valores do item</p>
            </div>
            <button @click="editingProduct = null" class="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveProductEdits" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Nome do Produto</label>
              <input
                v-model="editForm.name"
                type="text"
                required
                class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Preço de Venda (R$)</label>
                <input
                  v-model.number="editForm.price"
                  type="number"
                  step="0.01"
                  required
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Preço De / Comparativo (R$)</label>
                <input
                  v-model.number="editForm.compareAtPrice"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 199.90"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Quantidade em Estoque</label>
                <input
                  v-model.number="editForm.stockQuantity"
                  type="number"
                  required
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Código SKU</label>
                <input
                  v-model="editForm.sku"
                  type="text"
                  placeholder="Ex: CAM-001"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs uppercase font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Categoria</label>
              <select
                v-model="editForm.categoryId"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
              >
                <option :value="null">Sem categoria (Geral)</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">URL da Imagem Principal</label>
              <input
                v-model="editForm.imageInput"
                type="url"
                placeholder="https://images.unsplash.com/..."
                class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Descrição do Produto</label>
              <textarea
                v-model="editForm.description"
                rows="3"
                class="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
              ></textarea>
            </div>

            <div class="flex items-center space-x-6 pt-2">
              <label class="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input type="checkbox" v-model="editForm.isActive" class="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                <span>Ativo para venda</span>
              </label>

              <label class="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input type="checkbox" v-model="editForm.isFeatured" class="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                <span>Destacar na vitrine inicial</span>
              </label>
            </div>

            <div class="pt-4 flex justify-end space-x-3 border-t border-slate-100">
              <button
                type="button"
                @click="editingProduct = null"
                class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="savingEdit"
                class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
              >
                {{ savingEdit ? 'Salvando...' : 'Salvar Alterações' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
})

const { fetchWithAuth, isAuthenticated, initAuth } = useAuth()
const router = useRouter()

const products = ref<any[]>([])
const categories = ref<any[]>([])
const loading = ref(true)
const search = ref('')
const toastMsg = ref('')

const editingProduct = ref<any>(null)
const savingEdit = ref(false)
const editForm = reactive({
  id: '',
  name: '',
  price: 0,
  compareAtPrice: null as number | null,
  stockQuantity: 0,
  sku: '',
  categoryId: null as string | null,
  description: '',
  imageInput: '',
  isActive: true,
  isFeatured: false,
})

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0)
}

const filteredProducts = computed(() => {
  if (!search.value.trim()) return products.value
  const q = search.value.toLowerCase().trim()
  return products.value.filter(p =>
    p.name.toLowerCase().includes(q) ||
    (p.sku && p.sku.toLowerCase().includes(q))
  )
})

const loadProducts = async () => {
  loading.value = true
  try {
    const [resProducts, resCategories]: any = await Promise.all([
      fetchWithAuth('/api/admin/products'),
      fetchWithAuth('/api/admin/categories').catch(() => ({ categories: [] })),
    ])
    products.value = resProducts.products || []
    categories.value = resCategories.categories || []
  } catch {
    router.push('/admin/login')
  } finally {
    loading.value = false
  }
}

const openEditModal = (p: any) => {
  editingProduct.value = p
  editForm.id = p.id
  editForm.name = p.name
  editForm.price = p.price
  editForm.compareAtPrice = p.compareAtPrice || null
  editForm.stockQuantity = p.stockQuantity || 0
  editForm.sku = p.sku || ''
  editForm.categoryId = p.categoryId || null
  editForm.description = p.description || ''
  editForm.imageInput = p.coverImage || ''
  editForm.isActive = p.isActive ?? true
  editForm.isFeatured = p.isFeatured ?? false
}

const saveProductEdits = async () => {
  if (!editForm.id) return
  savingEdit.value = true

  const images = editForm.imageInput ? [editForm.imageInput] : []

  try {
    const res: any = await fetchWithAuth(`/api/admin/products/${editForm.id}`, {
      method: 'PUT',
      body: {
        name: editForm.name,
        price: editForm.price,
        compareAtPrice: editForm.compareAtPrice,
        stockQuantity: editForm.stockQuantity,
        sku: editForm.sku,
        categoryId: editForm.categoryId,
        description: editForm.description,
        images,
        isActive: editForm.isActive,
        isFeatured: editForm.isFeatured,
      },
    })

    toastMsg.value = 'Produto atualizado com sucesso!'
    editingProduct.value = null
    await loadProducts()
    setTimeout(() => { toastMsg.value = '' }, 3000)
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Erro ao salvar alterações no produto.')
  } finally {
    savingEdit.value = false
  }
}

const toggleActive = async (product: any) => {
  try {
    const res: any = await fetchWithAuth(`/api/admin/products/${product.id}/toggle`, {
      method: 'PATCH'
    })
    product.isActive = res.product.isActive
    toastMsg.value = res.message
    setTimeout(() => { toastMsg.value = '' }, 3000)
  } catch (err: any) {
    toastMsg.value = err.data?.statusMessage || 'Erro ao alterar status.'
  }
}

const deleteProduct = async (product: any) => {
  if (!confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) return

  try {
    await fetchWithAuth(`/api/admin/products/${product.id}`, {
      method: 'DELETE'
    })
    products.value = products.value.filter(p => p.id !== product.id)
    toastMsg.value = 'Produto excluído com sucesso!'
    setTimeout(() => { toastMsg.value = '' }, 3000)
  } catch (err: any) {
    toastMsg.value = err.data?.statusMessage || 'Erro ao excluir produto.'
  }
}

onMounted(() => {
  initAuth()
  if (!isAuthenticated.value) {
    router.push('/admin/login')
    return
  }
  loadProducts()
})
</script>
