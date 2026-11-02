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
    if (['none', 'saas', 'plataforma', 'home'].includes(String(query.tenant).toLowerCase())) {
      deleteCookie(event, 'selected_tenant')
      event.context.tenant = null
      return
    }
    subdomain = String(query.tenant).toLowerCase().trim()
    setCookie(event, 'selected_tenant', subdomain, { path: '/', maxAge: 60 * 60 * 24 * 30 })
  } else if (headerSubdomain) {
    subdomain = headerSubdomain.toLowerCase().trim()
  } else {
    // Resolve from host (e.g. modaurbana.localhost:3000 or mycustomdomain.com)
    const host = getRequestHost(event)
    const hostParts = host.split('.')
    if (hostParts.length > 1 && !['localhost', '127', 'www'].includes(hostParts[0])) {
      subdomain = hostParts[0].toLowerCase()
    }
  }

  // If no subdomain from host/query, check cookie
  if (!subdomain) {
    const cookieSubdomain = getCookie(event, 'selected_tenant')
    if (cookieSubdomain) {
      subdomain = cookieSubdomain.toLowerCase().trim()
    }
  }

  let tenant = null

  if (headerId) {
    tenant = await prisma.tenant.findUnique({
      where: { id: headerId },
    })
  } else if (subdomain) {
    tenant = await prisma.tenant.findUnique({
      where: { subdomain },
    })
  }

  // Fallback default store for storefront or store APIs if accessed directly
  if (!tenant && (url.pathname.startsWith('/api/store') || url.pathname.startsWith('/produto/') || url.pathname.startsWith('/checkout') || url.pathname.startsWith('/pedido/'))) {
    tenant = await prisma.tenant.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    })
  }

  if (tenant && !tenant.isActive) {
    event.context.tenantSuspended = true
    if (url.pathname.startsWith('/api/store')) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Esta loja está temporariamente suspensa pelo administrador da plataforma.',
      })
    }
  }

  event.context.tenant = tenant
})
