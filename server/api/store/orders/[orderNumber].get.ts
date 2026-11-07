import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const tenant = event.context.tenant
  const orderNumber = getRouterParam(event, 'orderNumber')

  if (!orderNumber) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Número do pedido não informado.',
    })
  }

  if (!tenant) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Loja não encontrada.',
    })
  }

  // O número do pedido é globalmente único, mas a consulta deve permanecer
  // restrita ao tenant resolvido pela requisição para evitar vazamento entre lojas.
  const order = await prisma.order.findFirst({
    where: {
      orderNumber,
      tenantId: tenant.id,
    },
    include: {
      items: true,
      tenant: {
        select: {
          id: true,
          name: true,
          subdomain: true,
          contactWhatsapp: true,
          primaryColor: true,
          accentColor: true,
        },
      },
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
      customerPhone: order.customerPhone,
      customerDocument: order.customerDocument,
      shippingAddress,
      shippingService: order.shippingService,
      shippingCost: order.shippingCost,
      subtotal: order.subtotal,
      discount: order.discount,
      discountAmount: order.discount,
      total: order.total,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      trackingCode: order.trackingCode,
      createdAt: order.createdAt,
      items: order.items.map((it) => ({
        ...it,
        price: it.unitPrice,
      })),
      payment: paymentMetadata,
      store: order.tenant,
    },
  }
})
