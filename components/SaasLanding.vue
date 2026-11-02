<template>
  <div class="landing min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
    <!-- Top Bar / Floating Capsule Navbar (Image 1 & 2) -->
    <header class="fixed top-4 inset-x-0 z-50 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <nav class="flex items-center justify-between px-5 py-3 rounded-full bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 shadow-2xl shadow-black/50">
          <!-- Logo Brand (Nuvemshop style with cloud + spark) -->
          <NuxtLink to="/?tenant=none" class="flex items-center space-x-2.5 group">
            <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <span class="font-extrabold text-2xl tracking-tight text-white flex items-center">
              loj<span class="text-blue-500">io</span>
            </span>
          </NuxtLink>

          <!-- Middle Navigation Links -->
          <div class="hidden lg:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#recursos" class="hover:text-white transition">Recursos</a>
            <a href="#lojas" class="hover:text-white transition">Lojas Parceiras</a>
            <a href="#planos" class="hover:text-white transition">Planos</a>
            <a href="#depoimentos" class="hover:text-white transition">Depoimentos</a>
            <a href="#faq" class="hover:text-white transition">FAQ</a>
          </div>

          <!-- Right Action Buttons (Nuvemshop Image 1 exact style) -->
          <div class="flex items-center space-x-3">
            <NuxtLink
              to="/master/login"
              class="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-indigo-300 hover:text-white bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-500/30 transition"
              title="Painel do Dono da Plataforma"
            >
              <span>👑</span>
              <span>Painel Master</span>
            </NuxtLink>

            <!-- White Pill Button: Acessar meu painel (Exact Nuvemshop Hero Image 1) -->
            <NuxtLink
              to="/admin/login"
              class="px-5 py-2 rounded-full text-xs sm:text-sm font-extrabold text-[#002b66] bg-white hover:bg-slate-100 shadow-md transition hover:scale-105"
            >
              Acessar meu painel
            </NuxtLink>

            <button
              @click="openModal = true"
              class="hidden md:inline-flex items-center px-4 py-2 rounded-full text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95 transition"
            >
              Criar loja grátis
            </button>
          </div>
        </nav>
      </div>
    </header>

    <!-- Hero Section (Reference Image 1 & 5) -->
    <section class="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-[#030d22] via-[#051336] to-[#070b14]">
      <!-- Background Ambient Glow & Photo Overlay (Nuvemshop style) -->
      <div class="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80"
          alt="E-commerce Lifestyle"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-gradient-to-b from-blue-600/25 via-indigo-600/15 to-transparent blur-3xl pointer-events-none -z-10"></div>
      <div class="absolute -top-40 right-10 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <!-- Left Column: Copy & Inline Onboarding Form -->
          <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span>A plataforma líder para e-commerce no Brasil</span>
            </div>

            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
              Crie sua loja virtual com a Lojio
              <span class="block italic font-serif font-normal text-blue-200 text-3xl sm:text-4xl lg:text-5xl mt-2">
                a base para sua marca vender mais
              </span>
            </h1>

            <p class="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Monte seu e-commerce completo em minutos ou receba pedidos no WhatsApp com checkout transparente, PIX instantâneo e frete automatizado.
            </p>

            <!-- Inline Email Signup Box (Image 1 reference) -->
            <div class="pt-2 max-w-lg mx-auto lg:mx-0">
              <form @submit.prevent="handleQuickSignup" class="flex flex-col sm:flex-row items-center p-1.5 rounded-full bg-slate-900 border border-slate-700 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/30 transition shadow-2xl">
                <input
                  v-model="quickEmail"
                  type="email"
                  required
                  placeholder="nome@exemplo.com.br"
                  class="w-full sm:flex-1 px-5 py-3 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  class="w-full sm:w-auto mt-2 sm:mt-0 px-7 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition hover:scale-105 active:scale-95 shrink-0"
                >
                  Criar loja grátis
                </button>
              </form>
              <p class="mt-2.5 text-xs text-slate-400">
                Você não precisa de cartão de crédito para começar.
              </p>
            </div>

            <!-- Migration Banner Pill (Image 1 reference) -->
            <div class="pt-4 flex justify-center lg:justify-start">
              <a
                href="#planos"
                class="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 text-xs text-slate-300 transition group"
              >
                <span>Fatura mais de R$ 50 mil por mês?</span>
                <span class="text-brand-600 font-bold group-hover:underline">Migre para a Lojio &rarr;</span>
              </a>
            </div>
          </div>

          <!-- Right Column: Interactive Smartphone Mockup + Order Card (Images 1 & 5) -->
          <div class="lg:col-span-5 relative flex justify-center lg:justify-end">
            <!-- Smartphone Shell Mockup -->
            <div class="relative w-72 sm:w-80 rounded-[40px] bg-slate-900 p-3.5 border-4 border-slate-800 shadow-2xl shadow-blue-600/20">
              <!-- Speaker & Camera notch -->
              <div class="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-950 rounded-full z-20"></div>

              <!-- Phone Screen Content (Simulating live storefront) -->
              <div class="w-full rounded-[30px] bg-white text-slate-900 overflow-hidden text-xs pb-4">
                <!-- Mini Store Header -->
                <div class="bg-slate-900 text-white p-4 pt-7 flex items-center justify-between">
                  <span class="font-extrabold tracking-tight">MODA URBANA</span>
                  <div class="flex items-center space-x-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span class="text-[10px] text-slate-300">Online</span>
                  </div>
                </div>

                <!-- Mini Hero Banner -->
                <div class="relative h-28 bg-slate-800 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80"
                    alt="Streetwear"
                    class="w-full h-full object-cover opacity-70"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2.5">
                    <span class="text-white font-bold text-xs">Nova Coleção Streetwear 2026</span>
                  </div>
                </div>

                <!-- Mini Products Grid -->
                <div class="p-3 grid grid-cols-2 gap-2">
                  <div class="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80"
                      class="w-full h-16 object-cover rounded-lg mb-1"
                    />
                    <p class="font-bold text-[10px] truncate">Camiseta Oversized</p>
                    <p class="text-blue-600 font-extrabold text-[11px]">R$ 129,90</p>
                  </div>
                  <div class="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&auto=format&fit=crop&q=80"
                      class="w-full h-16 object-cover rounded-lg mb-1"
                    />
                    <p class="font-bold text-[10px] truncate">Sneaker White</p>
                    <p class="text-blue-600 font-extrabold text-[11px]">R$ 389,00</p>
                  </div>
                </div>

                <!-- Mini Action Button -->
                <div class="px-3">
                  <a
                    href="/?tenant=modaurbana"
                    class="block text-center w-full py-2 bg-blue-600 text-white font-bold rounded-xl text-[11px] shadow-md hover:bg-blue-500 transition"
                  >
                    Ver Loja Demonstração
                  </a>
                </div>
              </div>
            </div>

            <!-- Floating Order Confirmed Card (Offstore Image 5 Reference) -->
            <div class="absolute -bottom-6 -left-6 sm:-left-10 bg-white text-slate-900 p-4 rounded-2xl shadow-2xl border border-slate-100 max-w-xs animate-bounce-slow">
              <div class="flex items-center space-x-3 mb-2.5">
                <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h4 class="font-bold text-xs text-slate-900 leading-tight">Pedido confirmado!</h4>
                  <p class="text-[10px] text-slate-500">Pagamento aprovado via Pix</p>
                </div>
              </div>

              <div class="flex items-center justify-between text-xs py-2 px-2.5 bg-slate-50 rounded-xl mb-2.5">
                <span class="text-slate-600 font-medium">Pedido #1049 (2 itens)</span>
                <span class="font-black text-slate-900">R$ 539,70</span>
              </div>

              <div class="flex items-center space-x-1.5 py-1.5 px-3 rounded-xl bg-emerald-500 text-white text-[11px] font-bold justify-center shadow-md">
                <span>💬 Enviar pedido via WhatsApp</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Client Stores Live Ticker & Showcase (Image 2 top reference) -->
    <section id="lojas" class="py-12 border-y border-slate-800 bg-slate-900/60">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8">
          <p class="text-xs font-bold uppercase tracking-wider text-slate-400">
            Lojas parceiras criadas na nossa plataforma SaaS
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Moda Urbana -->
          <a
            href="/?tenant=modaurbana"
            class="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition group flex items-center justify-between shadow-xl"
          >
            <div class="flex items-center space-x-3.5">
              <div class="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-black text-lg border border-blue-500/30">
                MU
              </div>
              <div>
                <div class="flex items-center space-x-2">
                  <h3 class="font-bold text-white group-hover:text-blue-400 transition">Moda Urbana</h3>
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold uppercase">Enterprise</span>
                </div>
                <p class="text-xs text-slate-400">Streetwear & Sneakers &bull; modaurbana.localhost</p>
              </div>
            </div>
            <span class="text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
          </a>

          <!-- TechZone -->
          <a
            href="/?tenant=techzone"
            class="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition group flex items-center justify-between shadow-xl"
          >
            <div class="flex items-center space-x-3.5">
              <div class="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-black text-lg border border-purple-500/30">
                TZ
              </div>
              <div>
                <div class="flex items-center space-x-2">
                  <h3 class="font-bold text-white group-hover:text-purple-400 transition">TechZone Store</h3>
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold uppercase">Pro</span>
                </div>
                <p class="text-xs text-slate-400">Fones ANC & Teclados &bull; techzone.localhost</p>
              </div>
            </div>
            <span class="text-xs font-bold text-purple-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
          </a>

          <!-- Aroma & Grão Café -->
          <a
            href="/?tenant=cafegourmet"
            class="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition group flex items-center justify-between shadow-xl"
          >
            <div class="flex items-center space-x-3.5">
              <div class="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center font-black text-lg border border-amber-500/30">
                AG
              </div>
              <div>
                <div class="flex items-center space-x-2">
                  <h3 class="font-bold text-white group-hover:text-amber-400 transition">Aroma & Grão Café</h3>
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">Starter</span>
                </div>
                <p class="text-xs text-slate-400">Cafés Especiais &bull; cafegourmet.localhost</p>
              </div>
            </div>
            <span class="text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Complete Features / Structure (Reference Image 3 & 5) -->
    <section id="recursos" class="py-20 md:py-28 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span class="text-xs font-bold uppercase tracking-wider text-blue-400">Tecnologia de Ponta</span>
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            A estrutura completa para sua marca escalar
          </h2>
          <p class="text-slate-400 text-sm sm:text-base">
            Tudo o que você precisaria contratar em plataformas separadas, o nosso sistema já tem integrado nativamente.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Feature Card 1: AI & Efficiency (Image 3 Left Reference) -->
          <div class="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between hover:border-blue-500/40 transition">
            <div class="space-y-4">
              <!-- Mockup UI inside Card -->
              <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 mb-6">
                <div class="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                  <div class="flex items-center space-x-2">
                    <span class="text-indigo-400 font-bold">✨ Lumi IA</span>
                  </div>
                  <span class="text-slate-500 text-[11px]">Diagnóstico em Tempo Real</span>
                </div>
                <div class="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                  <p class="text-emerald-400 font-semibold mb-1">✓ 7 produtos otimizados para o Google</p>
                  <p class="text-slate-400 text-[11px]">Títulos e descrições com palavras-chave de alta conversão geradas com sucesso.</p>
                </div>
              </div>

              <span class="text-xs font-extrabold uppercase tracking-wider text-blue-400">Eficiência</span>
              <h3 class="text-2xl font-bold text-white">IA como diferencial competitivo</h3>
              <p class="text-slate-400 text-sm leading-relaxed">
                Recupere +80 horas de trabalho por mês: nosso assistente com Inteligência Artificial sugere descrições automáticas para produtos e aponta oportunidades práticas para aumentar o ticket médio.
              </p>
            </div>
          </div>

          <!-- Feature Card 2: Autonomy & Customization (Image 3 Right Reference) -->
          <div class="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between hover:border-blue-500/40 transition">
            <div class="space-y-4">
              <!-- Visual Banners Mockup -->
              <div class="grid grid-cols-2 gap-3 mb-6">
                <div class="h-28 rounded-2xl bg-gradient-to-tr from-blue-900/40 to-slate-800 border border-slate-700/60 p-3 flex flex-col justify-end">
                  <span class="text-white font-bold text-xs">Banners Personalizados</span>
                </div>
                <div class="h-28 rounded-2xl bg-gradient-to-tr from-purple-900/40 to-slate-800 border border-slate-700/60 p-3 flex flex-col justify-end">
                  <span class="text-white font-bold text-xs">Cores & Tipografia</span>
                </div>
              </div>

              <span class="text-xs font-extrabold uppercase tracking-wider text-blue-400">Personalização</span>
              <h3 class="text-2xl font-bold text-white">Autonomia total sobre vitrine e campanhas</h3>
              <p class="text-slate-400 text-sm leading-relaxed">
                Altere a identidade da sua loja, cores primárias, anúncios no topo e categorias sem abrir chamado e sem fila de espera. Sua loja roda linda, rápida e pronta para converter.
              </p>
            </div>
          </div>
        </div>

        <!-- Offstore Reference Section: Venda pelo WhatsApp ou Receba no Site (Image 5) -->
        <div class="mt-12 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900 border border-slate-800 shadow-2xl">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-7 space-y-5">
              <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <span class="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
                <span>Flexibilidade Total para o Cliente</span>
              </div>

              <h3 class="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Venda através do WhatsApp ou receba pagamentos no site
              </h3>

              <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
                Receba pedidos com mais praticidade, permitindo que o cliente finalize a compra no site via <strong>PIX instantâneo</strong>, parcelamento em até <strong>12x no Cartão</strong>, ou continue o atendimento personalizado diretamente pelo <strong>WhatsApp</strong>.
              </p>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div class="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span class="text-xl">⚡</span>
                  <p class="font-bold text-white text-xs mt-1">PIX Instantâneo</p>
                  <p class="text-[11px] text-slate-500">QR Code na hora</p>
                </div>
                <div class="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span class="text-xl">💳</span>
                  <p class="font-bold text-white text-xs mt-1">Cartão em 12x</p>
                  <p class="text-[11px] text-slate-500">Checkout transparente</p>
                </div>
                <div class="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span class="text-xl">💬</span>
                  <p class="font-bold text-white text-xs mt-1">WhatsApp 1-Clique</p>
                  <p class="text-[11px] text-slate-500">Venda consultiva</p>
                </div>
              </div>
            </div>

            <!-- Card Demo Mockup (Image 5 exact style) -->
            <div class="lg:col-span-5 flex justify-center">
              <div class="w-full max-w-sm bg-white text-slate-900 p-6 sm:p-7 rounded-3xl shadow-2xl border border-slate-100 text-center space-y-4">
                <div class="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-2xl mx-auto">
                  ✓
                </div>
                <div>
                  <h4 class="text-xl font-extrabold text-slate-900">Pedido confirmado!</h4>
                  <p class="text-xs text-slate-500 mt-0.5">Pagamento aprovado via Pix</p>
                </div>

                <div class="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs">
                  <div class="flex items-center space-x-2.5">
                    <div class="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-lg">
                      👗
                    </div>
                    <div>
                      <p class="font-bold text-slate-900 leading-tight">Pedido #1049</p>
                      <p class="text-[11px] text-slate-500">2 Itens</p>
                    </div>
                  </div>
                  <span class="font-black text-slate-900 text-sm">R$ 539,70</span>
                </div>

                <div class="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] text-white font-extrabold text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2">
                  <span>💬</span>
                  <span>Enviar pedido via WhatsApp</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section: Planos para toda a sua jornada (Image 2 Reference) -->
    <section id="planos" class="py-24 bg-gradient-to-b from-blue-950 via-blue-900 to-slate-950 relative overflow-hidden">
      <!-- Glow background -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-600/30 via-transparent to-transparent pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Planos para toda a sua jornada
          </h2>
          <p class="text-blue-200 text-base">
            Comece de graça ou escolha o plano que melhor se encaixa no momento do seu negócio.
          </p>

          <!-- Monthly / Annual Toggle Pill (Image 2 reference) -->
          <div class="inline-flex items-center p-1.5 rounded-full bg-blue-900/60 border border-blue-400/30 backdrop-blur-md">
            <button
              @click="annual = false"
              class="px-5 py-2 rounded-full text-xs font-bold transition"
              :class="!annual ? 'bg-white text-blue-900 shadow-md' : 'text-blue-200 hover:text-white'"
            >
              Mensal
            </button>
            <button
              @click="annual = true"
              class="px-5 py-2 rounded-full text-xs font-bold transition flex items-center space-x-1"
              :class="annual ? 'bg-white text-blue-900 shadow-md' : 'text-blue-200 hover:text-white'"
            >
              <span>Anual</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500 text-white font-extrabold">-15%</span>
            </button>
          </div>
        </div>

        <!-- 5 Plan Cards Grid (Exact structure of Image 2) -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <!-- 1. Começo -->
          <div class="p-6 rounded-3xl bg-blue-900/40 backdrop-blur-md border border-blue-400/20 flex flex-col justify-between hover:border-blue-400/50 transition">
            <div>
              <p class="text-sm font-bold text-blue-200">Começo</p>
              <p class="text-2xl font-black text-white mt-3">Gratuito</p>

              <div class="mt-6 pt-5 border-t border-blue-400/20 space-y-3 text-xs text-blue-100">
                <p class="font-bold uppercase tracking-wider text-[10px] text-blue-300">Destaque</p>
                <div class="flex items-start space-x-2">
                  <span class="text-blue-400 font-bold">✓</span>
                  <span>1 layout profissional</span>
                </div>
                <div class="flex items-start space-x-2">
                  <span class="text-blue-400 font-bold">✓</span>
                  <span>Pix com aprovação imediata</span>
                </div>
                <div class="flex items-start space-x-2">
                  <span class="text-blue-400 font-bold">✓</span>
                  <span>Produtos e vendas ilimitadas</span>
                </div>
              </div>
            </div>

            <button
              @click="openModalWithPlan('STARTER')"
              class="mt-8 w-full py-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-blue-900 font-bold text-xs transition border border-white/20"
            >
              Criar loja grátis
            </button>
          </div>

          <!-- 2. Essencial -->
          <div class="p-6 rounded-3xl bg-blue-900/40 backdrop-blur-md border border-blue-400/20 flex flex-col justify-between hover:border-blue-400/50 transition">
            <div>
              <p class="text-sm font-bold text-blue-200">Essencial</p>
              <div class="mt-3 flex items-baseline space-x-1">
                <span class="text-2xl font-black text-white">{{ annual ? 'R$ 58' : 'R$ 69' }}</span>
                <span class="text-xs text-blue-200">/mês</span>
              </div>

              <div class="mt-6 pt-5 border-t border-blue-400/20 space-y-3 text-xs text-blue-100">
                <p class="font-bold uppercase tracking-wider text-[10px] text-blue-300">Destaque</p>
                <div class="flex items-start space-x-2">
                  <span class="text-blue-400 font-bold">✓</span>
                  <span>+70 layouts profissionais</span>
                </div>
                <div class="flex items-start space-x-2">
                  <span class="text-blue-400 font-bold">✓</span>
                  <span>30 usos de IA / mês</span>
                </div>
                <div class="flex items-start space-x-2">
                  <span class="text-blue-400 font-bold">✓</span>
                  <span>Cálculo de frete Correios/Melhor Envio</span>
                </div>
              </div>
            </div>

            <button
              @click="openModalWithPlan('STARTER')"
              class="mt-8 w-full py-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-blue-900 font-bold text-xs transition border border-white/20"
            >
              Testar 7 dias grátis
            </button>
          </div>

          <!-- 3. Impulso (Recomendado - Highlighted Card) -->
          <div class="p-6 rounded-3xl bg-blue-600/70 backdrop-blur-xl border-2 border-white/40 shadow-2xl shadow-blue-500/40 flex flex-col justify-between relative transform -translate-y-2">
            <span class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-white font-extrabold text-[10px] uppercase tracking-wider shadow">
              Recomendado
            </span>
            <div>
              <p class="text-sm font-extrabold text-white">Impulso</p>
              <div class="mt-3 flex items-baseline space-x-1">
                <span class="text-3xl font-black text-white">{{ annual ? 'R$ 139' : 'R$ 164' }}</span>
                <span class="text-xs text-blue-100">/mês</span>
              </div>

              <div class="mt-6 pt-5 border-t border-white/20 space-y-3 text-xs text-white">
                <p class="font-bold uppercase tracking-wider text-[10px] text-blue-200">Destaque</p>
                <div class="flex items-start space-x-2">
                  <span class="text-emerald-300 font-bold">✓</span>
                  <span>150 usos de IA / mês</span>
                </div>
                <div class="flex items-start space-x-2">
                  <span class="text-emerald-300 font-bold">✓</span>
                  <span>Acesso ao código e CSS</span>
                </div>
                <div class="flex items-start space-x-2">
                  <span class="text-emerald-300 font-bold">✓</span>
                  <span>Ações em massa e cupons</span>
                </div>
              </div>
            </div>

            <button
              @click="openModalWithPlan('PRO')"
              class="mt-8 w-full py-3 rounded-full bg-white hover:bg-blue-50 text-blue-900 font-extrabold text-xs shadow-lg transition hover:scale-105"
            >
              Testar 7 dias grátis
            </button>
          </div>

          <!-- 4. Escala -->
          <div class="p-6 rounded-3xl bg-blue-900/40 backdrop-blur-md border border-blue-400/20 flex flex-col justify-between hover:border-blue-400/50 transition">
            <div>
              <p class="text-sm font-bold text-blue-200">Escala</p>
              <div class="mt-3 flex items-baseline space-x-1">
                <span class="text-2xl font-black text-white">{{ annual ? 'R$ 381' : 'R$ 449' }}</span>
                <span class="text-xs text-blue-200">/mês</span>
              </div>

              <div class="mt-6 pt-5 border-t border-blue-400/20 space-y-3 text-xs text-blue-100">
                <p class="font-bold uppercase tracking-wider text-[10px] text-blue-300">Destaque</p>
                <div class="flex items-start space-x-2">
                  <span class="text-blue-400 font-bold">✓</span>
                  <span>IA ilimitada</span>
                </div>
                <div class="flex items-start space-x-2">
                  <span class="text-blue-400 font-bold">✓</span>
                  <span>Controle de equipe multi-usuário</span>
                </div>
                <div class="flex items-start space-x-2">
                  <span class="text-blue-400 font-bold">✓</span>
                  <span>Estatísticas avançadas de vendas</span>
                </div>
              </div>
            </div>

            <button
              @click="openModalWithPlan('ENTERPRISE')"
              class="mt-8 w-full py-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-blue-900 font-bold text-xs transition border border-white/20"
            >
              Testar 7 dias grátis
            </button>
          </div>

          <!-- 5. Next / Enterprise -->
          <div class="p-6 rounded-3xl bg-blue-900/40 backdrop-blur-md border border-blue-400/20 flex flex-col justify-between hover:border-blue-400/50 transition">
            <div>
              <p class="text-sm font-bold text-blue-200">Next</p>
              <p class="text-2xl font-black text-white mt-3">Sob Consulta</p>

              <div class="mt-6 pt-5 border-t border-blue-400/20 space-y-3 text-xs text-blue-100">
                <p class="font-bold uppercase tracking-wider text-[10px] text-blue-300">Destaque</p>
                <div class="flex items-start space-x-2">
                  <span class="text-blue-400 font-bold">✓</span>
                  <span>Gerente de contas dedicado</span>
                </div>
                <div class="flex items-start space-x-2">
                  <span class="text-blue-400 font-bold">✓</span>
                  <span>Migração assistida sem custo</span>
                </div>
                <div class="flex items-start space-x-2">
                  <span class="text-blue-400 font-bold">✓</span>
                  <span>SLA e infraestrutura dedicada</span>
                </div>
              </div>
            </div>

            <button
              @click="openModalWithPlan('ENTERPRISE')"
              class="mt-8 w-full py-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-blue-900 font-bold text-xs transition border border-white/20"
            >
              Falar com Vendas
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section: Escute de quem já vende (Image 4 Reference) -->
    <section id="depoimentos" class="py-24 bg-slate-900 border-t border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Escute de quem
            <span class="italic font-serif font-normal text-brand-600">já vende com a Lojio</span>
          </h2>
          <div class="pt-2 flex justify-center space-x-3">
            <button
              @click="openModal = true"
              class="px-6 py-2.5 rounded-full bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition shadow"
            >
              Criar loja grátis
            </button>
            <a
              href="#planos"
              class="px-6 py-2.5 rounded-full bg-slate-800 text-slate-200 font-bold text-xs hover:bg-slate-700 border border-slate-700 transition"
            >
              Falar com Vendas
            </a>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Testimonial 1 (Image 4 Left Reference) -->
          <div class="p-8 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div class="space-y-4">
              <span class="text-3xl text-blue-500 font-serif font-black block">“</span>
              <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
                Vendo todos os recursos que a plataforma tinha, eu percebi que o poder de venda que um site próprio tem é muito grande. Eu não precisava mais fazer todo o trabalho sozinha no Instagram.
              </p>
              <div class="pt-4 border-t border-slate-800/80">
                <p class="font-bold text-white text-sm">Aline Junqueira</p>
                <p class="text-xs text-blue-400 font-semibold uppercase tracking-wider">Fundadora / Bloom Brand</p>
              </div>
            </div>

            <div class="mt-6 flex flex-wrap gap-2">
              <span class="px-2.5 py-1 rounded-lg bg-blue-950 text-blue-300 text-[11px] font-semibold border border-blue-800/40">Nuvem Pago</span>
              <span class="px-2.5 py-1 rounded-lg bg-blue-950 text-blue-300 text-[11px] font-semibold border border-blue-800/40">Nuvem Envio</span>
              <span class="px-2.5 py-1 rounded-lg bg-blue-950 text-blue-300 text-[11px] font-semibold border border-blue-800/40">Nuvem Marketing</span>
            </div>
          </div>

          <!-- Testimonial 2 (Image 4 Right Reference) -->
          <div class="p-8 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div class="space-y-4">
              <span class="text-3xl text-blue-500 font-serif font-black block">“</span>
              <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
                Uma das dificuldades que a gente tinha era a taxa de conversão baixa: menos de 1%. Com a Lojio atingimos um pico de 2,63% e, além disso, aumentamos em 97% nosso número de pedidos no site em um ano.
              </p>
              <div class="pt-4 border-t border-slate-800/80">
                <p class="font-bold text-white text-sm">Katharina Neves</p>
                <p class="text-xs text-blue-400 font-semibold uppercase tracking-wider">Mica Chocolates</p>
              </div>
            </div>

            <div class="mt-6 flex flex-wrap gap-2">
              <span class="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 text-[11px] font-semibold border border-emerald-800/40">+97% em Vendas</span>
              <span class="px-2.5 py-1 rounded-lg bg-blue-950 text-blue-300 text-[11px] font-semibold border border-blue-800/40">Checkout Transparente</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section id="faq" class="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-black text-white">Perguntas Frequentes</h2>
        <p class="text-slate-400 text-sm mt-2">Tire suas dúvidas e comece hoje mesmo a vender</p>
      </div>

      <div class="space-y-4">
        <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <h3 class="font-bold text-white text-sm mb-2">Preciso ter CNPJ para criar minha loja?</h3>
          <p class="text-xs text-slate-400 leading-relaxed">
            Não! Você pode iniciar seu e-commerce com seu CPF e migrar para CNPJ a qualquer momento à medida que suas vendas crescerem.
          </p>
        </div>

        <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <h3 class="font-bold text-white text-sm mb-2">Como recebo os pagamentos via PIX?</h3>
          <p class="text-xs text-slate-400 leading-relaxed">
            O PIX tem aprovação imediata e QR Code gerado em tempo real no checkout. O valor é creditado diretamente na sua conta integrada do Mercado Pago.
          </p>
        </div>

        <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <h3 class="font-bold text-white text-sm mb-2">Como funciona a gestão de múltiplos clientes?</h3>
          <p class="text-xs text-slate-400 leading-relaxed">
            O Dono da Plataforma possui um painel Master SuperAdmin dedicado (<code class="text-blue-400">/master</code>) para gerenciar todas as lojas cadastradas, verificar o faturamento global (GMV), ativar ou suspender contas e criar novas lojas com 1 clique.
          </p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-slate-800/80 bg-slate-950 py-12 text-slate-400 text-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-sm">
            ⚡
          </div>
          <span class="font-bold text-white text-sm">Lojio &bull; Plataforma de e-commerce</span>
        </div>

        <div class="flex items-center space-x-6">
          <NuxtLink to="/admin" class="hover:text-white transition">Painel do Lojista</NuxtLink>
          <NuxtLink to="/master" class="hover:text-white transition font-bold text-indigo-400">Painel Master SuperAdmin</NuxtLink>
          <a href="#lojas" class="hover:text-white transition">Lojas Parceiras</a>
        </div>

        <p class="text-slate-500">
          &copy; 2026 Lojio. Todos os direitos reservados.
        </p>
      </div>
    </footer>

    <!-- Modal Criar Loja Rápida -->
    <div v-if="openModal" class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl text-slate-100">
        <div class="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div>
            <h3 class="text-lg font-black text-white">Criar Minha Loja Virtual</h3>
            <p class="text-xs text-slate-400">Comece a vender online em menos de 1 minuto</p>
          </div>
          <button @click="openModal = false" class="text-slate-400 hover:text-white text-xl">&times;</button>
        </div>

        <form @submit.prevent="handleCreateStore" class="space-y-4">
          <div v-if="createError" class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            {{ createError }}
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Nome da sua marca / loja *</label>
            <input
              v-model="newStore.name"
              @input="autoGenerateSubdomain"
              required
              placeholder="Ex: Closet da Maria"
              class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Subdomínio (Link da sua loja) *</label>
            <div class="flex items-center">
              <input
                v-model="newStore.subdomain"
                required
                placeholder="closetdamaria"
                class="flex-1 px-4 py-2.5 rounded-l-xl bg-slate-800 border border-r-0 border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
              <span class="px-3 py-2.5 bg-slate-800/80 border border-l-0 border-slate-700 rounded-r-xl text-slate-400 text-xs font-mono">
                .lojio.com.br
              </span>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Seu e-mail (Login) *</label>
            <input
              v-model="newStore.email"
              type="email"
              required
              placeholder="maria@email.com"
              class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Crie uma senha *</label>
            <input
              v-model="newStore.password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div class="pt-3">
            <button
              type="submit"
              :disabled="loadingCreate"
              class="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition hover:scale-105 disabled:opacity-50"
            >
              {{ loadingCreate ? 'Criando sua loja...' : 'Criar minha loja agora' }}
            </button>
            <p class="text-[11px] text-center text-slate-500 mt-2">
              Ao continuar, você concorda com nossos termos de uso.
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const annual = ref(false)
const quickEmail = ref('')
const openModal = ref(false)
const loadingCreate = ref(false)
const createError = ref('')

const newStore = reactive({
  name: '',
  subdomain: '',
  email: '',
  password: '',
  plan: 'PRO',
})

const { setSession } = useAuth()
const router = useRouter()

const autoGenerateSubdomain = () => {
  newStore.subdomain = newStore.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
}

const handleQuickSignup = () => {
  newStore.email = quickEmail.value
  openModal.value = true
}

const openModalWithPlan = (plan: string) => {
  newStore.plan = plan
  openModal.value = true
}

const handleCreateStore = async () => {
  loadingCreate.value = true
  createError.value = ''

  try {
    const res: any = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        storeName: newStore.name,
        subdomain: newStore.subdomain,
        name: newStore.name,
        email: newStore.email,
        password: newStore.password,
      }
    })

    setSession(res.token, res.user, res.tenant)
    openModal.value = false
    router.push('/admin')
  } catch (err: any) {
    createError.value = err.data?.statusMessage || 'Erro ao criar loja. Verifique se o subdomínio ou e-mail já existem.'
  } finally {
    loadingCreate.value = false
  }
}
</script>

<style scoped>
/* Identidade da landing: branco como base e dois verdes para hierarquia e conversão. */
.landing {
  background: #fff;
  color: #24342c;
}

.landing :deep([class*="bg-slate-950"]),
.landing :deep([class*="bg-slate-900"]),
.landing :deep([class*="bg-slate-800"]) {
  background-color: #fff !important;
}

.landing :deep([class*="border-slate-"]) {
  border-color: #d6e6dc !important;
}

.landing :deep([class*="text-white"]),
.landing :deep([class*="text-slate-100"]),
.landing :deep([class*="text-slate-200"]),
.landing :deep([class*="text-slate-300"]) {
  color: #123d2b !important;
}

.landing :deep([class*="text-slate-400"]),
.landing :deep([class*="text-slate-500"]) {
  color: #5b7164 !important;
}

.landing :deep([class*="text-blue-"]),
.landing :deep([class*="text-indigo-"]),
.landing :deep([class*="text-purple-"]),
.landing :deep([class*="text-amber-"]) {
  color: #1f7a52 !important;
}

.landing :deep([class*="bg-blue-"]),
.landing :deep([class*="bg-indigo-"]),
.landing :deep([class*="bg-purple-"]),
.landing :deep([class*="bg-amber-"]) {
  background-color: #e7f3ec !important;
}

.landing :deep([class*="border-blue-"]),
.landing :deep([class*="border-indigo-"]),
.landing :deep([class*="border-purple-"]),
.landing :deep([class*="border-amber-"]) {
  border-color: #9bcdb1 !important;
}

/* Hero e planos recebem o verde institucional; todos os demais blocos mantêm respiro branco. */
.landing > section:first-of-type,
.landing > section:nth-of-type(4) {
  background: #123d2b !important;
}

.landing > section:first-of-type :deep(.text-white),
.landing > section:first-of-type :deep(.text-slate-100),
.landing > section:nth-of-type(4) :deep(.text-white),
.landing > section:nth-of-type(4) :deep(.text-slate-100) {
  color: #fff !important;
}

.landing > section:first-of-type :deep(.text-slate-300),
.landing > section:first-of-type :deep(.text-slate-400),
.landing > section:nth-of-type(4) :deep(.text-slate-300),
.landing > section:nth-of-type(4) :deep(.text-slate-400) {
  color: #d8eadf !important;
}

.landing > section:first-of-type :deep([class*="bg-blue-"]),
.landing > section:nth-of-type(4) :deep([class*="bg-blue-"]) {
  background-color: #1f7a52 !important;
}

.landing :deep(.bg-emerald-500),
.landing :deep(.bg-blue-600),
.landing :deep(.bg-indigo-600) {
  background-color: #1f7a52 !important;
}

.landing :deep(.hover\\:bg-blue-500:hover),
.landing :deep(.hover\\:bg-indigo-500:hover) {
  background-color: #165b3d !important;
}

@keyframes bounceSlow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
.animate-bounce-slow {
  animation: bounceSlow 4s ease-in-out infinite;
}
</style>
