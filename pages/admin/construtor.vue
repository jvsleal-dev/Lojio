<template>
  <div class="min-h-screen bg-slate-50 flex text-slate-900 font-sans selection:bg-emerald-600 selection:text-white">
    <AdminSidebar />

    <main class="flex-1 flex flex-col h-screen overflow-hidden">
      <!-- Top Builder Toolbar -->
      <header class="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-20">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-md shadow-emerald-600/30">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <h1 class="text-base font-extrabold text-slate-900">Construtor Visual de Loja</h1>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Elementor & Three.js
              </span>
            </div>
            <p class="text-xs text-slate-500">Arraste, estilize blocos, escolha logos/banners e visualize em 3D</p>
          </div>
        </div>

        <!-- Viewport Switcher & Actions -->
        <div class="flex items-center space-x-3">
          <!-- Viewport Mode -->
          <div class="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              @click="previewDevice = 'desktop'"
              type="button"
              :class="previewDevice === 'desktop' ? 'bg-white shadow-xs text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'"
              class="px-2.5 py-1 rounded-lg text-xs transition flex items-center space-x-1"
              title="Desktop"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              <span class="hidden md:inline">Desktop</span>
            </button>
            <button
              @click="previewDevice = 'mobile'"
              type="button"
              :class="previewDevice === 'mobile' ? 'bg-white shadow-xs text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'"
              class="px-2.5 py-1 rounded-lg text-xs transition flex items-center space-x-1"
              title="Mobile"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              <span class="hidden md:inline">Celular</span>
            </button>
            <button
              @click="previewDevice = '3d'"
              type="button"
              :class="previewDevice === '3d' ? 'bg-white shadow-xs text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'"
              class="px-2.5 py-1 rounded-lg text-xs transition flex items-center space-x-1"
              title="Three.js 3D Showcase"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
              <span>3D Three.js</span>
            </button>
          </div>

          <a
            :href="`/?tenant=${storeInfo.subdomain || ''}`"
            target="_blank"
            class="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 transition"
          >
            Ver Vitrine
          </a>

          <button
            @click="saveLayout"
            :disabled="saving"
            class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/20 transition flex items-center space-x-1.5 disabled:opacity-50"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            <span>{{ saving ? 'Salvando...' : 'Publicar Loja' }}</span>
          </button>
        </div>
      </header>

      <!-- Feedback Toast Notification -->
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

      <!-- Main Studio Body -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Left Sidebar: Elementor Style Widgets / Blocks Palette -->
        <aside class="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10 overflow-y-auto">
          <!-- Tabs: Elementos, Banners/Logo e Cores -->
          <div class="flex border-b border-slate-200 p-2 gap-1 bg-slate-50/70">
            <button
              @click="activeTab = 'widgets'"
              type="button"
              :class="activeTab === 'widgets' ? 'bg-white shadow-xs text-emerald-800 font-black' : 'text-slate-600 hover:text-slate-900'"
              class="flex-1 py-2 text-xs rounded-lg transition text-center"
            >
              Blocos
            </button>
            <button
              @click="activeTab = 'assets'"
              type="button"
              :class="activeTab === 'assets' ? 'bg-white shadow-xs text-emerald-800 font-black' : 'text-slate-600 hover:text-slate-900'"
              class="flex-1 py-2 text-xs rounded-lg transition text-center"
            >
              Logo & Banners
            </button>
            <button
              @click="activeTab = 'design'"
              type="button"
              :class="activeTab === 'design' ? 'bg-white shadow-xs text-emerald-800 font-black' : 'text-slate-600 hover:text-slate-900'"
              class="flex-1 py-2 text-xs rounded-lg transition text-center"
            >
              Cores & 3D
            </button>
          </div>

          <!-- Tab 1: Elementor Blocks Palette & Drag / Reorder -->
          <div v-if="activeTab === 'widgets'" class="p-4 space-y-5">
            <div>
              <p class="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Clique para adicionar bloco</p>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="widget in availableWidgets"
                  :key="widget.type"
                  @click="addWidget(widget.type)"
                  type="button"
                  class="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/60 hover:border-emerald-500/50 flex flex-col items-center justify-center text-center transition group text-slate-700"
                >
                  <component :is="widget.icon" class="w-6 h-6 text-slate-500 group-hover:text-emerald-600 mb-1.5 transition-colors" />
                  <span class="text-xs font-bold">{{ widget.title }}</span>
                  <span class="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{{ widget.desc }}</span>
                </button>
              </div>
            </div>

            <!-- Active Page Sections with Drag-and-Drop / Move -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <p class="text-xs font-black uppercase tracking-wider text-slate-400">Estrutura da Loja ({{ blocks.length }})</p>
                <button @click="resetBlocks" class="text-[10px] text-slate-400 hover:text-rose-600 font-semibold">Restaurar padrão</button>
              </div>
              <p class="text-[10px] text-slate-400 mb-2">Arraste os blocos para reordenar a vitrine ao vivo.</p>

              <div class="space-y-2">
                <div
                  v-for="(block, index) in blocks"
                  :key="block.id"
                  draggable="true"
                  @dragstart="onDragStart(index)"
                  @dragover.prevent="onDragOver(index)"
                  @drop="onDrop(index)"
                  @click="selectedBlockId = block.id"
                  class="p-3 rounded-xl border transition cursor-grab active:cursor-grabbing flex items-center justify-between"
                  :class="[
                    selectedBlockId === block.id ? 'border-emerald-600 bg-emerald-50/70 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300',
                    dragOverIndex === index ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''
                  ]"
                >
                  <div class="flex items-center space-x-2.5 min-w-0">
                    <span class="text-slate-400 cursor-grab text-xs">⋮⋮</span>
                    <span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {{ index + 1 }}
                    </span>
                    <div class="truncate">
                      <p class="text-xs font-bold text-slate-800 truncate">{{ block.title || block.type }}</p>
                      <p class="text-[10px] text-slate-400 capitalize">{{ block.type }}</p>
                    </div>
                  </div>

                  <div class="flex items-center space-x-1 shrink-0">
                    <button
                      @click.stop="moveBlock(index, -1)"
                      :disabled="index === 0"
                      class="p-1 hover:bg-slate-200/70 rounded disabled:opacity-20 text-slate-600 text-xs"
                      title="Mover acima"
                    >
                      ▲
                    </button>
                    <button
                      @click.stop="moveBlock(index, 1)"
                      :disabled="index === blocks.length - 1"
                      class="p-1 hover:bg-slate-200/70 rounded disabled:opacity-20 text-slate-600 text-xs"
                      title="Mover abaixo"
                    >
                      ▼
                    </button>
                    <button
                      @click.stop="removeBlock(block.id)"
                      class="p-1 hover:bg-rose-100 hover:text-rose-600 rounded text-slate-400 text-xs"
                      title="Excluir bloco"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Block Settings Drawer / Inspector -->
            <div v-if="selectedBlock" class="p-4 rounded-2xl bg-slate-100 border border-slate-200/90 space-y-3">
              <div class="flex items-center justify-between">
                <p class="text-xs font-black text-slate-800 uppercase tracking-wider">Estilizar: {{ selectedBlock.title }}</p>
                <span class="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {{ selectedBlock.type }}
                </span>
              </div>

              <!-- Estilos Globais do Bloco (Espaçamento e Fundo) -->
              <div class="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                <div>
                  <label class="block text-[10px] font-bold text-slate-600 mb-0.5">Espaçamento Vertical</label>
                  <select v-model="selectedBlock.props.padding" class="w-full text-xs p-1.5 rounded-lg bg-white border border-slate-300">
                    <option value="py-8">Compacto</option>
                    <option value="py-14">Médio (Padrão)</option>
                    <option value="py-20">Espaçoso</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-slate-600 mb-0.5">Alinhamento</label>
                  <select v-model="selectedBlock.props.align" class="w-full text-xs p-1.5 rounded-lg bg-white border border-slate-300">
                    <option value="text-center">Centralizado</option>
                    <option value="text-left">À Esquerda</option>
                  </select>
                </div>
              </div>

              <!-- Configurações específicas por Bloco -->
              <div v-if="selectedBlock.type === 'hero'" class="space-y-2">
                <div>
                  <label class="block text-[11px] font-bold text-slate-600 mb-1">Título Principal</label>
                  <input v-model="selectedBlock.props.title" class="w-full text-xs p-2 rounded-lg bg-white border border-slate-300" />
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-600 mb-1">Subtítulo</label>
                  <input v-model="selectedBlock.props.subtitle" class="w-full text-xs p-2 rounded-lg bg-white border border-slate-300" />
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-600 mb-1">Texto do Botão CTA</label>
                  <input v-model="selectedBlock.props.buttonText" class="w-full text-xs p-2 rounded-lg bg-white border border-slate-300" />
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-600 mb-1">Imagem de Fundo do Banner (URL)</label>
                  <input v-model="selectedBlock.props.bgImage" placeholder="https://..." class="w-full text-xs p-2 rounded-lg bg-white border border-slate-300" />
                </div>
              </div>

              <div v-else-if="selectedBlock.type === 'banner'" class="space-y-2">
                <div>
                  <label class="block text-[11px] font-bold text-slate-600 mb-1">Mensagem de Destaque</label>
                  <input v-model="selectedBlock.props.text" class="w-full text-xs p-2 rounded-lg bg-white border border-slate-300" />
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-600 mb-1">Cupom / Desconto</label>
                  <input v-model="selectedBlock.props.badge" class="w-full text-xs p-2 rounded-lg bg-white border border-slate-300" />
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-600 mb-1">Ícone de Destaque</label>
                  <select v-model="selectedBlock.props.iconType" class="w-full text-xs p-2 rounded-lg bg-white border border-slate-300">
                    <option value="sparkles">✨ Sparkles / Brilho</option>
                    <option value="tag">🏷️ Tag de Oferta</option>
                    <option value="truck">🚚 Frete Grátis</option>
                    <option value="shield">🛡️ Garantia</option>
                  </select>
                </div>
              </div>

              <div v-else-if="selectedBlock.type === 'products'" class="space-y-2">
                <div>
                  <label class="block text-[11px] font-bold text-slate-600 mb-1">Título da Seção</label>
                  <input v-model="selectedBlock.props.title" class="w-full text-xs p-2 rounded-lg bg-white border border-slate-300" />
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-600 mb-1">Colunas no Desktop</label>
                  <select v-model="selectedBlock.props.columns" class="w-full text-xs p-2 rounded-lg bg-white border border-slate-300">
                    <option :value="2">2 Colunas</option>
                    <option :value="3">3 Colunas</option>
                    <option :value="4">4 Colunas</option>
                  </select>
                </div>
              </div>

              <div v-else-if="selectedBlock.type === 'testimonials'" class="space-y-2">
                <div>
                  <label class="block text-[11px] font-bold text-slate-600 mb-1">Depoimento</label>
                  <textarea v-model="selectedBlock.props.quote" rows="2" class="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"></textarea>
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-600 mb-1">Autor</label>
                  <input v-model="selectedBlock.props.author" class="w-full text-xs p-2 rounded-lg bg-white border border-slate-300" />
                </div>
              </div>

              <div v-else-if="selectedBlock.type === 'features'" class="space-y-2">
                <div>
                  <label class="block text-[11px] font-bold text-slate-600 mb-1">Item 1 (Frete)</label>
                  <input v-model="selectedBlock.props.feature1" class="w-full text-xs p-2 rounded-lg bg-white border border-slate-300" />
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-600 mb-1">Item 2 (PIX)</label>
                  <input v-model="selectedBlock.props.feature2" class="w-full text-xs p-2 rounded-lg bg-white border border-slate-300" />
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-600 mb-1">Item 3 (Segurança)</label>
                  <input v-model="selectedBlock.props.feature3" class="w-full text-xs p-2 rounded-lg bg-white border border-slate-300" />
                </div>
              </div>
            </div>
          </div>

          <!-- Tab 2: Logo & Banners Management -->
          <div v-if="activeTab === 'assets'" class="p-4 space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Nome da Loja</label>
              <input v-model="storeInfo.name" type="text" class="w-full text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-300" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Logo da Marca (URL)</label>
              <input v-model="storeInfo.logoUrl" placeholder="https://exemplo.com/logo.png" class="w-full text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-300" />
              <div v-if="storeInfo.logoUrl" class="mt-2 p-2 bg-slate-100 rounded-lg flex items-center justify-center h-16 border border-slate-200">
                <img :src="storeInfo.logoUrl" alt="Logo Preview" class="max-h-full max-w-full object-contain" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Banner Principal da Loja (URL)</label>
              <input v-model="storeInfo.bannerUrl" placeholder="https://exemplo.com/banner.jpg" class="w-full text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-300" />
              <div class="mt-2 space-y-1">
                <p class="text-[10px] font-bold text-slate-400">Sugestões de banners rápidos:</p>
                <div class="grid grid-cols-2 gap-1.5">
                  <button
                    v-for="(sug, idx) in bannerSuggestions"
                    :key="idx"
                    type="button"
                    @click="storeInfo.bannerUrl = sug.url"
                    class="text-[10px] text-left p-1.5 rounded bg-slate-100 hover:bg-emerald-50 border border-slate-200 truncate"
                  >
                    {{ sug.title }}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Barra de Avisos (Topo)</label>
              <input v-model="storeInfo.announcementBar" placeholder="Frete grátis para todo o Brasil..." class="w-full text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-300" />
            </div>
          </div>

          <!-- Tab 3: Theme & Colors (Paleta verde esmeralda e Three.js) -->
          <div v-if="activeTab === 'design'" class="p-4 space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Cor Primária (Identidade Verde)</label>
              <div class="flex items-center space-x-2">
                <input type="color" v-model="storeInfo.primaryColor" class="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5" />
                <input type="text" v-model="storeInfo.primaryColor" class="flex-1 text-xs p-2 rounded-lg bg-slate-50 border border-slate-300 font-mono" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Cor de Destaque / Botões</label>
              <div class="flex items-center space-x-2">
                <input type="color" v-model="storeInfo.accentColor" class="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5" />
                <input type="text" v-model="storeInfo.accentColor" class="flex-1 text-xs p-2 rounded-lg bg-slate-50 border border-slate-300 font-mono" />
              </div>
            </div>

            <div class="pt-4 border-t border-slate-200">
              <p class="text-xs font-bold text-slate-700 mb-2">Simulação 3D no Three.js</p>
              <p class="text-[11px] text-slate-500 leading-relaxed mb-3">
                As cores escolhidas aqui sincronizam instantaneamente com o modelo 3D ao vivo da vitrine.
              </p>
              <div class="h-44 rounded-xl overflow-hidden border border-slate-200">
                <Store3DPreview
                  :themeColor="storeInfo.primaryColor"
                  :accentColor="storeInfo.accentColor"
                  :storeName="storeInfo.name"
                />
              </div>
            </div>
          </div>
        </aside>

        <!-- Center Canvas: Live Store Preview in Elementor Style -->
        <section class="flex-1 bg-slate-200/80 p-4 md:p-8 overflow-y-auto flex justify-center items-start">
          <!-- 3D Showcase Mode -->
          <div v-if="previewDevice === '3d'" class="w-full max-w-4xl h-[620px] bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 flex flex-col">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 class="text-base font-black text-slate-900">Showcase 3D Interativo (Three.js)</h3>
                <p class="text-xs text-slate-500">Visualização tridimensional física da vitrine da sua marca</p>
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Rotacionando em tempo real</span>
            </div>
            <div class="flex-1 rounded-2xl overflow-hidden">
              <Store3DPreview
                :themeColor="storeInfo.primaryColor"
                :accentColor="storeInfo.accentColor"
                :storeName="storeInfo.name"
              />
            </div>
          </div>

          <!-- Desktop / Mobile Live Simulation Canvas -->
          <div
            v-else
            :class="previewDevice === 'mobile' ? 'w-[390px] min-h-[740px] rounded-[40px] border-8 border-slate-900 shadow-2xl overflow-hidden' : 'w-full max-w-5xl rounded-2xl shadow-xl border border-slate-300'"
            class="bg-white transition-all duration-300"
          >
            <!-- Announcement Bar -->
            <div
              v-if="storeInfo.announcementBar"
              class="py-1.5 px-4 text-center text-xs font-bold text-white transition-colors"
              :style="{ backgroundColor: storeInfo.primaryColor || '#059669' }"
            >
              {{ storeInfo.announcementBar }}
            </div>

            <!-- Simulated Store Header -->
            <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div class="flex items-center space-x-2.5">
                <div v-if="storeInfo.logoUrl" class="w-8 h-8 rounded-lg overflow-hidden border border-slate-200">
                  <img :src="storeInfo.logoUrl" alt="Logo" class="w-full h-full object-cover" />
                </div>
                <div
                  v-else
                  class="w-8 h-8 rounded-lg text-white font-extrabold flex items-center justify-center text-xs shadow-xs"
                  :style="{ backgroundColor: storeInfo.primaryColor || '#059669' }"
                >
                  {{ storeInfo.name?.charAt(0) || 'L' }}
                </div>
                <span class="font-black text-sm text-slate-900">{{ storeInfo.name || 'Minha Loja Online' }}</span>
              </div>
              <div class="flex items-center space-x-2 text-xs font-bold text-slate-500">
                <span>Início</span>
                <span>Produtos</span>
                <div
                  class="px-2.5 py-1 rounded-lg text-white text-[11px] font-bold"
                  :style="{ backgroundColor: storeInfo.accentColor || '#10b981' }"
                >
                  Sacola (0)
                </div>
              </div>
            </div>

            <!-- Dynamic Blocks Rendered in Order -->
            <div class="divide-y divide-slate-100">
              <div
                v-for="block in blocks"
                :key="block.id"
                @click="selectedBlockId = block.id"
                class="relative transition hover:ring-2 hover:ring-emerald-500/50 cursor-pointer group"
                :class="selectedBlockId === block.id ? 'ring-2 ring-emerald-600' : ''"
              >
                <!-- Quick Floating Edit Badge -->
                <div class="absolute top-2 right-2 hidden group-hover:flex items-center space-x-1 z-10 bg-slate-900 text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-md">
                  <span>{{ block.title }}</span>
                </div>

                <!-- 1. HERO WIDGET -->
                <div
                  v-if="block.type === 'hero'"
                  :class="[block.props.padding || 'py-14', block.props.align || 'text-center']"
                  class="px-6 text-white relative overflow-hidden"
                  :style="{ backgroundColor: storeInfo.primaryColor || '#059669' }"
                >
                  <img
                    v-if="block.props.bgImage || storeInfo.bannerUrl"
                    :src="block.props.bgImage || storeInfo.bannerUrl"
                    alt="Banner Background"
                    class="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay pointer-events-none"
                  />
                  <div class="max-w-xl mx-auto space-y-3 relative z-10">
                    <span class="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-xs">
                      Coleção Especial 2026
                    </span>
                    <h2 class="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                      {{ block.props.title || 'Novidades da Temporada' }}
                    </h2>
                    <p class="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                      {{ block.props.subtitle || 'Explore as melhores peças com entrega rápida para todo o Brasil e PIX instantâneo.' }}
                    </p>
                    <div class="pt-2">
                      <button
                        type="button"
                        class="px-6 py-2.5 rounded-full text-xs font-black shadow-lg hover:scale-105 transition"
                        :style="{ backgroundColor: storeInfo.accentColor || '#10b981', color: '#ffffff' }"
                      >
                        {{ block.props.buttonText || 'Comprar Agora' }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- 2. BANNER DESTAQUE WIDGET -->
                <div
                  v-else-if="block.type === 'banner'"
                  class="p-4 bg-emerald-50 border-y border-emerald-100 flex items-center justify-center space-x-2 text-xs font-bold text-emerald-900"
                >
                  <span class="text-base" v-if="block.props.iconType === 'sparkles'">✨</span>
                  <span class="text-base" v-else-if="block.props.iconType === 'truck'">🚚</span>
                  <span class="text-base" v-else-if="block.props.iconType === 'shield'">🛡️</span>
                  <span class="text-base" v-else>🏷️</span>
                  <span class="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] uppercase font-black">
                    {{ block.props.badge || 'OFERTA' }}
                  </span>
                  <span>{{ block.props.text || 'Use o cupom PRIMEIRACOMPRA e ganhe 10% OFF em toda a loja!' }}</span>
                </div>

                <!-- 3. VITRINE DE PRODUTOS WIDGET -->
                <div v-else-if="block.type === 'products'" class="p-6">
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="text-base font-black text-slate-900">{{ block.props.title || 'Destaques em Alta' }}</h3>
                    <span class="text-xs font-bold text-emerald-700">Ver todos &rarr;</span>
                  </div>

                  <div
                    class="grid gap-4"
                    :class="`grid-cols-2 ${block.props.columns === 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-3'}`"
                  >
                    <div v-for="item in 4" :key="item" class="p-3 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2">
                      <div class="h-28 bg-slate-100 rounded-xl flex items-center justify-center text-slate-300 font-bold text-xs">
                        Foto Produto
                      </div>
                      <p class="text-xs font-bold text-slate-800 line-clamp-1">Produto Exemplo {{ item }}</p>
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-black text-slate-900">R$ {{ (item * 49.9).toFixed(2).replace('.', ',') }}</span>
                        <span class="text-[10px] text-emerald-600 font-bold">PIX</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 4. VANTAGENS / FEATURES WIDGET -->
                <div v-else-if="block.type === 'features'" class="p-6 bg-slate-50 border-y border-slate-200/80">
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div class="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                      <p class="text-xs font-bold text-slate-900">{{ block.props.feature1 || 'Frete Rápido' }}</p>
                      <p class="text-[10px] text-slate-500">Envio para todo o Brasil</p>
                    </div>
                    <div class="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                      <p class="text-xs font-bold text-slate-900">{{ block.props.feature2 || 'PIX com Aprovação Rápida' }}</p>
                      <p class="text-[10px] text-slate-500">Confirmação automática</p>
                    </div>
                    <div class="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                      <p class="text-xs font-bold text-slate-900">{{ block.props.feature3 || 'Compra 100% Segura' }}</p>
                      <p class="text-[10px] text-slate-500">Garantia total</p>
                    </div>
                  </div>
                </div>

                <!-- 5. DEPOIMENTOS WIDGET -->
                <div v-else-if="block.type === 'testimonials'" class="p-6 bg-emerald-950 text-white">
                  <div class="max-w-md mx-auto text-center space-y-2">
                    <span class="text-2xl text-emerald-400 font-serif font-black">“</span>
                    <p class="text-xs sm:text-sm text-emerald-100 italic">
                      {{ block.props.quote || 'Atendimento excelente e produtos de altíssima qualidade! Chegou antes do prazo previsto.' }}
                    </p>
                    <p class="text-xs font-black text-white pt-2">&mdash; {{ block.props.author || 'Camila Rocha (Cliente Verificada)' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Simulated Footer -->
            <footer class="p-6 bg-slate-900 text-slate-400 text-center text-xs border-t border-slate-800">
              <p>&copy; 2026 {{ storeInfo.name || 'Minha Loja' }} &bull; Todos os direitos reservados</p>
              <p class="text-[10px] text-slate-500 mt-1">Plataforma desenvolvida por Lojio</p>
            </footer>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import {
  Layout,
  ShoppingBag,
  Sparkles,
  MessageSquare,
  ShieldCheck
} from 'lucide-vue-next'

const previewDevice = ref<'desktop' | 'mobile' | '3d'>('desktop')
const activeTab = ref<'widgets' | 'assets' | 'design'>('widgets')
const selectedBlockId = ref<string>('hero-1')
const saving = ref(false)

const dragSourceIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

const onDragStart = (idx: number) => {
  dragSourceIndex.value = idx
}

const onDragOver = (idx: number) => {
  dragOverIndex.value = idx
}

const onDrop = (targetIdx: number) => {
  if (dragSourceIndex.value === null) return
  const src = dragSourceIndex.value
  if (src !== targetIdx) {
    const item = blocks.value.splice(src, 1)[0]
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

// Elementor Widgets Catalog
const availableWidgets = [
  {
    type: 'hero',
    title: 'Hero Banner',
    desc: 'Destaque de topo com chamada',
    icon: Layout
  },
  {
    type: 'banner',
    title: 'Aviso / Cupom',
    desc: 'Faixa com cupom ou desconto',
    icon: Sparkles
  },
  {
    type: 'products',
    title: 'Vitrine Produtos',
    desc: 'Grade de produtos em destaque',
    icon: ShoppingBag
  },
  {
    type: 'features',
    title: 'Vantagens',
    desc: 'Frete, PIX e segurança',
    icon: ShieldCheck
  },
  {
    type: 'testimonials',
    title: 'Depoimentos',
    desc: 'Avaliações de clientes',
    icon: MessageSquare
  }
]

// Default active store blocks
const blocks = ref<any[]>([
  {
    id: 'hero-1',
    type: 'hero',
    title: 'Hero Banner Principal',
    props: {
      title: 'Coleção Exclusiva 2026',
      subtitle: 'Tendências e lançamentos com até 20% OFF no PIX',
      buttonText: 'Explorar Produtos',
      padding: 'py-14',
      align: 'text-center',
      bgImage: ''
    }
  },
  {
    id: 'banner-1',
    type: 'banner',
    title: 'Barra de Cupom',
    props: {
      badge: 'CUPOM 10% OFF',
      text: 'Utilize o cupom BEMVINDO no checkout!',
      iconType: 'sparkles'
    }
  },
  {
    id: 'features-1',
    type: 'features',
    title: 'Destaques e Vantagens',
    props: {
      feature1: 'Frete Rápido Correios',
      feature2: 'PIX com Aprovação Instantânea',
      feature3: 'Compra 100% Protegida'
    }
  },
  {
    id: 'products-1',
    type: 'products',
    title: 'Grade de Produtos',
    props: {
      title: 'Mais Vendidos',
      columns: 4
    }
  },
  {
    id: 'testimonials-1',
    type: 'testimonials',
    title: 'Avaliação de Clientes',
    props: {
      quote: 'Comprei e recebi perfeitamente em 2 dias. Recomendo muito!',
      author: 'Juliana Mendes'
    }
  }
])

const selectedBlock = computed(() => {
  return blocks.value.find(b => b.id === selectedBlockId.value)
})

const addWidget = (type: string) => {
  const newId = `${type}-${Date.now()}`
  let defaultProps = {}

  if (type === 'hero') {
    defaultProps = { title: 'Novo Destaque', subtitle: 'Subtítulo do bloco', buttonText: 'Conferir', padding: 'py-14', align: 'text-center', bgImage: '' }
  } else if (type === 'banner') {
    defaultProps = { badge: 'NOVIDADE', text: 'Frete grátis para todo o Brasil', iconType: 'truck' }
  } else if (type === 'products') {
    defaultProps = { title: 'Lançamentos', columns: 3 }
  } else if (type === 'features') {
    defaultProps = { feature1: 'Envio Ágil', feature2: 'PIX Direto', feature3: 'Satisfação Garantida' }
  } else if (type === 'testimonials') {
    defaultProps = { quote: 'Excelente experiência de compra!', author: 'Cliente' }
  }

  const widgetDef = availableWidgets.find(w => w.type === type)
  blocks.value.push({
    id: newId,
    type,
    title: widgetDef?.title || type,
    props: defaultProps
  })
  selectedBlockId.value = newId
}

const moveBlock = (index: number, delta: number) => {
  const target = index + delta
  if (target < 0 || target >= blocks.value.length) return
  const item = blocks.value.splice(index, 1)[0]
  blocks.value.splice(target, 0, item)
}

const removeBlock = (id: string) => {
  blocks.value = blocks.value.filter(b => b.id !== id)
  if (selectedBlockId.value === id && blocks.value.length > 0) {
    selectedBlockId.value = blocks.value[0].id
  }
}

const resetBlocks = () => {
  blocks.value = [
    {
      id: 'hero-1',
      type: 'hero',
      title: 'Hero Banner Principal',
      props: {
        title: 'Coleção Exclusiva 2026',
        subtitle: 'Tendências e lançamentos com até 20% OFF no PIX',
        buttonText: 'Explorar Produtos',
        padding: 'py-14',
        align: 'text-center'
      }
    },
    {
      id: 'products-1',
      type: 'products',
      title: 'Grade de Produtos',
      props: {
        title: 'Mais Vendidos',
        columns: 4
      }
    }
  ]
}

const { fetchWithAuth, initAuth, isAuthenticated } = useAuth()
const router = useRouter()

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

      // Se já houver blocos salvos no themeConfig, restaura no construtor
      if (tenant.themeConfig?.builderBlocks && Array.isArray(tenant.themeConfig.builderBlocks)) {
        blocks.value = tenant.themeConfig.builderBlocks
        if (blocks.value.length > 0) {
          selectedBlockId.value = blocks.value[0].id
        }
      }
    }
  } catch (e) {
    // defaults
  }
})

const toastMsg = ref('')
const toastType = ref<'success' | 'error'>('success')

const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
  toastMsg.value = msg
  toastType.value = type
  setTimeout(() => {
    toastMsg.value = ''
  }, 4000)
}

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
    } catch {}

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
    showToast('Loja, blocos, banners e estilo publicados com sucesso!')
  } catch (err: any) {
    showToast(err.data?.statusMessage || 'Erro ao publicar alterações da loja.', 'error')
  } finally {
    saving.value = false
  }
}
</script>
