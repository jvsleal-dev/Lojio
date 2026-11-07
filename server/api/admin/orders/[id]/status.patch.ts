import { prisma } from '~/server/utils/prisma'
import { requireAuth, resolveTenantId } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const tenantId = await resolveTenantId(event, user)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID do pedido não informado.' })
  }

  const existingOrder = await prisma.order.findFirst({
    where: {
      id,
      tenantId,
    },
  })

  if (!existingOrder) {
    throw createError({ statusCode: 404, statusMessage: 'Pedido não encontrado.' })
  }

  const body = await readBody(event)

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: {
      orderStatus: body.orderStatus,
      paymentStatus: body.paymentStatus,
      trackingCode: body.trackingCode,
    },
    include: {
      items: true,
    },
  })

  return {
    message: 'Status do pedido atualizado!',
    order: updatedOrder,
  }
})
