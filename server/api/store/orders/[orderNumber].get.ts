import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const tenant = event.context.tenant
  const orderNumber = getRouterParam(event, 'orderNumber')

  if (!tenant) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Loja não encontrada.',
    })
  }

  const order = await prisma.order.findFirst({
    where: {
      tenantId: tenant.id,
      orderNumber,
    },
    include: {
      items: true,
    },
  })

  if (!order) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Pedido não encontrado.',
    })
  }

  let shippingAddress = null
  let paymentMetadata = null
  try {
    shippingAddress = order.shippingAddress ? JSON.parse(order.shippingAddress) : null
    paymentMetadata = order.paymentMetadata ? JSON.parse(order.paymentMetadata) : null
  } catch {}

  return {
    order: {
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      shippingAddress,
      shippingService: order.shippingService,
      shippingCost: order.shippingCost,
      subtotal: order.subtotal,
      total: order.total,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      trackingCode: order.trackingCode,
      createdAt: order.createdAt,
      items: order.items,
      payment: paymentMetadata,
    },
  }
})

