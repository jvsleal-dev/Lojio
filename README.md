# Plataforma E-commerce Multi-tenant (Estilo Nuvemshop)
**Stack Fullstack:** Nuxt 3 (SSR + Nitro Engine) + Prisma ORM + SQLite + Tailwind CSS

---

## 🚀 Como Iniciar o Projeto

Basta dar dois cliques no arquivo:
```cmd
start-dev.cmd
```
Ou executar no seu terminal:
```bash
npm run dev
```

O sistema estará disponível em:
* 🛍️ **Loja Pública (Storefront):** [http://localhost:3000](http://localhost:3000)
* ⚙️ **Painel Administrativo do Lojista:** [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 👤 Credenciais da Loja Demo (Já Populada no Banco)

* **E-mail:** `lojista@demo.com`
* **Senha:** `senha123`
* **Loja:** Moda Urbana (`modaurbana`)

---

## 🏗️ Arquitetura do Sistema

```
├── assets/css/main.css           # Estilos globais e fontes
├── components/                   # Componentes Vue reutilizáveis
│   ├── AnnouncementBar.vue       # Barra de avisos dinâmica da loja
│   ├── Navbar.vue                # Cabeçalho com logo, busca e sacola
│   ├── CartDrawer.vue            # Sacola lateral reativa com Drawer
│   ├── Footer.vue                # Rodapé com dados de contato e selos
│   └── AdminSidebar.vue          # Menu lateral do painel do lojista
├── composables/                  # Estado reativo compartilhado
│   ├── useCart.ts                # Gerenciador da sacola com persistência
│   └── useAuth.ts                # Autenticação JWT e sessão do lojista
├── pages/                        # Páginas e Rotas do Frontend
│   ├── index.vue                 # Vitrine da loja pública (Catálogo e Banner)
│   ├── produto/[slug].vue        # Página de Detalhes do Produto (PDP, Frete, Variações)
│   ├── checkout.vue              # Checkout transparente de 1 passo com PIX dinâmico
│   ├── pedido/[orderNumber].vue  # Acompanhamento do status do pedido e rastreio
│   └── admin/
│       ├── login.vue             # Login do lojista
│       ├── register.vue          # Cadastro do lojista e criação de loja
│       ├── index.vue             # Dashboard de métricas e vendas
│       ├── produtos/             # Gestão de catálogo
│       ├── pedidos/              # Gestão de pedidos e envio de rastreio
│       └── personalizar.vue      # Customizador visual (cores, banner, logo)
├── prisma/                       # Banco de dados e ORM
│   ├── schema.prisma             # Modelo de dados relacional
│   ├── dev.db                    # Banco de dados SQLite local
│   └── seed.js                   # Seeder de demonstração
└── server/                       # Backend & API REST (Nitro Engine)
    ├── middleware/tenant.ts       # Identificador automático da loja (subdomínio/header)
    ├── utils/                    # Utilitários (Prisma, Auth JWT, Criptografia)
    └── api/                      # Endpoints da API REST
        ├── auth/                 # Registro, Login, Perfil
        ├── store/                # Catálogo público, Frete, Checkout, Pedidos
        └── admin/                # Dashboard, CRUD Produtos, Pedidos, Temas
```
