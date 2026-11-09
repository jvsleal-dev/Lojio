import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)

  // Skip tenant resolution for static assets or master admin APIs
  if (
    url.pathname.startsWith('/_nuxt') ||
    url.pathname.startsWith('/__nuxt') ||
    url.pathname.startsWith('/api/master')
  ) {
    return
  }

  const query = getQuery(event)
  const headerSubdomain = getHeader(event, 'x-tenant-subdomain')
  const headerId = getHeader(event, 'x-tenant-id')

  let subdomain: string | null = null

  if (query.tenant) {
    if (['none', 'saas', 'plataforma', 'home', ''].includes(String(query.tenant).toLowerCase())) {
      deleteCookie(event, 'selected_tenant')
      event.context.tenant = null
      return
    }
    subdomain = String(query.tenant).toLowerCase().trim()
    setCookie(event, 'selected_tenant', subdomain, { path: '/', maxAge: 60 * 60 * 24 * 30 })
  } else if (headerSubdomain) {
    subdomain = headerSubdomain.toLowerCase().trim()
  } else {
    // Resolve from host
    const host = getRequestHost(event).split(':')[0].toLowerCase()
    const hostParts = host.split('.')

    // Recognise SaaS platform hosts that do NOT have a merchant subdomain
    const isLocalhostRoot = host === 'localhost' || host === '127.0.0.1'
    const isVercelRoot = host.endsWith('.vercel.app') && hostParts.length <= 3 // e.g. lojio-1agl.vercel.app
    const isPlatformRoot = isLocalhostRoot || isVercelRoot || host === 'lojio.com.br' || host === 'www.lojio.com.br'

    if (!isPlatformRoot) {
      if (host.includes('localhost') && hostParts.length > 1) {
        // e.g. modaurbana.localhost
        subdomain = hostParts[0]
      } else if (host.endsWith('.vercel.app') && hostParts.length > 3) {
        // e.g. modaurbana.lojio-1agl.vercel.app
        subdomain = hostParts[0]
      } else if (hostParts.length > 2 && hostParts[0] !== 'www') {
        // e.g. modaurbana.lojio.com.br
        subdomain = hostParts[0]
      } else {
        // Could be a custom domain like www.modaurbana.com.br
        const tenantByCustomDomain = await prisma.tenant.findFirst({
          where: { customDomain: host, isActive: true },
        })
        if (tenantByCustomDomain) {
          event.context.tenant = tenantByCustomDomain
          return
        }
      }
    }
  }

  let tenant = null

  if (headerId) {
    tenant = await prisma.tenant.findUnique({
      where: { id: headerId },
    })
  } else if (subdomain) {
    // 1. Busca exata por subdomínio
    tenant = await prisma.tenant.findUnique({
      where: { subdomain },
    })

    // 2. Fallback: busca case-insensitive por nome da loja ou slug sanitizado se não achar
    if (!tenant) {
      tenant = await prisma.tenant.findFirst({
        where: {
          OR: [
            { subdomain: { equals: subdomain, mode: 'insensitive' } },
            { name: { equals: subdomain, mode: 'insensitive' } },
          ],
        },
      })
    }
  }

  // Only fallback for storefront product detail, order tracking or checkout
  // NEVER fallback on root landing page or general info queries
  if (!tenant && (url.pathname.startsWith('/produto/') || url.pathname.startsWith('/checkout') || url.pathname.startsWith('/pedido/'))) {
    const cookieSubdomain = getCookie(event, 'selected_tenant')
    if (cookieSubdomain) {
      tenant = await prisma.tenant.findUnique({
        where: { subdomain: cookieSubdomain },
      })
    }

    if (!tenant) {
      tenant = await prisma.tenant.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'asc' },
      })
    }
  }

  if (tenant && !tenant.isActive) {
    event.context.tenantSuspended = true
    if (url.pathname.startsWith('/api/store/checkout')) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Esta loja está temporariamente em modo rascunho/manutenção e não está aceitando pedidos no momento.',
      })
    }
  }

  event.context.tenant = tenant
})
