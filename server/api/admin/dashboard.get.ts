import { prisma } from '../../utils/prisma'
import { getAuthenticatedUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = getAuthenticatedUser(event)
  let tenantId = user.tenantId

  if (!tenantId && (user.role === 'SUPERADMIN' || user.role === 'MASTER')) {
    const firstTenant = await prisma.tenant.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' }
    })
    tenantId = firstTenant?.id || null
  }

  if (!tenantId) {
    throw createError({ statusCode: 400, statusMessage: 'Nenhuma loja associada a esta conta.' })
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: {
      id: true,
      name: true,
      subdomain: true,
      logoUrl: true,
      bannerUrl: true,
      primaryColor: true,
      accentColor: true,
      plan: true,
      isActive: true,
    }
  })

  // Date boundaries
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  // Orders
  const allOrders = await prisma.order.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  })

  const totalOrders = allOrders.length
  const paidOrders = allOrders.filter(o => o.paymentStatus === 'paid')
  const pendingOrders = allOrders.filter(o => o.paymentStatus === 'pending')

  const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0)
  const pendingRevenue = pendingOrders.reduce((sum, o) => sum + (o.total || 0), 0)
  const averageTicket = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0

  const todayRevenue = paidOrders
    .filter(o => new Date(o.createdAt) >= startOfToday)
    .reduce((sum, o) => sum + (o.total || 0), 0)

  const monthRevenue = paidOrders
    .filter(o => new Date(o.createdAt) >= startOfMonth)
    .reduce((sum, o) => sum + (o.total || 0), 0)

  // Products & Low stock alert
  const totalProducts = await prisma.product.count({ where: { tenantId } })
  const lowStockProducts = await prisma.product.findMany({
    where: {
      tenantId,
      manageStock: true,
      stockQuantity: { lte: 10 },
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      sku: true,
      price: true,
      stockQuantity: true,
      images: true,
    },
    take: 5,
  })

  // Sales by Day (Last 7 days)
  const daysMap: Record<string, { date: string, label: string, total: number, ordersCount: number }> = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const key = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })
    daysMap[key] = { date: key, label, total: 0, ordersCount: 0 }
  }

  paidOrders.forEach(o => {
    const key = new Date(o.createdAt).toISOString().slice(0, 10)
    if (daysMap[key]) {
      daysMap[key].total += o.total || 0
      daysMap[key].ordersCount += 1
    }
  })

  const salesHistory = Object.values(daysMap)

  // Recent 6 orders
  const recentOrders = allOrders.slice(0, 6).map(o => ({
    id: o.id,
    orderNumber: o.orderNumber,
    customerName: o.customerName,
    customerEmail: o.customerEmail,
    customerPhone: o.customerPhone,
    shippingAddress: o.shippingAddress,
    shippingService: o.shippingService,
    shippingCost: o.shippingCost,
    subtotal: o.subtotal,
    total: o.total,
    paymentMethod: o.paymentMethod,
    paymentStatus: o.paymentStatus,
    orderStatus: o.orderStatus,
    trackingCode: o.trackingCode,
    createdAt: o.createdAt,
    itemsCount: o.items.length,
    items: o.items,
  }))

  return {
    tenant,
    metrics: {
      totalRevenue,
      todayRevenue,
      monthRevenue,
      averageTicket,
      totalOrders,
      paidOrders: paidOrders.length,
      pendingOrders: pendingOrders.length,
      pendingRevenue,
      totalProducts,
      lowStockCount: lowStockProducts.length,
    },
    lowStockProducts: lowStockProducts.map(p => ({
      ...p,
      coverImage: p.images ? JSON.parse(p.images)[0] : null,
    })),
    salesHistory,
    recentOrders,
  }
})
