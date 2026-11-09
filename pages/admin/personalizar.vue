<template>
  <div class="min-h-screen bg-slate-50 flex text-slate-900 font-sans selection:bg-emerald-600 selection:text-white">
    <AdminSidebar />

    <main class="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div class="flex items-center space-x-2.5">
            <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4 5 5 0 015-5h1a1 1 0 001-1V9a4 4 0 018 0v2a1 1 0 001 1h1a5 5 0 015 5 4 4 0 01-4 4H7z" />
              </svg>
            </div>
            <h1 class="text-2xl font-black text-slate-900">Editor de Tema & Personalização</h1>
          </div>
          <p class="text-slate-500 text-sm mt-0.5">
            Personalize logo, banners, fontes, cores da marca, cards de produtos e selos do checkout.
          </p>
        </div>

        <div class="flex items-center space-x-3">
          <a
            :href="`/?tenant=${form.subdomain || ''}`"
            target="_blank"
            class="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center space-x-1.5 transition border border-slate-200 shadow-xs"
          >
            <span>Ver Vitrine Ao Vivo</span>
            <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </a>

          <button
            @click="saveSettings"
            :disabled="saving"
            class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/20 transition hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center space-x-1.5"
          >
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span>{{ saving ? 'Salvando...' : 'Salvar Alterações' }}</span>
          </button>
        </div>
      </div>

      <!-- Theme library -->
      <section class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div>
            <h2 class="text-sm font-extrabold text-slate-900">Escolha um tema base</h2>
            <p class="text-xs text-slate-500 mt-1">Comece com uma estrutura pronta e personalize cores, textos e imagens depois.</p>
          </div>
          <span class="text-[11px] font-semibold text-emerald-700">{{ getStoreTheme(form.themeConfig.themeId).name }}</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            v-for="theme in STORE_THEMES"
            :key="theme.id"
            type="button"
            @click="applyTheme(theme)"
            class="text-left p-3 rounded-2xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            :class="form.themeConfig.themeId === theme.id ? 'border-emerald-600 bg-emerald-50/60' : 'border-slate-200 bg-slate-50 hover:border-slate-300'"
          >
            <div class="h-20 rounded-xl overflow-hidden border border-black/5 flex" :style="{ backgroundColor: theme.bgColor }">
              <div class="w-1/3 p-2" :style="{ backgroundColor: theme.primaryColor }">
                <div class="h-1.5 w-10 rounded-full bg-white/80"></div>
                <div class="mt-3 h-1 w-8 rounded-full bg-white/45"></div>
                <div class="mt-1 h-1 w-6 rounded-full bg-white/30"></div>
              </div>
              <div class="flex-1 p-2">
                <div class="flex justify-end gap-1">
                  <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: theme.accentColor }"></span>
                  <span class="h-2 w-2 rounded-full bg-black/10"></span>
                </div>
                <div class="mt-4 grid grid-cols-3 gap-1">
                  <span v-for="item in 3" :key="item" class="h-7 bg-white/80 border border-black/5" :style="{ borderRadius: theme.cardRadius }"></span>
                </div>
              </div>
            </div>
            <div class="mt-3 flex items-start justify-between gap-3">
              <div>
                <p class="text-xs font-bold text-slate-900">{{ theme.name }}</p>
                <p class="text-[11px] text-slate-500 mt-0.5">{{ theme.description }}</p>
              </div>
              <span v-if="form.themeConfig.themeId === theme.id" class="text-[10px] font-bold text-emerald-700">Ativo</span>
            </div>
          </button>
        </div>
      </section>

      <!-- Store template library -->
      <section class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div>
            <h2 class="text-sm font-extrabold text-slate-900">Escolha o modelo da loja</h2>
            <p class="text-xs text-slate-500 mt-1">O modelo define a estrutura. O tema define cores, fontes e acabamento.</p>
          </div>
          <span class="text-[11px] font-semibold text-emerald-700">{{ getStoreTemplate(form.themeConfig.templateId).name }}</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            v-for="template in STORE_TEMPLATES"
            :key="template.id"
            type="button"
            @click="applyTemplate(template)"
            class="text-left p-4 rounded-2xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            :class="form.themeConfig.templateId === template.id ? 'border-emerald-600 bg-emerald-50/60' : 'border-slate-200 bg-slate-50 hover:border-slate-300'"
          >
            <div class="flex items-end gap-1 h-20 rounded-xl bg-white border border-slate-200 p-2">
              <span class="h-full w-1/4 rounded-sm bg-slate-900/80"></span>
              <span v-for="item in template.id === 'standard' ? 4 : 3" :key="item" class="h-3/4 flex-1 rounded-sm bg-emerald-200 border border-emerald-300"></span>
            </div>
            <div class="mt-3 flex items-start justify-between gap-3">
              <div>
                <p class="text-xs font-bold text-slate-900">{{ template.name }}</p>
                <p class="text-[11px] text-slate-500 mt-0.5">{{ template.description }}</p>
              </div>
              <span v-if="form.themeConfig.templateId === template.id" class="text-[10px] font-bold text-emerald-700">Ativo</span>
            </div>
          </button>
        </div>
      </section>

      <!-- Toast Feedback -->
      <div v-if="successMsg" class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-sm">
        <span class="flex items-center gap-2">
          <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span>{{ successMsg }}</span>
        </span>
        <button @click="successMsg = ''" class="text-emerald-600 hover:text-emerald-900 p-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Main Layout: 2 Columns (Editor Controls 7 cols + Live Preview 5 cols) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Left: Customizer Tabs & Inputs (7 cols) -->
        <div class="lg:col-span-7 space-y-6">
          <!-- Navigation Tabs -->
          <div class="flex items-center space-x-2 overflow-x-auto p-1.5 bg-white rounded-2xl border border-slate-200 shadow-xs scrollbar-none">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              type="button"
              @click="activeTab = tab.id"
              class="px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center space-x-2"
              :class="activeTab === tab.id ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
            >
              <svg v-if="tab.id === 'colors'" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4 5 5 0 015-5h1a1 1 0 001-1V9a4 4 0 018 0v2a1 1 0 001 1h1a5 5 0 015 5 4 4 0 01-4 4H7z" />
              </svg>
              <svg v-else-if="tab.id === 'banners'" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <svg v-else-if="tab.id === 'cards'" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <svg v-else class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>{{ tab.name }}</span>
            </button>
          </div>

          <form @submit.prevent="saveSettings" class="space-y-6">
            <!-- TAB 1: CORES & FONTES -->
            <div v-if="activeTab === 'colors'" class="space-y-6">
              <!-- Presets Rápidos -->
              <div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div class="flex items-center justify-between">
                  <h2 class="text-xs font-bold uppercase tracking-wider text-emerald-600">Paletas Prontas (1 Clique)</h2>
                  <span class="text-[11px] text-slate-400">Estilos pré-configurados</span>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <button
                    v-for="preset in colorPresets"
                    :key="preset.name"
                    type="button"
                    @click="applyPreset(preset)"
                    class="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition space-y-2 group"
                  >
                    <div class="flex items-center space-x-1.5">
                      <span class="w-4 h-4 rounded-full border border-slate-300 shadow-xs" :style="{ backgroundColor: preset.primary }"></span>
                      <span class="w-4 h-4 rounded-full border border-slate-300 shadow-xs" :style="{ backgroundColor: preset.accent }"></span>
                    </div>
                    <p class="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition">{{ preset.name }}</p>
                  </button>
                </div>
              </div>

              <!-- Cores Customizadas -->
              <div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
                <h2 class="text-xs font-bold uppercase tracking-wider text-emerald-600">Cores Personalizadas</h2>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">Cor Primária (Topo e Textos)</label>
                    <div class="flex items-center space-x-2.5">
                      <input
                        v-model="form.primaryColor"
                        type="color"
                        class="w-11 h-10 rounded-xl bg-white border border-slate-200 p-1 cursor-pointer"
                      />
                      <input
                        v-model="form.primaryColor"
                        type="text"
                        class="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">Cor de Acento (Botões e Destaques)</label>
                    <div class="flex items-center space-x-2.5">
                      <input
                        v-model="form.accentColor"
                        type="color"
                        class="w-11 h-10 rounded-xl bg-white border border-slate-200 p-1 cursor-pointer"
                      />
                      <input
                        v-model="form.accentColor"
                        type="text"
                        class="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">Fundo Geral da Loja</label>
                  <div class="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      @click="form.themeConfig.bgColor = '#ffffff'"
                      class="py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition"
                      :class="form.themeConfig.bgColor === '#ffffff' ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-xs' : 'border-slate-200 bg-slate-50 text-slate-600'"
                    >
                      <span class="w-3 h-3 rounded-full bg-white border border-slate-300"></span>
                      <span>Branco Puro</span>
                    </button>
                    <button
                      type="button"
                      @click="form.themeConfig.bgColor = '#f8fafc'"
                      class="py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition"
                      :class="form.themeConfig.bgColor === '#f8fafc' ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-xs' : 'border-slate-200 bg-slate-50 text-slate-600'"
                    >
                      <span class="w-3 h-3 rounded-full bg-slate-200"></span>
                      <span>Cinza Suave</span>
                    </button>
                    <button
                      type="button"
                      @click="form.themeConfig.bgColor = '#0f172a'"
                      class="py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition"
                      :class="form.themeConfig.bgColor === '#0f172a' ? 'border-emerald-600 bg-slate-900 text-white shadow-xs' : 'border-slate-200 bg-slate-50 text-slate-600'"
                    >
                      <span class="w-3 h-3 rounded-full bg-slate-900"></span>
                      <span>Dark Modern</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Tipografia / Fontes do Google Fonts -->
              <div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div class="flex items-center justify-between">
                  <h2 class="text-xs font-bold uppercase tracking-wider text-emerald-600">Tipografia da Loja (Google Fonts)</h2>
                  <span class="text-xs text-emerald-700 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">{{ form.themeConfig.fontFamily }}</span>
                </div>
                <p class="text-xs text-slate-500">Selecione entre as melhores fontes do Google Fonts ou busque qualquer uma pelo nome.</p>

                <div class="max-h-72 overflow-y-auto p-1 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <button
                    v-for="font in POPULAR_GOOGLE_FONTS"
                    :key="font.id"
                    type="button"
                    @click="form.themeConfig.fontFamily = font.id"
                    class="p-3 rounded-2xl border text-left transition relative overflow-hidden cursor-pointer"
                    :class="form.themeConfig.fontFamily === font.id ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-2xs' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'"
                  >
                    <p class="font-bold text-xs text-slate-900 truncate" :style="{ fontFamily: font.id }">{{ font.name }}</p>
                    <p class="text-[10px] text-slate-400 mt-0.5">{{ font.category }}</p>
                    <span v-if="form.themeConfig.fontFamily === font.id" class="absolute top-2 right-2 text-emerald-600 font-black text-xs">
                      ✓
                    </span>
                  </button>
                </div>
              </div>

              <!-- Barra de Avisos no Topo -->
              <div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div class="flex items-center justify-between">
                  <h2 class="text-xs font-bold uppercase tracking-wider text-emerald-600">Barra de Avisos do Topo</h2>
                  <label class="flex items-center space-x-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input type="checkbox" v-model="form.showAnnouncement" class="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                    <span>Exibir na Loja</span>
                  </label>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">Texto Promocional</label>
                  <input
                    v-model="form.announcementBar"
                    type="text"
                    placeholder="Frete Grátis acima de R$ 199 para todo o Brasil | Cupom: BEMVINDO10"
                    class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition"
                  />
                </div>
              </div>
            </div>

            <!-- TAB 2: LOGO & BANNERS -->
            <div v-if="activeTab === 'banners'" class="space-y-6">
              <!-- Logo e Identidade -->
              <div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <h2 class="text-xs font-bold uppercase tracking-wider text-emerald-600">Identidade & Logotipo</h2>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">Nome da Loja *</label>
                  <input
                    v-model="form.name"
                    type="text"
                    required
                    class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">Slogan / Frase de Efeito</label>
                  <input
                    v-model="form.themeConfig.tagline"
                    type="text"
                    placeholder="Ex: O melhor do streetwear e moda urbana com envio rápido"
                    class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition"
                  />
                </div>

                <div>
                  <ImageUploader
                    v-model="form.logoUrl"
                    label="Logotipo da Loja (Arquivo Real)"
                    hint="Salvo no servidor da loja"
                    placeholder="Clique para enviar arquivo do logo (PNG, JPG, SVG)"
                  />
                  <p class="text-[11px] text-slate-400 mt-1">Recomendado: imagem retangular ou quadrada com fundo transparente.</p>
                </div>
              </div>

              <!-- Banner Hero Principal -->
              <div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <h2 class="text-xs font-bold uppercase tracking-wider text-emerald-600">Banner Principal (Hero da Vitrine)</h2>

                <div>
                  <ImageUploader
                    v-model="form.bannerUrl"
                    label="Imagem do Banner Principal (Arquivo Real)"
                    hint="Salvo no servidor da loja"
                    placeholder="Clique para enviar arquivo do banner principal"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">Título em Destaque no Banner</label>
                  <input
                    v-model="form.description"
                    type="text"
                    placeholder="Ex: Nova Coleção Drop Exclusivo &bull; Verão 2026"
                    class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition"
                  />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">Texto do Botão do Banner</label>
                    <input
                      v-model="form.themeConfig.bannerButtonText"
                      type="text"
                      placeholder="Explorar Produtos"
                      class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">Link do Botão</label>
                    <input
                      v-model="form.themeConfig.bannerButtonLink"
                      type="text"
                      placeholder="#produtos"
                      class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <!-- Banner Secundário (Intermediário) -->
              <div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div class="flex items-center justify-between">
                  <h2 class="text-xs font-bold uppercase tracking-wider text-emerald-600">Banner Promocional Intermediário</h2>
                  <span class="text-[11px] text-slate-400">Exibido no meio da vitrine</span>
                </div>

                <div>
                  <ImageUploader
                    v-model="form.themeConfig.secondaryBannerUrl"
                    label="Imagem do Banner Promocional (Arquivo Real)"
                    hint="Salvo no servidor"
                    placeholder="Clique para enviar arquivo do banner promocional"
                  />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">Título do Banner Secundário</label>
                    <input
                      v-model="form.themeConfig.secondaryBannerTitle"
                      type="text"
                      placeholder="Ofertas Especiais da Semana"
                      class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">Link do Banner Secundário</label>
                    <input
                      v-model="form.themeConfig.secondaryBannerLink"
                      type="text"
                      placeholder="#produtos"
                      class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB 3: CARDS DE PRODUTO -->
            <div v-if="activeTab === 'cards'" class="space-y-6">
              <div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
                <h2 class="text-xs font-bold uppercase tracking-wider text-emerald-600">Estilo & Geometria dos Cards</h2>

                <!-- Arredondamento -->
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-2">Formato dos Cantos (Bordas)</label>
                  <div class="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      @click="form.themeConfig.cardRadius = 'rounded-xl'"
                      class="p-3 border text-center rounded-xl transition"
                      :class="form.themeConfig.cardRadius === 'rounded-xl' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold' : 'border-slate-200 bg-slate-50 text-slate-600'"
                    >
                      <div class="w-8 h-8 mx-auto mb-1.5 rounded-lg border border-slate-300"></div>
                      <span class="text-xs">Sutil (12px)</span>
                    </button>
                    <button
                      type="button"
                      @click="form.themeConfig.cardRadius = 'rounded-2xl'"
                      class="p-3 border text-center rounded-2xl transition"
                      :class="form.themeConfig.cardRadius === 'rounded-2xl' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold' : 'border-slate-200 bg-slate-50 text-slate-600'"
                    >
                      <div class="w-8 h-8 mx-auto mb-1.5 rounded-2xl border border-slate-300"></div>
                      <span class="text-xs">Moderno (16px)</span>
                    </button>
                    <button
                      type="button"
                      @click="form.themeConfig.cardRadius = 'rounded-3xl'"
                      class="p-3 border text-center rounded-3xl transition"
                      :class="form.themeConfig.cardRadius === 'rounded-3xl' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold' : 'border-slate-200 bg-slate-50 text-slate-600'"
                    >
                      <div class="w-8 h-8 mx-auto mb-1.5 rounded-3xl border border-slate-300"></div>
                      <span class="text-xs">Nuvem (24px)</span>
                    </button>
                  </div>
                </div>

                <!-- Botão de Ação no Card -->
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">Texto do Botão de Compra no Card</label>
                  <input
                    v-model="form.themeConfig.cardButtonText"
                    type="text"
                    placeholder="Adicionar à Sacola"
                    class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition"
                  />
                  <div class="flex flex-wrap gap-2 mt-2">
                    <button
                      type="button"
                      @click="form.themeConfig.cardButtonText = 'Adicionar à Sacola'"
                      class="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200"
                    >
                      Adicionar à Sacola
                    </button>
                    <button
                      type="button"
                      @click="form.themeConfig.cardButtonText = 'Comprar Agora'"
                      class="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200"
                    >
                      Comprar Agora
                    </button>
                    <button
                      type="button"
                      @click="form.themeConfig.cardButtonText = 'Quero Este'"
                      class="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200"
                    >
                      Quero Este
                    </button>
                  </div>
                </div>

                <!-- Toggles de Informações no Card -->
                <div class="space-y-3 pt-2 border-t border-slate-100">
                  <label class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <div>
                      <p class="text-xs font-bold text-slate-900">Exibir Selo de Desconto (% OFF)</p>
                      <p class="text-[11px] text-slate-500">Mostra a tag vermelha de porcentagem economizada quando houver preço comparativo.</p>
                    </div>
                    <input type="checkbox" v-model="form.themeConfig.showDiscountBadge" class="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                  </label>

                  <label class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <div>
                      <p class="text-xs font-bold text-slate-900">Exibir Parcelamento sem Juros</p>
                      <p class="text-[11px] text-slate-500">Exibe "ou até 3x de R$ ... sem juros" logo abaixo do preço à vista.</p>
                    </div>
                    <input type="checkbox" v-model="form.themeConfig.showInstallments" class="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                  </label>
                </div>
              </div>
            </div>

            <!-- TAB 4: CHECKOUT & CONFIANÇA -->
            <div v-if="activeTab === 'checkout'" class="space-y-6">
              <div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <h2 class="text-xs font-bold uppercase tracking-wider text-emerald-600">Selos de Garantia & Confiança (Checkout)</h2>
                <p class="text-xs text-slate-500">
                  Esses selos aumentam em até 28% a taxa de conversão durante a finalização do pedido.
                </p>

                <div class="space-y-3">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Selo 1: Segurança</label>
                    <input
                      v-model="form.themeConfig.checkoutBadge1"
                      type="text"
                      placeholder="Compra 100% Segura & Criptografada SSL"
                      class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Selo 2: Garantia</label>
                    <input
                      v-model="form.themeConfig.checkoutBadge2"
                      type="text"
                      placeholder="Garantia de 7 dias para troca ou devolução"
                      class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Selo 3: Envio</label>
                    <input
                      v-model="form.themeConfig.checkoutBadge3"
                      type="text"
                      placeholder="Envio Rápido com Rastreamento em Tempo Real"
                      class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <!-- Contato & Suporte -->
              <div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <h2 class="text-xs font-bold uppercase tracking-wider text-emerald-600">Atendimento ao Cliente</h2>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">WhatsApp Oficial da Loja *</label>
                    <input
                      v-model="form.contactWhatsapp"
                      type="text"
                      placeholder="11999998888"
                      class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">E-mail de Suporte *</label>
                    <input
                      v-model="form.contactEmail"
                      type="email"
                      placeholder="contato@minhaloja.com.br"
                      class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Botão Salvar no fim do formulário -->
            <div class="pt-4 flex justify-end">
              <button
                type="submit"
                :disabled="saving"
                class="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/20 transition hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center space-x-2"
              >
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span>Salvar Todas as Configurações da Loja</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Right: Real-time Live Preview Canvas (5 cols) -->
        <div class="lg:col-span-5 sticky top-6 space-y-4">
          <div class="flex items-center justify-between px-1">
            <div class="flex items-center space-x-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p class="text-xs font-extrabold uppercase tracking-wider text-slate-700">Simulador em Tempo Real</p>
            </div>

            <!-- Device Switcher -->
            <div class="flex items-center space-x-1 p-1 bg-white rounded-xl border border-slate-200 text-xs shadow-xs">
              <button
                type="button"
                @click="previewDevice = 'desktop'"
                class="px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1.5"
                :class="previewDevice === 'desktop' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-700'"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Desktop</span>
              </button>
              <button
                type="button"
                @click="previewDevice = 'mobile'"
                class="px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1.5"
                :class="previewDevice === 'mobile' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-700'"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>Mobile</span>
              </button>
            </div>
          </div>

          <!-- Preview Container -->
          <div
            class="rounded-3xl border border-slate-200 shadow-xl overflow-hidden transition-all duration-300 mx-auto"
            :class="previewDevice === 'mobile' ? 'max-w-[340px] border-4 border-slate-300' : 'w-full'"
            :style="{
              backgroundColor: form.themeConfig.bgColor || '#f8fafc',
              fontFamily: form.themeConfig.fontFamily || 'Inter, sans-serif'
            }"
          >
            <!-- Simulated Announcement Bar -->
            <div
              v-if="form.showAnnouncement && form.announcementBar"
              class="py-2 px-3 text-center text-[10px] font-semibold text-white truncate shadow-xs"
              :style="{ backgroundColor: form.primaryColor || '#0f172a' }"
            >
              {{ form.announcementBar }}
            </div>

            <!-- Simulated Navbar -->
            <div class="p-3.5 bg-white border-b border-slate-200/80 flex items-center justify-between shadow-xs">
              <div class="flex items-center space-x-2">
                <img
                  v-if="form.logoUrl"
                  :src="form.logoUrl"
                  alt="Logo"
                  class="h-7 w-auto object-contain rounded"
                />
                <div
                  v-else
                  class="w-7 h-7 rounded-lg flex items-center justify-center font-black text-white text-xs shadow-xs"
                  :style="{ backgroundColor: form.accentColor || '#059669' }"
                >
                  {{ form.name ? form.name.slice(0, 2).toUpperCase() : 'LJ' }}
                </div>
                <div>
                  <p class="font-extrabold text-xs text-slate-900 leading-tight">{{ form.name || 'Minha Loja' }}</p>
                  <p v-if="form.themeConfig.tagline" class="text-[9px] text-slate-400 truncate max-w-[140px]">{{ form.themeConfig.tagline }}</p>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <button
                  type="button"
                  class="px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-xs"
                  :style="{ backgroundColor: form.accentColor || '#059669' }"
                >
                  Sacola (0)
                </button>
              </div>
            </div>

            <!-- Simulated Hero Banner -->
            <div class="relative bg-slate-900 text-white min-h-[160px] flex items-center overflow-hidden">
              <img
                :src="form.bannerUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'"
                alt="Banner"
                class="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
              />
              <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent"></div>
              <div class="relative z-10 p-4 space-y-2 max-w-[85%]">
                <span class="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-white/20 uppercase tracking-wider backdrop-blur-xs">
                  Coleção 2026
                </span>
                <p class="text-xs font-black leading-tight line-clamp-2">
                  {{ form.description || 'Coleções exclusivas, lançamentos e ofertas imperdíveis.' }}
                </p>
                <button
                  type="button"
                  class="px-3 py-1.5 rounded-full text-[10px] font-extrabold text-white shadow-xs"
                  :style="{ backgroundColor: form.accentColor || '#059669' }"
                >
                  {{ form.themeConfig.bannerButtonText || 'Explorar Produtos' }} &rarr;
                </button>
              </div>
            </div>

            <!-- Simulated Product Card Grid -->
            <div class="p-4 space-y-2.5">
              <div class="flex items-center justify-between text-slate-800">
                <p class="text-xs font-extrabold">Produtos em Destaque</p>
                <span class="text-[10px] text-slate-400">Ver todos</span>
              </div>

              <!-- Product Card Sample -->
              <div
                class="bg-white border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
                :class="form.themeConfig.cardRadius || 'rounded-2xl'"
              >
                <div class="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500"
                    alt="Produto Exemplo"
                    class="w-full h-full object-cover"
                  />
                  <span
                    v-if="form.themeConfig.showDiscountBadge"
                    class="absolute top-2 left-2 bg-rose-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs"
                  >
                    35% OFF
                  </span>
                </div>

                <div class="p-3 space-y-2">
                  <div>
                    <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Streetwear</span>
                    <p class="font-bold text-slate-900 text-xs mt-0.5">Camiseta Heavyweight Algodão Pima</p>
                  </div>

                  <div>
                    <div class="flex items-baseline space-x-1.5">
                      <span class="font-black text-slate-900 text-xs">R$ 149,90</span>
                      <span class="text-[10px] text-slate-400 line-through">R$ 229,90</span>
                    </div>
                    <p v-if="form.themeConfig.showInstallments" class="text-[9px] text-emerald-600 font-semibold">
                      ou até 3x de R$ 49,96 sem juros
                    </p>
                  </div>

                  <button
                    type="button"
                    class="w-full py-2 rounded-xl text-[10px] font-extrabold text-white shadow-xs transition hover:opacity-90"
                    :style="{ backgroundColor: form.accentColor || '#059669' }"
                  >
                    {{ form.themeConfig.cardButtonText || 'Adicionar à Sacola' }}
                  </button>
                </div>
              </div>

              <!-- Simulated Checkout Badges -->
              <div class="p-3 bg-white rounded-2xl border border-slate-200 space-y-1.5 mt-3 shadow-xs">
                <p class="text-[9px] font-bold uppercase tracking-wider text-slate-400 text-center">Garantias do Checkout</p>
                <div class="text-[10px] text-slate-600 space-y-1.5">
                  <p class="flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span class="truncate">{{ form.themeConfig.checkoutBadge1 || 'Compra 100% Segura & Criptografada' }}</span>
                  </p>
                  <p class="flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span class="truncate">{{ form.themeConfig.checkoutBadge2 || 'Garantia de 7 dias para troca ou devolução' }}</span>
                  </p>
                  <p class="flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span class="truncate">{{ form.themeConfig.checkoutBadge3 || 'Envio Rápido e Rastreável pelos Correios' }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { STORE_THEMES, getStoreTheme, type StoreTheme } from '~/lib/store-themes'
import { STORE_TEMPLATES, getStoreTemplate, type StoreTemplate } from '~/lib/store-templates'
import { POPULAR_GOOGLE_FONTS } from '~/lib/google-fonts'

definePageMeta({
  middleware: 'admin',
})

const { fetchWithAuth, isAuthenticated, initAuth } = useAuth()
const router = useRouter()

const activeTab = ref('colors')
const previewDevice = ref<'desktop' | 'mobile'>('desktop')
const loading = ref(true)
const saving = ref(false)
const successMsg = ref('')

const tabs = [
  { id: 'colors', name: 'Cores & Fontes' },
  { id: 'banners', name: 'Logo & Banners' },
  { id: 'cards', name: 'Cards de Produto' },
  { id: 'checkout', name: 'Checkout & Confiança' },
]

const colorPresets = [
  { name: 'Verde Oficial Lojio', primary: '#064e3b', accent: '#059669', bg: '#f8fafc' },
  { name: 'Minimalista Black', primary: '#09090b', accent: '#18181b', bg: '#ffffff' },
  { name: 'Emerald Luxury', primary: '#022c22', accent: '#10b981', bg: '#f8fafc' },
  { name: 'Florestal Dark', primary: '#064e3b', accent: '#34d399', bg: '#021c14' },
  { name: 'Sunset Terracota', primary: '#431407', accent: '#ea580c', bg: '#fffaf5' },
  { name: 'Café & Grão', primary: '#27170e', accent: '#b45309', bg: '#fdfbf7' },
]

const fontOptions = [
  { id: 'Plus Jakarta Sans', name: 'Plus Jakarta', style: 'Amigável e contemporânea (padrão oficial)' },
  { id: 'Inter', name: 'Inter', style: 'Moderna e clean (padrão tech)' },
  { id: 'Poppins', name: 'Poppins', style: 'Geométrica e alta conversão' },
  { id: 'Outfit', name: 'Outfit', style: 'E-commerce premium e streetwear' },
  { id: 'Playfair Display', name: 'Playfair Display', style: 'Elegante e clássica (moda e luxo)' },
  { id: 'Montserrat', name: 'Montserrat', style: 'Forte, imponente e esportiva' },
]

const form = reactive({
  name: '',
  subdomain: '',
  description: '',
  logoUrl: '',
  bannerUrl: '',
  primaryColor: '#064e3b',
  accentColor: '#059669',
  announcementBar: '',
  showAnnouncement: true,
  contactWhatsapp: '',
  contactEmail: '',
  originZipcode: '01310-100',
  mpAccessToken: '',
  mpPublicKey: '',
  isActive: true,
  themeConfig: {
    themeId: 'classic',
    templateId: 'standard',
    fontFamily: 'Plus Jakarta Sans',
    bgColor: '#f8fafc',
    tagline: '',
    bannerButtonText: 'Explorar Produtos',
    bannerButtonLink: '#produtos',
    secondaryBannerUrl: '',
    secondaryBannerTitle: '',
    secondaryBannerLink: '#produtos',
    cardRadius: 'rounded-2xl',
    cardButtonText: 'Adicionar à Sacola',
    showDiscountBadge: true,
    showInstallments: true,
    checkoutBadge1: 'Compra 100% Segura & Criptografada SSL',
    checkoutBadge2: 'Garantia de 7 dias para troca ou devolução',
    checkoutBadge3: 'Envio Rápido e Rastreável pelos Correios',
  },
})

const applyPreset = (preset: any) => {
  form.primaryColor = preset.primary
  form.accentColor = preset.accent
  form.themeConfig.bgColor = preset.bg
}

const applyTheme = (theme: StoreTheme) => {
  form.themeConfig.themeId = theme.id
  form.primaryColor = theme.primaryColor
  form.accentColor = theme.accentColor
  form.themeConfig.bgColor = theme.bgColor
  form.themeConfig.fontFamily = theme.fontFamily
  form.themeConfig.cardRadius = theme.cardRadius === '4px' ? 'rounded' : 'rounded-xl'
}

const applyTemplate = (template: StoreTemplate) => {
  form.themeConfig.templateId = template.id
}

const loadStore = async () => {
  loading.value = true
  try {
    const res: any = await fetchWithAuth('/api/admin/store')
    const t = res.tenant || {}
    form.name = t.name || ''
    form.subdomain = t.subdomain || ''
    form.description = t.description || ''
    form.logoUrl = t.logoUrl || ''
    form.bannerUrl = t.bannerUrl || ''
    form.primaryColor = t.primaryColor || '#064e3b'
    form.accentColor = t.accentColor || '#059669'
    form.announcementBar = t.announcementBar || ''
    form.showAnnouncement = t.showAnnouncement ?? true
    form.contactWhatsapp = t.contactWhatsapp || ''
    form.contactEmail = t.contactEmail || ''
    form.originZipcode = t.originZipcode || '01310-100'
    form.mpAccessToken = t.mpAccessToken || ''
    form.mpPublicKey = t.mpPublicKey || ''
    form.isActive = t.isActive ?? true

    if (t.themeConfig && typeof t.themeConfig === 'object') {
      form.themeConfig = {
        ...form.themeConfig,
        ...t.themeConfig,
      }
    }
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
    successMsg.value = 'Design da loja atualizado com sucesso! As alterações já estão ao vivo.'
    setTimeout(() => { successMsg.value = '' }, 4000)
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Erro ao salvar alterações no tema.')
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
