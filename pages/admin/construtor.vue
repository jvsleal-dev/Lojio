<template>
  <div class="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white select-none">
    <!-- Top Bar: Nuvemshop Style (Voltar, Seletor de Página, Viewports, Desfazer e Salvar & Publicar) -->
    <header class="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 z-30">
      <div class="flex items-center space-x-3">
        <NuxtLink
          to="/admin"
          class="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition"
        >
          <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="text-sm font-extrabold text-slate-900">Editar design</span>
        </NuxtLink>

        <!-- Seletor de Página (Início, Produtos, Contato) -->
        <div class="relative">
          <select
            v-model="currentPage"
            class="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-1.5 pr-8 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 cursor-pointer transition"
          >
            <option value="home">Início</option>
            <option value="catalog">Produtos</option>
            <option value="contact">Contato</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>

      <!-- Viewports (Celular / Computador / 3D) & Undo/Redo -->
      <div class="flex items-center space-x-2">
        <div class="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          <button
            @click="previewDevice = 'mobile'"
            type="button"
            :class="previewDevice === 'mobile' ? 'bg-white shadow-xs text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'"
            class="p-1.5 rounded-lg transition"
            title="Visualização Celular"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            @click="previewDevice = 'desktop'"
            type="button"
            :class="previewDevice === 'desktop' ? 'bg-white shadow-xs text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'"
            class="p-1.5 rounded-lg transition"
            title="Visualização Computador"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            @click="previewDevice = '3d'"
            type="button"
            :class="previewDevice === '3d' ? 'bg-white shadow-xs text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'"
            class="px-2 py-1 rounded-lg text-xs transition flex items-center space-x-1"
            title="Modo 3D Three.js"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span class="text-[11px] font-bold">3D</span>
          </button>
        </div>

        <!-- Botão Ver Vitrine -->
        <a
          :href="storeLink"
          target="_blank"
          class="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition shadow-2xs"
          title="Abrir vitrine em nova aba"
        >
          <span>Ver Vitrine</span>
          <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      <!-- Direita: Status do Design e Botão Salvar e Publicar -->
      <div class="flex items-center space-x-3">
        <span class="hidden sm:inline-flex items-center space-x-1.5 text-xs text-slate-500">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Design atual</span>
        </span>

        <button
          @click="saveLayout"
          :disabled="saving"
          class="px-5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm transition active:scale-95 disabled:opacity-50 flex items-center space-x-1.5"
        >
          <svg v-if="saving" class="animate-spin w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <svg v-else class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>{{ saving ? 'Salvando...' : 'Salvar e publicar' }}</span>
        </button>
      </div>
    </header>

    <!-- Feedback Toast -->
    <Transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="toastMsg"
        class="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-2.5 text-xs font-bold border"
        :class="toastType === 'success' ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-900/30' : 'bg-rose-600 text-white border-rose-500 shadow-rose-900/30'"
      >
        <svg v-if="toastType === 'success'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        <span>{{ toastMsg }}</span>
      </div>
    </Transition>

    <!-- Modal Adicionar Nova Seção -->
    <div
      v-if="showAddSectionModal"
      class="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4 animate-fade-in"
      @click.self="showAddSectionModal = false"
    >
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="text-base font-extrabold text-slate-900">Adicionar seção à vitrine</h3>
            <p class="text-xs text-slate-500">Escolha o tipo de bloco que deseja inserir</p>
          </div>
          <button @click="showAddSectionModal = false" class="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">✕</button>
        </div>

        <div class="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto p-1">
          <button
            v-for="widget in availableWidgets"
            :key="widget.type"
            @click="insertSection(widget.type)"
            type="button"
            class="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/70 hover:border-emerald-500 flex flex-col items-center text-center transition group cursor-pointer"
          >
            <div class="w-10 h-10 rounded-xl bg-white border border-slate-200 group-hover:border-emerald-300 flex items-center justify-center mb-2 shadow-2xs text-slate-700">
              <svg v-if="widget.type === 'hero'" class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              <svg v-else-if="widget.type === 'banner'" class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
              <svg v-else-if="widget.type === 'products'" class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              <svg v-else class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <span class="text-xs font-bold text-slate-800 group-hover:text-emerald-900">{{ widget.title }}</span>
            <span class="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{{ widget.desc }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Studio 3 Columns (Esquerda: Árvore de Seções | Centro: Vitrine ao Vivo | Direita: Inspector de Propriedades) -->
    <div class="flex-1 flex overflow-hidden">
      <!-- PAINEL ESQUERDO: Árvore de Seções (Nuvemshop: Cabeçalho, Início/Carrossel/Produtos/Banners, Rodapé) -->
      <aside class="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10 overflow-y-auto select-none">
        <!-- Grupo 1: Cabeçalho -->
        <div class="p-3 border-b border-slate-100">
          <div class="flex items-center justify-between mb-1 px-1">
            <span class="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <span>⌵</span> Cabeçalho
            </span>
          </div>

          <div class="space-y-1">
            <button
              @click="activeSection = 'header-nav'"
              type="button"
              class="w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition"
              :class="activeSection === 'header-nav' ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200' : 'text-slate-600 hover:bg-slate-50'"
            >
              <span class="flex items-center gap-2 truncate">
                <span class="text-slate-400">⊞</span> Barra de navegação
              </span>
            </button>

            <button
              @click="activeSection = 'header-brand'"
              type="button"
              class="w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition"
              :class="activeSection === 'header-brand' ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200' : 'text-slate-600 hover:bg-slate-50'"
            >
              <span class="flex items-center gap-2 truncate">
                <span class="text-slate-400">⊡</span> Logo & Título
              </span>
            </button>
          </div>
        </div>

        <!-- Grupo 2: Início (Página Atual com Blocos Ordenáveis) -->
        <div class="p-3 border-b border-slate-100 flex-1">
          <div class="flex items-center justify-between mb-2 px-1">
            <span class="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <span>⌵</span> Início
            </span>
            <button
              @click="showAddSectionModal = true"
              type="button"
              class="w-6 h-6 rounded-lg text-emerald-700 hover:bg-emerald-50 flex items-center justify-center font-bold text-sm transition"
              title="Adicionar seção"
            >
              +
            </button>
          </div>

          <!-- Lista de Blocos Draggable -->
          <div class="space-y-1.5">
            <div
              v-for="(block, index) in blocks"
              :key="block.id"
              draggable="true"
              @dragstart="onDragStart(index)"
              @dragover.prevent="onDragOver(index)"
              @drop="onDrop(index)"
              @click="selectBlock(block.id)"
              class="p-2.5 rounded-xl border text-xs transition cursor-grab active:cursor-grabbing flex items-center justify-between group"
              :class="[
                activeSection === block.id ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold shadow-2xs' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300',
                dragOverIndex === index ? 'ring-2 ring-emerald-500 bg-emerald-100/50' : ''
              ]"
            >
              <div class="flex items-center space-x-2 truncate">
                <span class="text-slate-400 cursor-grab text-xs">⋮⋮</span>
                <span class="truncate">{{ block.title || block.type }}</span>
              </div>

              <div class="flex items-center space-x-0.5 opacity-70 group-hover:opacity-100">
                <button
                  @click.stop="moveBlock(index, -1)"
                  :disabled="index === 0"
                  class="p-0.5 rounded hover:bg-slate-200 text-slate-500 text-[10px] disabled:opacity-20"
                  title="Subir"
                >
                  ▲
                </button>
                <button
                  @click.stop="moveBlock(index, 1)"
                  :disabled="index === blocks.length - 1"
                  class="p-0.5 rounded hover:bg-slate-200 text-slate-500 text-[10px] disabled:opacity-20"
                  title="Descer"
                >
                  ▼
                </button>
                <button
                  @click.stop="removeBlock(block.id)"
                  class="p-0.5 rounded hover:bg-rose-100 hover:text-rose-600 text-slate-400 text-[10px]"
                  title="Remover"
                >
                  ✕
                </button>
              </div>
            </div>

            <button
              @click="showAddSectionModal = true"
              type="button"
              class="w-full py-2.5 px-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-400 text-xs text-slate-500 hover:text-emerald-700 font-bold flex items-center justify-center gap-1.5 transition mt-2 cursor-pointer"
            >
              <span>+ Adicionar seção</span>
            </button>
          </div>
        </div>

        <!-- Grupo 3: Rodapé -->
        <div class="p-3">
          <div class="flex items-center justify-between mb-1 px-1">
            <span class="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <span>⌵</span> Rodapé
            </span>
          </div>

          <button
            @click="activeSection = 'footer-info'"
            type="button"
            class="w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition"
            :class="activeSection === 'footer-info' ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200' : 'text-slate-600 hover:bg-slate-50'"
          >
            <span class="flex items-center gap-2 truncate">
              <span class="text-slate-400">⊡</span> Rodapé da página
            </span>
          </button>
        </div>
      </aside>

      <!-- PAINEL CENTRAL: Vitrine ao Vivo (Mobile / Desktop / 3D) -->
      <main class="flex-1 bg-slate-200/90 p-4 md:p-6 overflow-y-auto flex justify-center items-start">
        <!-- Modo 3D Three.js -->
        <div v-if="previewDevice === '3d'" class="w-full max-w-4xl h-[620px] bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 flex flex-col">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 class="text-sm font-extrabold text-slate-900">Showcase 3D Interativo (Three.js)</h3>
              <p class="text-xs text-slate-500">Modelo tridimensional da sua loja física e vitrine</p>
            </div>
            <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Ao vivo</span>
          </div>
          <div class="flex-1 rounded-2xl overflow-hidden border border-slate-100">
            <Store3DPreview
              :themeColor="storeInfo.primaryColor"
              :accentColor="storeInfo.accentColor"
              :storeName="storeInfo.name"
            />
          </div>
        </div>

        <!-- Modo Visual Simulado (Desktop ou Mobile) -->
        <div
          v-else
          :class="previewDevice === 'mobile' ? 'w-[380px] min-h-[720px] rounded-[36px] border-8 border-slate-900 shadow-2xl overflow-hidden' : 'w-full max-w-4xl rounded-2xl shadow-xl border border-slate-300'"
          class="bg-white transition-all duration-300 flex flex-col"
        >
          <!-- Barra de Avisos Superior -->
          <div
            v-if="storeInfo.announcementBar"
            class="py-2 px-4 text-center text-xs font-bold text-white transition-colors cursor-pointer hover:opacity-90"
            :style="{ backgroundColor: storeInfo.primaryColor || '#059669' }"
            @click="activeSection = 'header-nav'"
          >
            {{ storeInfo.announcementBar }}
          </div>

          <!-- Header da Loja (Nuvemshop Look) -->
          <header
            class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white cursor-pointer hover:bg-slate-50/50 transition"
            :class="activeSection === 'header-brand' ? 'ring-2 ring-emerald-500' : ''"
            @click="activeSection = 'header-brand'"
          >
            <div class="flex items-center space-x-3">
              <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>

            <!-- Logo ou Nome -->
            <div class="text-center">
              <img v-if="storeInfo.logoUrl" :src="storeInfo.logoUrl" alt="Logo" class="h-8 max-w-[160px] object-contain mx-auto" />
              <h1 v-else class="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {{ storeInfo.name || 'João vitor dos santos leal' }}
              </h1>
            </div>

            <!-- Ícones Usuário e Sacola -->
            <div class="flex items-center space-x-3 text-slate-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              <div class="relative">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                <span class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-900 text-white text-[9px] font-bold flex items-center justify-center">0</span>
              </div>
            </div>
          </header>

          <!-- Menu de Categorias -->
          <nav class="py-2.5 px-6 border-b border-slate-100 flex items-center justify-center space-x-6 text-xs font-bold text-slate-600">
            <span class="text-emerald-700 border-b-2 border-emerald-600 pb-1">INÍCIO</span>
            <span class="hover:text-slate-900 cursor-pointer">PRODUTOS</span>
            <span class="hover:text-slate-900 cursor-pointer">CONTATO</span>
          </nav>

          <!-- Seções / Blocos Dinâmicos da Página -->
          <div class="flex-1 divide-y divide-slate-100">
            <div
              v-for="block in blocks"
              :key="block.id"
              @click="selectBlock(block.id)"
              class="relative transition hover:ring-2 hover:ring-emerald-400 cursor-pointer group"
              :class="activeSection === block.id ? 'ring-2 ring-emerald-600 shadow-xs' : ''"
            >
              <!-- Tag Flutuante do Bloco -->
              <span class="absolute top-2 left-2 z-10 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white shadow-xs opacity-0 group-hover:opacity-100 transition">
                {{ block.title || block.type }}
              </span>

              <!-- 1. SLIDE / CARROSSEL HERO -->
              <div
                v-if="block.type === 'hero'"
                class="relative min-h-[340px] flex items-center justify-center overflow-hidden transition-all"
                :class="[block.props.padding || 'py-14', block.props.align === 'text-left' ? 'text-left items-start px-8' : 'text-center']"
                :style="{ backgroundColor: block.props.bgColor || '#f1f5f9' }"
              >
                <!-- Background Image -->
                <img
                  v-if="block.props.bgImage || storeInfo.bannerUrl"
                  :src="block.props.bgImage || storeInfo.bannerUrl"
                  alt="Banner"
                  class="absolute inset-0 w-full h-full object-cover opacity-90"
                />
                <div v-else class="absolute inset-0 bg-gradient-to-r from-blue-100/60 via-purple-50/50 to-amber-100/60"></div>

                <!-- Conteúdo do Slide -->
                <div class="relative z-10 max-w-lg p-6 space-y-3">
                  <h2
                    class="text-3xl sm:text-5xl font-black tracking-tight"
                    :style="{ color: block.props.textColor || '#111827' }"
                  >
                    {{ block.props.title || 'Título em Destaque' }}
                  </h2>
                  <p
                    v-if="block.props.subtitle"
                    class="text-xs sm:text-sm font-medium"
                    :style="{ color: block.props.textColor || '#374151' }"
                  >
                    {{ block.props.subtitle }}
                  </p>
                  <div>
                    <button
                      type="button"
                      class="px-6 py-2.5 rounded-lg text-xs font-black shadow-md transition hover:scale-105 active:scale-95"
                      :style="{
                        backgroundColor: block.props.btnColor || '#000000',
                        color: block.props.btnTextColor || '#ffffff'
                      }"
                    >
                      {{ block.props.buttonText || 'Ver mais' }}
                    </button>
                  </div>
                </div>

                <!-- Setas Indicadoras de Slide -->
                <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <span class="w-8 h-8 rounded-full bg-white/70 shadow-xs flex items-center justify-center text-slate-700 text-xs">←</span>
                </div>
                <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <span class="w-8 h-8 rounded-full bg-white/70 shadow-xs flex items-center justify-center text-slate-700 text-xs">→</span>
                </div>
                <span class="absolute top-3 right-4 text-[11px] font-bold text-slate-400 bg-white/80 px-2 py-0.5 rounded-full">1 / 2</span>
              </div>

              <!-- 2. BANNER DE CUPOM / AVISO -->
              <div
                v-else-if="block.type === 'banner'"
                class="p-4 bg-emerald-50 border-y border-emerald-100 flex items-center justify-center space-x-2 text-xs font-bold text-emerald-950"
              >
                <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span class="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] uppercase font-black">
                  {{ block.props.badge || 'CUPOM' }}
                </span>
                <span>{{ block.props.text || 'Utilize o cupom BEMVINDO e garanta 10% de desconto!' }}</span>
              </div>

              <!-- 3. VITRINE DE PRODUTOS EM DESTAQUE -->
              <div v-else-if="block.type === 'products'" class="p-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-base font-black text-slate-900">{{ block.props.title || 'Produtos em destaque' }}</h3>
                  <span class="text-xs font-bold text-emerald-700">Ver todos &rarr;</span>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div v-for="item in 4" :key="item" class="p-3 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2">
                    <div class="h-28 bg-slate-100 rounded-xl flex items-center justify-center text-slate-300 font-bold text-xs">
                      Foto Produto {{ item }}
                    </div>
                    <p class="text-xs font-bold text-slate-800 line-clamp-1">Produto da Coleção {{ item }}</p>
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-black text-slate-900">R$ {{ (item * 69.9).toFixed(2).replace('.', ',') }}</span>
                      <span class="text-[10px] text-emerald-600 font-bold">PIX</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 4. VANTAGENS / FEATURES -->
              <div v-else-if="block.type === 'features'" class="p-6 bg-slate-50 border-y border-slate-100">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div class="p-3 bg-white rounded-xl border border-slate-200">
                    <p class="text-xs font-bold text-slate-900">{{ block.props.feature1 || 'Frete Rápido' }}</p>
                    <p class="text-[10px] text-slate-500">Envio para todo o Brasil</p>
                  </div>
                  <div class="p-3 bg-white rounded-xl border border-slate-200">
                    <p class="text-xs font-bold text-slate-900">{{ block.props.feature2 || 'PIX com Aprovação Rápida' }}</p>
                    <p class="text-[10px] text-slate-500">Confirmação automática</p>
                  </div>
                  <div class="p-3 bg-white rounded-xl border border-slate-200">
                    <p class="text-xs font-bold text-slate-900">{{ block.props.feature3 || 'Compra 100% Segura' }}</p>
                    <p class="text-[10px] text-slate-500">Garantia total</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Rodapé da Loja -->
          <footer
            class="p-6 bg-slate-900 text-white text-center space-y-2 cursor-pointer hover:bg-slate-800 transition"
            :class="activeSection === 'footer-info' ? 'ring-2 ring-emerald-500' : ''"
            @click="activeSection = 'footer-info'"
          >
            <p class="text-xs font-bold">{{ storeInfo.name || 'Minha Loja Online' }} - CNPJ e Todos os direitos reservados.</p>
            <p class="text-[10px] text-slate-400">Atendimento: contato@{{ storeInfo.subdomain || 'minhaloja' }}.com.br</p>
          </footer>
        </div>
      </main>

      <!-- PAINEL DIREITO: Inspector de Propriedades (Slide, Imagem, Disposição, Alinhamento, Cores, etc.) -->
      <aside class="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 z-10 overflow-y-auto p-4 space-y-5">
        <!-- Caso 1: Editando Barra de Navegação / Aviso -->
        <div v-if="activeSection === 'header-nav'" class="space-y-4">
          <div class="pb-3 border-b border-slate-100">
            <h3 class="text-sm font-extrabold text-slate-900">Barra de Navegação</h3>
            <p class="text-xs text-slate-500">Configurações do aviso fixo no topo</p>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Texto do Aviso de Topo</label>
            <input
              v-model="storeInfo.announcementBar"
              type="text"
              placeholder="Ex: Frete grátis em compras acima de R$ 199"
              class="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Cor de Fundo da Barra</label>
            <div class="flex items-center space-x-2">
              <input type="color" v-model="storeInfo.primaryColor" class="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer p-0.5" />
              <input type="text" v-model="storeInfo.primaryColor" class="flex-1 text-xs p-2 rounded-lg bg-slate-50 border border-slate-200 font-mono" />
            </div>
          </div>
        </div>

        <!-- Caso 2: Editando Logo & Marca -->
        <div v-else-if="activeSection === 'header-brand'" class="space-y-4">
          <div class="pb-3 border-b border-slate-100">
            <h3 class="text-sm font-extrabold text-slate-900">Logo & Nome da Loja</h3>
            <p class="text-xs text-slate-500">Identidade visual do cabeçalho</p>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Nome da Loja</label>
            <input
              v-model="storeInfo.name"
              type="text"
              class="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200"
            />
          </div>

          <!-- Logo & Marca da Loja -->
          <ImageUploader
            v-model="storeInfo.logoUrl"
            label="Logotipo da Loja"
            hint="Arquivo salvo no servidor"
            placeholder="Clique para enviar a logo da sua marca"
          />
        </div>

        <!-- Caso 3: Editando Rodapé -->
        <div v-else-if="activeSection === 'footer-info'" class="space-y-4">
          <div class="pb-3 border-b border-slate-100">
            <h3 class="text-sm font-extrabold text-slate-900">Rodapé da Página</h3>
            <p class="text-xs text-slate-500">Informações institucionais e contato</p>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Informações de Contato / E-mail</label>
            <input
              :value="`contato@${storeInfo.subdomain || 'minhaloja'}.com.br`"
              disabled
              class="w-full text-xs p-2.5 rounded-xl bg-slate-100 text-slate-500 border border-slate-200"
            />
          </div>
        </div>

        <!-- Caso 4: Editando Bloco Selecionado (Slide, Banner, etc. exatamente como na foto do usuário) -->
        <div v-else-if="selectedBlock" class="space-y-5">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 class="text-sm font-extrabold text-slate-900">{{ selectedBlock.title || 'Propriedades da Seção' }}</h3>
              <p class="text-xs text-slate-500">Tipo: {{ selectedBlock.type }}</p>
            </div>
            <button
              @click="removeBlock(selectedBlock.id)"
              type="button"
              class="text-xs text-rose-600 hover:text-rose-700 font-bold p-1 hover:bg-rose-50 rounded-lg cursor-pointer"
              title="Excluir este bloco"
            >
              Excluir
            </button>
          </div>

          <!-- 1. Imagem do Bloco (Upload de Arquivo) -->
          <div v-if="selectedBlock.type === 'hero' || selectedBlock.type === 'banner'" class="space-y-2">
            <ImageUploader
              v-model="selectedBlock.props.bgImage"
              label="Imagem do Bloco / Banner"
              hint="Arquivo no servidor"
              placeholder="Clique para enviar a foto do seu computador"
            />
          </div>

          <!-- 2. Textos do Bloco -->
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Título</label>
              <input
                v-model="selectedBlock.props.title"
                type="text"
                class="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>

            <div v-if="selectedBlock.type === 'hero'">
              <label class="block text-xs font-bold text-slate-700 mb-1">Subtítulo</label>
              <input
                v-model="selectedBlock.props.subtitle"
                type="text"
                class="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>

            <div v-if="selectedBlock.type === 'hero'">
              <label class="block text-xs font-bold text-slate-700 mb-1">Texto do Botão</label>
              <input
                v-model="selectedBlock.props.buttonText"
                type="text"
                class="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>

            <div v-if="selectedBlock.type === 'banner'">
              <label class="block text-xs font-bold text-slate-700 mb-1">Mensagem de Destaque</label>
              <input
                v-model="selectedBlock.props.text"
                type="text"
                class="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>
          </div>

          <!-- 3. Disposição / Alinhamento (Igual à foto: Esquerda, Centro, Direita, Vertical) -->
          <div class="space-y-2 pt-2 border-t border-slate-100">
            <label class="block text-xs font-bold text-slate-700">Disposição & Alinhamento</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                @click="selectedBlock.props.align = 'text-left'"
                :class="selectedBlock.props.align === 'text-left' ? 'bg-emerald-50 text-emerald-800 border-emerald-500 font-bold' : 'bg-slate-50 text-slate-600 border-slate-200'"
                class="py-2 px-3 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>⬅ À Esquerda</span>
              </button>
              <button
                type="button"
                @click="selectedBlock.props.align = 'text-center'"
                :class="selectedBlock.props.align === 'text-center' || !selectedBlock.props.align ? 'bg-emerald-50 text-emerald-800 border-emerald-500 font-bold' : 'bg-slate-50 text-slate-600 border-slate-200'"
                class="py-2 px-3 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>⬛ Centralizado</span>
              </button>
            </div>
          </div>

          <!-- 4. Cores e Fonte do Bloco -->
          <div class="space-y-3 pt-2 border-t border-slate-100">
            <label class="block text-xs font-bold text-slate-700">Tipografia & Cores</label>

            <!-- Seletor de Google Fonts -->
            <div>
              <label class="block text-[11px] font-medium text-slate-600 mb-1">Fonte do Título (Google Fonts)</label>
              <select
                v-model="selectedBlock.props.fontFamily"
                class="w-full text-xs p-2 rounded-xl bg-slate-50 border border-slate-200"
              >
                <option value="">Fonte Padrão da Loja</option>
                <option v-for="f in POPULAR_GOOGLE_FONTS" :key="f.id" :value="f.id">
                  {{ f.name }} ({{ f.category }})
                </option>
              </select>
            </div>

            <div>
              <label class="block text-[11px] font-medium text-slate-600 mb-1">Cor dos textos</label>
              <div class="flex items-center space-x-2">
                <input type="color" v-model="selectedBlock.props.textColor" class="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5" />
                <input type="text" v-model="selectedBlock.props.textColor" class="flex-1 text-xs p-2 rounded-lg bg-slate-50 border border-slate-200 font-mono" />
              </div>
            </div>

            <div v-if="selectedBlock.type === 'hero'">
              <label class="block text-[11px] font-medium text-slate-600 mb-1">Cor do Botão</label>
              <div class="flex items-center space-x-2">
                <input type="color" v-model="selectedBlock.props.btnColor" class="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5" />
                <input type="text" v-model="selectedBlock.props.btnColor" class="flex-1 text-xs p-2 rounded-lg bg-slate-50 border border-slate-200 font-mono" />
              </div>
            </div>
          </div>
        </div>

        <!-- Se nada selecionado -->
        <div v-else class="text-center py-12 text-slate-400 space-y-2">
          <p class="text-xs">Selecione uma seção à esquerda ou clique diretamente na vitrine para editar suas propriedades.</p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { POPULAR_GOOGLE_FONTS } from '~/lib/google-fonts'

const currentPage = ref('home')
const previewDevice = ref<'desktop' | 'mobile' | '3d'>('desktop')
const activeSection = ref<string>('header-brand')
const showAddSectionModal = ref(false)
const saving = ref(false)
const toastMsg = ref('')
const toastType = ref<'success' | 'error'>('success')

// Drag & drop state
const dragSourceIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

const onDragStart = (idx: number) => {
  dragSourceIndex.value = idx
}

const onDragOver = (idx: number) => {
  dragOverIndex.value = idx
}

const onDrop = (targetIdx: number) => {
  if (dragSourceIndex.value !== null && dragSourceIndex.value !== targetIdx) {
    const item = blocks.value.splice(dragSourceIndex.value, 1)[0]
    blocks.value.splice(targetIdx, 0, item)
  }
  dragSourceIndex.value = null
  dragOverIndex.value = null
}

const storeInfo = reactive({
  name: 'Minha Loja Oficial',
  subdomain: '',
  logoUrl: '',
  bannerUrl: '',
  announcementBar: '',
  primaryColor: '#059669',
  accentColor: '#10b981'
})

const bannerSuggestions = [
  { title: 'Moda & Estilo', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200' },
  { title: 'Tecnologia & Gadgets', url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200' },
  { title: 'Café & Alimentos', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200' },
  { title: 'Cosméticos & Beleza', url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200' },
]

// Blocos disponíveis para inserção
const availableWidgets = [
  {
    type: 'hero',
    title: 'Carrossel / Banner Principal',
    desc: 'Slide grande com imagem, título e botão de ação'
  },
  {
    type: 'banner',
    title: 'Barra de Cupom & Aviso',
    desc: 'Destaque de cupom de desconto ou frete grátis'
  },
  {
    type: 'products',
    title: 'Produtos em Destaque',
    desc: 'Grade de produtos com fotos, preços e compra PIX'
  },
  {
    type: 'features',
    title: 'Selos de Vantagens',
    desc: 'Frete rápido, PIX seguro e suporte garantido'
  }
]

// Estrutura de blocos da página
const blocks = ref<any[]>([
  {
    id: 'block-hero-1',
    type: 'hero',
    title: 'Slide Principal',
    props: {
      title: 'Título em Destaque',
      subtitle: 'Tendências e lançamentos com até 20% OFF no PIX',
      buttonText: 'Ver mais',
      padding: 'py-14',
      align: 'text-center',
      bgImage: '',
      textColor: '#111827',
      btnColor: '#000000',
      btnTextColor: '#ffffff'
    }
  },
  {
    id: 'block-banner-1',
    type: 'banner',
    title: 'Barra de Cupom',
    props: {
      badge: 'CUPOM 10% OFF',
      text: 'Utilize o cupom BEMVINDO no checkout!'
    }
  },
  {
    id: 'block-products-1',
    type: 'products',
    title: 'Produtos em destaque',
    props: {
      title: 'Produtos em destaque'
    }
  },
  {
    id: 'block-features-1',
    type: 'features',
    title: 'Selos de Vantagens',
    props: {
      feature1: 'Frete Rápido',
      feature2: 'PIX com Confirmação Instantânea',
      feature3: 'Compra 100% Segura'
    }
  }
])

const selectBlock = (id: string) => {
  activeSection.value = id
}

const selectedBlock = computed(() => {
  return blocks.value.find(b => b.id === activeSection.value)
})

const insertSection = (type: string) => {
  const newId = `block-${type}-${Date.now()}`
  let defaultProps: any = {
    title: 'Nova Seção',
    align: 'text-center'
  }

  if (type === 'hero') {
    defaultProps = {
      title: 'Novo Slide',
      subtitle: 'Subtítulo da novidade',
      buttonText: 'Ver mais',
      padding: 'py-14',
      align: 'text-center',
      bgImage: '',
      textColor: '#111827',
      btnColor: '#000000',
      btnTextColor: '#ffffff'
    }
  } else if (type === 'banner') {
    defaultProps = {
      badge: 'PROMOÇÃO',
      text: 'Frete grátis para todo o Brasil'
    }
  } else if (type === 'products') {
    defaultProps = {
      title: 'Lançamentos'
    }
  } else if (type === 'features') {
    defaultProps = {
      feature1: 'Envio Imediato',
      feature2: 'PIX com Desconto',
      feature3: 'Atendimento Rápido'
    }
  }

  blocks.value.push({
    id: newId,
    type,
    title: availableWidgets.find(w => w.type === type)?.title || type,
    props: defaultProps
  })

  activeSection.value = newId
  showAddSectionModal.value = false
  showToast('Seção adicionada com sucesso!')
}

const moveBlock = (index: number, direction: number) => {
  const targetIndex = index + direction
  if (targetIndex >= 0 && targetIndex < blocks.value.length) {
    const item = blocks.value.splice(index, 1)[0]
    blocks.value.splice(targetIndex, 0, item)
  }
}

const removeBlock = (id: string) => {
  blocks.value = blocks.value.filter(b => b.id !== id)
  activeSection.value = 'header-brand'
  showToast('Seção removida.')
}

const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
  toastMsg.value = msg
  toastType.value = type
  setTimeout(() => {
    toastMsg.value = ''
  }, 4000)
}

const { fetchWithAuth, initAuth, isAuthenticated, tenant: authTenant } = useAuth()
const router = useRouter()

const storeLink = computed(() => {
  const sub = storeInfo.subdomain || authTenant.value?.subdomain || ''
  return sub ? `/?tenant=${encodeURIComponent(sub)}` : '/'
})

onMounted(async () => {
  initAuth()
  if (!isAuthenticated.value) {
    router.push('/admin/login')
    return
  }

  try {
    const res: any = await fetchWithAuth('/api/admin/store')
    const tenant = res?.tenant || res?.store
    if (tenant) {
      storeInfo.name = tenant.name || storeInfo.name
      storeInfo.subdomain = tenant.subdomain || ''
      storeInfo.logoUrl = tenant.logoUrl || ''
      storeInfo.bannerUrl = tenant.bannerUrl || ''
      storeInfo.announcementBar = tenant.announcementBar || ''
      storeInfo.primaryColor = tenant.primaryColor || '#059669'
      storeInfo.accentColor = tenant.accentColor || '#10b981'

      if (tenant.themeConfig) {
        try {
          const cfg = typeof tenant.themeConfig === 'string' ? JSON.parse(tenant.themeConfig) : tenant.themeConfig
          if (cfg?.builderBlocks && Array.isArray(cfg.builderBlocks) && cfg.builderBlocks.length > 0) {
            blocks.value = cfg.builderBlocks
          }
        } catch (e) {
          console.warn('Erro ao carregar blocos customizados do tema:', e)
        }
      }
    }
  } catch (err) {
    console.error('Erro ao buscar dados da loja:', err)
  }
})

const saveLayout = async () => {
  saving.value = true
  try {
    let currentThemeConfig: any = {}
    try {
      const getRes: any = await fetchWithAuth('/api/admin/store')
      const t = getRes?.tenant || getRes?.store
      if (t?.themeConfig) {
        currentThemeConfig = typeof t.themeConfig === 'string' ? JSON.parse(t.themeConfig) : t.themeConfig
      }
    } catch (e) {
      // Ignora erro no get
    }

    const updatedThemeConfig = {
      ...currentThemeConfig,
      builderBlocks: blocks.value
    }

    await fetchWithAuth('/api/admin/store', {
      method: 'PUT',
      body: {
        name: storeInfo.name,
        logoUrl: storeInfo.logoUrl,
        bannerUrl: storeInfo.bannerUrl,
        announcementBar: storeInfo.announcementBar,
        primaryColor: storeInfo.primaryColor,
        accentColor: storeInfo.accentColor,
        themeConfig: updatedThemeConfig
      }
    })
    showToast('Design salvo e publicado com sucesso!')
  } catch (err: any) {
    showToast(err.data?.statusMessage || 'Erro ao publicar alterações da loja.', 'error')
  } finally {
    saving.value = false
  }
}
</script>
