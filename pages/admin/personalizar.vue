<template>
  <div class="min-h-screen bg-slate-50 flex text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
    <AdminSidebar />

    <main class="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div class="flex items-center space-x-2">
            <span class="text-xl">🎨</span>
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
            <span>↗</span>
          </a>

          <button
            @click="saveSettings"
            :disabled="saving"
            class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-600/20 transition hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center space-x-1.5"
          >
            <span>💾</span>
            <span>{{ saving ? 'Salvando...' : 'Salvar Alterações' }}</span>
          </button>
        </div>
      </div>

      <!-- Toast Feedback -->
      <div v-if="successMsg" class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-sm">
        <span class="flex items-center gap-2">
          <span>✓</span>
          <span>{{ successMsg }}</span>
        </span>
        <button @click="successMsg = ''" class="text-emerald-600 hover:text-emerald-900 text-base">&times;</button>
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
              :class="activeTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
            >
              <span>{{ tab.icon }}</span>
              <span>{{ tab.name }}</span>
            </button>
          </div>

          <form @submit.prevent="saveSettings" class="space-y-6">
            <!-- TAB 1: CORES & FONTES -->
            <div v-if="activeTab === 'colors'" class="space-y-6">
              <!-- Presets Rápidos -->
              <div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div class="flex items-center justify-between">
                  <h2 class="text-xs font-bold uppercase tracking-wider text-blue-600">Paletas Prontas (1 Clique)</h2>
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
                    <p class="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition">{{ preset.name }}</p>
                  </button>
                </div>
              </div>

              <!-- Cores Customizadas -->
              <div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
                <h2 class="text-xs font-bold uppercase tracking-wider text-blue-600">Cores Personalizadas</h2>

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
                        class="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
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
                        class="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
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
                      :class="form.themeConfig.bgColor === '#ffffff' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs' : 'border-slate-200 bg-slate-50 text-slate-600'"
                    >
                      <span class="w-3 h-3 rounded-full bg-white border border-slate-300"></span>
                      <span>Branco Puro</span>
                    </button>
                    <button
                      type="button"
                      @click="form.themeConfig.bgColor = '#f8fafc'"
                      class="py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition"
                      :class="form.themeConfig.bgColor === '#f8fafc' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs' : 'border-slate-200 bg-slate-50 text-slate-600'"
                    >
                      <span class="w-3 h-3 rounded-full bg-slate-200"></span>
                      <span>Cinza Suave</span>
                    </button>
                    <button
                      type="button"
                      @click="form.themeConfig.bgColor = '#0f172a'"
                      class="py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition"
                      :class="form.themeConfig.bgColor === '#0f172a' ? 'border-blue-600 bg-slate-900 text-white shadow-xs' : 'border-slate-200 bg-slate-50 text-slate-600'"
                    >
                      <span class="w-3 h-3 rounded-full bg-slate-900"></span>
                      <span>Dark Modern</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Tipografia / Fontes -->
              <div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div class="flex items-center justify-between">
                  <h2 class="text-xs font-bold uppercase tracking-wider text-blue-600">Tipografia da Loja (Google Fonts)</h2>
                  <span class="text-[11px] text-blue-600 font-semibold">{{ form.themeConfig.fontFamily }}</span>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <button
                    v-for="font in fontOptions"
                    :key="font.id"
                    type="button"
                    @click="form.themeConfig.fontFamily = font.id"
                    class="p-3.5 rounded-2xl border text-left transition relative overflow-hidden"
                    :class="form.themeConfig.fontFamily === font.id ? 'bg-blue-50 border-blue-600 text-blue-900' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'"
                  >
                    <p class="font-bold text-sm text-slate-900" :style="{ fontFamily: font.id }">{{ font.name }}</p>
                    <p class="text-[10px] text-slate-500 mt-0.5">{{ font.style }}</p>
                    <span v-if="form.themeConfig.fontFamily === font.id" class="absolute top-2 right-2 text-blue-600 text-xs font-bold">✓</span>
                  </button>
                </div>
              </div>

              <!-- Barra de Avisos no Topo -->
              <div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div class="flex items-center justify-between">
                  <h2 class="text-xs font-bold uppercase tracking-wider text-blue-600">Barra de Avisos do Topo</h2>
                  <label class="flex items-center space-x-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input type="checkbox" v-model="form.showAnnouncement" class="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span>Exibir na Loja</span>
                  </label>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">Texto Promocional</label>
                  <input
                    v-model="form.announcementBar"
                    type="text"
                    placeholder="🎉 Frete Grátis acima de R$ 199 para todo o Brasil | Cupom: BEMVINDO10"
                    class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                  />
                </div>
              </div>
            </div>

            <!-- TAB 2: LOGO & BANNERS -->
            <div v-if="activeTab === 'banners'" class="space-y-6">
              <!-- Logo e Identidade -->
              <div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <h2 class="text-xs font-bold uppercase tracking-wider text-blue-600">Identidade & Logotipo</h2>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">Nome da Loja *</label>
                  <input
                    v-model="form.name"
                    type="text"
                    required
                    class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">Slogan / Frase de Efeito</label>
                  <input
                    v-model="form.themeConfig.tagline"
                    type="text"
                    placeholder="Ex: O melhor do streetwear e moda urbana com envio rápido"
                    class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">URL do Logotipo (PNG / SVG Transparente)</label>
                  <input
                    v-model="form.logoUrl"
                    type="url"
                    placeholder="https://.../logo.png"
                    class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                  />
                  <p class="text-[11px] text-slate-400 mt-1">Recomendado: imagem retangular ou quadrada de 400x100px.</p>
                </div>
              </div>

              <!-- Banner Hero Principal -->
              <div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <h2 class="text-xs font-bold uppercase tracking-wider text-blue-600">Banner Principal (Hero da Vitrine)</h2>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">URL da Imagem de Fundo *</label>
                  <input
                    v-model="form.bannerUrl"
                    type="url"
                    placeholder="https://images.unsplash.com/photo-1441986300917-..."
                    class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">Título em Destaque no Banner</label>
                  <input
                    v-model="form.description"
                    type="text"
                    placeholder="Ex: Nova Coleção Drop Exclusivo &bull; Verão 2026"
                    class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                  />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">Texto do Botão do Banner</label>
                    <input
                      v-model="form.themeConfig.bannerButtonText"
                      type="text"
                      placeholder="Explorar Produtos"
                      class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">Link do Botão</label>
                    <input
                      v-model="form.themeConfig.bannerButtonLink"
                      type="text"
                      placeholder="#produtos"
                      class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <!-- Banner Secundário (Intermediário) -->
              <div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div class="flex items-center justify-between">
                  <h2 class="text-xs font-bold uppercase tracking-wider text-blue-600">Banner Promocional Intermediário</h2>
                  <span class="text-[11px] text-slate-400">Exibido no meio da vitrine</span>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">URL da Imagem do Banner Secundário</label>
                  <input
                    v-model="form.themeConfig.secondaryBannerUrl"
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                  />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">Título do Banner Secundário</label>
                    <input
                      v-model="form.themeConfig.secondaryBannerTitle"
                      type="text"
                      placeholder="Ofertas Especiais da Semana"
                      class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">Link do Banner Secundário</label>
                    <input
                      v-model="form.themeConfig.secondaryBannerLink"
                      type="text"
                      placeholder="#produtos"
                      class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB 3: CARDS DE PRODUTO -->
            <div v-if="activeTab === 'cards'" class="space-y-6">
              <div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
                <h2 class="text-xs font-bold uppercase tracking-wider text-blue-600">Estilo & Geometria dos Cards</h2>

                <!-- Arredondamento -->
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-2">Formato dos Cantos (Bordas)</label>
                  <div class="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      @click="form.themeConfig.cardRadius = 'rounded-xl'"
                      class="p-3 border text-center rounded-xl transition"
                      :class="form.themeConfig.cardRadius === 'rounded-xl' ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold' : 'border-slate-200 bg-slate-50 text-slate-600'"
                    >
                      <div class="w-8 h-8 mx-auto mb-1.5 rounded-lg border border-slate-300"></div>
                      <span class="text-xs">Sutil (12px)</span>
                    </button>
                    <button
                      type="button"
                      @click="form.themeConfig.cardRadius = 'rounded-2xl'"
                      class="p-3 border text-center rounded-2xl transition"
                      :class="form.themeConfig.cardRadius === 'rounded-2xl' ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold' : 'border-slate-200 bg-slate-50 text-slate-600'"
                    >
                      <div class="w-8 h-8 mx-auto mb-1.5 rounded-2xl border border-slate-300"></div>
                      <span class="text-xs">Moderno (16px)</span>
                    </button>
                    <button
                      type="button"
                      @click="form.themeConfig.cardRadius = 'rounded-3xl'"
                      class="p-3 border text-center rounded-3xl transition"
                      :class="form.themeConfig.cardRadius === 'rounded-3xl' ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold' : 'border-slate-200 bg-slate-50 text-slate-600'"
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
                    class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
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
                    <input type="checkbox" v-model="form.themeConfig.showDiscountBadge" class="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  </label>

                  <label class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <div>
                      <p class="text-xs font-bold text-slate-900">Exibir Parcelamento sem Juros</p>
                      <p class="text-[11px] text-slate-500">Exibe "ou até 3x de R$ ... sem juros" logo abaixo do preço à vista.</p>
                    </div>
                    <input type="checkbox" v-model="form.themeConfig.showInstallments" class="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  </label>
                </div>
              </div>
            </div>

            <!-- TAB 4: CHECKOUT & CONFIANÇA -->
            <div v-if="activeTab === 'checkout'" class="space-y-6">
              <div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <h2 class="text-xs font-bold uppercase tracking-wider text-blue-600">Selos de Garantia & Confiança (Checkout)</h2>
                <p class="text-xs text-slate-500">
                  Esses selos aumentam em até 28% a taxa de conversão durante a finalização do pedido.
                </p>

                <div class="space-y-3">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Selo 1: Segurança</label>
                    <input
                      v-model="form.themeConfig.checkoutBadge1"
                      type="text"
                      placeholder="🔒 Compra 100% Segura & Criptografada SSL"
                      class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Selo 2: Garantia</label>
                    <input
                      v-model="form.themeConfig.checkoutBadge2"
                      type="text"
                      placeholder="🛡️ Garantia de 7 dias para troca ou devolução"
                      class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Selo 3: Envio</label>
                    <input
                      v-model="form.themeConfig.checkoutBadge3"
                      type="text"
                      placeholder="📦 Envio Rápido com Rastreamento em Tempo Real"
                      class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <!-- Contato & Suporte -->
              <div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <h2 class="text-xs font-bold uppercase tracking-wider text-blue-600">Atendimento ao Cliente</h2>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">WhatsApp Oficial da Loja *</label>
                    <input
                      v-model="form.contactWhatsapp"
                      type="text"
                      placeholder="11999998888"
                      class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">E-mail de Suporte *</label>
                    <input
                      v-model="form.contactEmail"
                      type="email"
                      placeholder="contato@minhaloja.com.br"
                      class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
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
                class="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-600/20 transition hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center space-x-2"
              >
                <span>💾 Salvar Todas as Configurações da Loja</span>
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
                class="px-2.5 py-1 rounded-lg font-bold transition"
                :class="previewDevice === 'desktop' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-700'"
              >
                💻 Desktop
              </button>
              <button
                type="button"
                @click="previewDevice = 'mobile'"
                class="px-2.5 py-1 rounded-lg font-bold transition"
                :class="previewDevice === 'mobile' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-700'"
              >
                📱 Mobile
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
                  :style="{ backgroundColor: form.accentColor || '#2563eb' }"
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
                  :style="{ backgroundColor: form.accentColor || '#2563eb' }"
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
                  :style="{ backgroundColor: form.accentColor || '#2563eb' }"
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
                    :style="{ backgroundColor: form.accentColor || '#2563eb' }"
                  >
                    {{ form.themeConfig.cardButtonText || 'Adicionar à Sacola' }}
                  </button>
                </div>
              </div>

              <!-- Simulated Checkout Badges -->
              <div class="p-3 bg-white rounded-2xl border border-slate-200 space-y-1.5 mt-3 shadow-xs">
                <p class="text-[9px] font-bold uppercase tracking-wider text-slate-400 text-center">Garantias do Checkout</p>
                <div class="text-[10px] text-slate-600 space-y-1">
                  <p class="flex items-center gap-1.5">
                    <span>🔒</span>
                    <span class="truncate">{{ form.themeConfig.checkoutBadge1 || 'Compra 100% Segura & Criptografada' }}</span>
                  </p>
                  <p class="flex items-center gap-1.5">
                    <span>🛡️</span>
                    <span class="truncate">{{ form.themeConfig.checkoutBadge2 || 'Garantia de 7 dias para troca ou devolução' }}</span>
                  </p>
                  <p class="flex items-center gap-1.5">
                    <span>📦</span>
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
const { fetchWithAuth, isAuthenticated, initAuth } = useAuth()
const router = useRouter()

const activeTab = ref('colors')
const previewDevice = ref<'desktop' | 'mobile'>('desktop')
const loading = ref(true)
const saving = ref(false)
const successMsg = ref('')

const tabs = [
  { id: 'colors', name: 'Cores & Fontes', icon: '🎨' },
  { id: 'banners', name: 'Logo & Banners', icon: '🖼️' },
  { id: 'cards', name: 'Cards de Produto', icon: '🛍️' },
  { id: 'checkout', name: 'Checkout & Confiança', icon: '🔒' },
]

const colorPresets = [
  { name: 'Nuvemshop Classic', primary: '#0f172a', accent: '#2563eb', bg: '#f8fafc' },
  { name: 'Minimalista Black', primary: '#09090b', accent: '#18181b', bg: '#ffffff' },
  { name: 'Emerald Luxury', primary: '#064e3b', accent: '#059669', bg: '#f8fafc' },
  { name: 'Streetwear Neon', primary: '#1e1b4b', accent: '#7c3aed', bg: '#090d16' },
  { name: 'Sunset Laranja', primary: '#431407', accent: '#ea580c', bg: '#fffaf5' },
  { name: 'Café & Grão', primary: '#27170e', accent: '#b45309', bg: '#fdfbf7' },
]

const fontOptions = [
  { id: 'Inter', name: 'Inter', style: 'Moderna e clean (padrão tech)' },
  { id: 'Plus Jakarta Sans', name: 'Plus Jakarta', style: 'Amigável e contemporânea (Nuvemshop)' },
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
  primaryColor: '#0f172a',
  accentColor: '#2563eb',
  announcementBar: '',
  showAnnouncement: true,
  contactWhatsapp: '',
  contactEmail: '',
  originZipcode: '01310-100',
  mpAccessToken: '',
  mpPublicKey: '',
  isActive: true,
  themeConfig: {
    fontFamily: 'Inter',
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
    checkoutBadge1: '🔒 Compra 100% Segura & Criptografada SSL',
    checkoutBadge2: '🛡️ Garantia de 7 dias para troca ou devolução',
    checkoutBadge3: '📦 Envio Rápido e Rastreável pelos Correios',
  },
})

const applyPreset = (preset: any) => {
  form.primaryColor = preset.primary
  form.accentColor = preset.accent
  form.themeConfig.bgColor = preset.bg
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
    form.primaryColor = t.primaryColor || '#0f172a'
    form.accentColor = t.accentColor || '#2563eb'
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
