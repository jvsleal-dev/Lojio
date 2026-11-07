import { prisma } from '~/server/utils/prisma'
import { requireAuth, resolveTenantId } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const tenantId = await resolveTenantId(event, user)

  const query = getQuery(event)
  const range = (query.range as string) || '30days'

  let dateFilter = new Date(0)
  const now = new Date()

  if (range === '7days') {
    dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  } else if (range === '30days') {
    dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  } else if (range === '90days') {
    dateFilter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
  }

  const orders = await prisma.order.findMany({
    where: {
      tenantId,
      createdAt: { gte: dateFilter },
    },
    include: {
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  // Calculations
  const totalOrders = orders.length
  const paidOrders = orders.filter(o => o.paymentStatus === 'paid' || o.paymentMethod === 'whatsapp')
  const totalRevenue = paidOrders.reduce((acc, o) => acc + (o.total || 0), 0)
  const averageTicket = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0

  // By Payment Method
  const pixOrders = orders.filter(o => o.paymentMethod === 'pix')
  const pixRevenue = pixOrders.filter(o => o.paymentStatus === 'paid').reduce((acc, o) => acc + (o.total || 0), 0)

  const cardOrders = orders.filter(o => o.paymentMethod === 'credit_card')
  const cardRevenue = cardOrders.reduce((acc, o) => acc + (o.total || 0), 0)

  const whatsappOrders = orders.filter(o => o.paymentMethod === 'whatsapp')
  const whatsappRevenue = whatsappOrders.reduce((acc, o) => acc + (o.total || 0), 0)

  // Top products
  const productSalesMap = new Map<string, { name: string; quantity: number; revenue: number }>()

  for (const order of paidOrders) {
    for (const item of order.items) {
      const key = item.productId || item.productName
      const existing = productSalesMap.get(key) || { name: item.productName, quantity: 0, revenue: 0 }
      existing.quantity += item.quantity
      existing.revenue += item.total
      productSalesMap.set(key, existing)
    }
  }

  const topProducts = Array.from(productSalesMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)

  return {
    metrics: {
      totalRevenue,
      totalOrders,
      paidOrdersCount: paidOrders.length,
      averageTicket,
      byPayment: {
        pix: { count: pixOrders.length, revenue: pixRevenue },
        creditCard: { count: cardOrders.length, revenue: cardRevenue },
        whatsapp: { count: whatsappOrders.length, revenue: whatsappRevenue },
      },
    },
    topProducts,
    orders: orders.map(o => ({
      orderNumber: o.orderNumber,
      createdAt: o.createdAt,
      customerName: o.customerName,
      customerEmail: o.customerEmail,
      customerPhone: o.customerPhone,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      orderStatus: o.orderStatus,
      total: o.total,
      shippingCost: o.shippingCost,
      itemsCount: o.items.length,
    })),
  }
})
