<template>
  <div class="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
    <AdminSidebar :tenant="tenant" />

    <main class="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
      <!-- Top Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div class="flex items-center space-x-2.5">
            <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <h1 class="text-2xl font-black text-slate-900">Categorias de Produtos</h1>
          </div>
          <p class="text-slate-500 text-sm mt-1">
            Organize os departamentos e menus da sua loja para facilitar a navegação dos clientes.
          </p>
        </div>

        <button
          @click="openModal = true"
          class="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition hover:scale-105 active:scale-95 shrink-0"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
          </svg>
          <span>Nova Categoria</span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20 text-slate-500">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
        Carregando categorias...
      </div>

      <!-- Empty State -->
      <div v-else-if="categories.length === 0" class="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div class="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-slate-900 mb-2">Nenhuma categoria cadastrada</h3>
        <p class="text-slate-500 text-sm max-w-md mx-auto mb-6">
          Categorias agrupam produtos semelhantes e são exibidas como abas de filtro na sua vitrine.
        </p>
        <button
          @click="openModal = true"
          class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition hover:scale-105 active:scale-95"
        >
          Criar Primeira Categoria
        </button>
      </div>

      <!-- Categories Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="cat in categories"
          :key="cat.id"
          class="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 transition flex items-center justify-between group shadow-sm hover:shadow-md"
        >
          <div class="flex items-center space-x-4 min-w-0">
            <div class="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
              <img
                v-if="cat.imageUrl"
                :src="cat.imageUrl"
                :alt="cat.name"
                class="w-full h-full object-cover"
              />
              <svg v-else class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>

            <div class="min-w-0">
              <h3 class="font-bold text-slate-900 truncate text-base group-hover:text-blue-600 transition">
                {{ cat.name }}
              </h3>
              <p class="text-xs text-slate-400 font-mono truncate">
                /categoria/{{ cat.slug }}
              </p>
              <div class="flex items-center space-x-2 mt-1.5">
                <span class="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                  {{ cat._count?.products || 0 }} produtos
                </span>
              </div>
            </div>
          </div>

          <button
            @click="deleteCategory(cat)"
            class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
            title="Excluir categoria"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Modal Nova Categoria -->
      <div v-if="openModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div class="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-2xl relative text-slate-900">
          <button
            @click="openModal = false"
            class="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition text-2xl leading-none"
          >
            &times;
          </button>

          <h2 class="text-xl font-black text-slate-900 mb-1">Nova Categoria</h2>
          <p class="text-slate-500 text-xs mb-6">Ex: Roupas, Calçados, Eletrônicos, Cafés em Grãos.</p>

          <form @submit.prevent="createCategory" class="space-y-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Nome da Categoria *
              </label>
              <input
                v-model="name"
                type="text"
                required
                placeholder="Ex: Tênis & Sneakers"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              />
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                URL da Imagem / Ícone (Opcional)
              </label>
              <input
                v-model="imageUrl"
                type="url"
                placeholder="https://images.unsplash.com/..."
                class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-mono transition"
              />
            </div>

            <div v-if="errorMsg" class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              {{ errorMsg }}
            </div>

            <div class="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100">
              <button
                type="button"
                @click="openModal = false"
                class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition disabled:opacity-50"
              >
                {{ saving ? 'Criando...' : 'Criar Categoria' }}
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
  middleware: 'admin',
})

const { token } = useAuth()
const loading = ref(true)
const saving = ref(false)
const openModal = ref(false)
const categories = ref([])
const tenant = ref(null)
const errorMsg = ref('')

const name = ref('')
const imageUrl = ref('')

async function loadData() {
  loading.value = true
  try {
    const [catsRes, storeRes] = await Promise.all([
      $fetch('/api/admin/categories', {
        headers: { Authorization: `Bearer ${token.value}` },
      }),
      $fetch('/api/admin/store', {
        headers: { Authorization: `Bearer ${token.value}` },
      }),
    ])
    categories.value = catsRes?.categories || []
    tenant.value = storeRes?.tenant || null
  } catch (err) {
    console.error('Erro ao carregar dados:', err)
  } finally {
    loading.value = false
  }
}

async function createCategory() {
  saving.value = true
  errorMsg.value = ''
  try {
    const res = await $fetch('/api/admin/categories', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
      body: {
        name: name.value,
        imageUrl: imageUrl.value || undefined,
      },
    })
    categories.value.unshift({
      ...res.category,
      _count: { products: 0 }
    })
    openModal.value = false
    name.value = ''
    imageUrl.value = ''
  } catch (err) {
    errorMsg.value = err?.data?.statusMessage || err?.data?.message || 'Falha ao criar categoria'
  } finally {
    saving.value = false
  }
}

async function deleteCategory(cat) {
  if (!confirm(`Deseja realmente excluir a categoria "${cat.name}"?`)) return
  try {
    await $fetch(`/api/admin/categories/${cat.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token.value}` },
    })
    categories.value = categories.value.filter(c => c.id !== cat.id)
  } catch (err) {
    alert('Erro ao excluir categoria. Verifique se não há produtos vinculados a ela.')
  }
}

onMounted(() => {
  loadData()
})
</script>
