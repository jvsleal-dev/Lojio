import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'ID do cupom obrigatório' })
  }

  const coupon = await prisma.coupon.findFirst({
    where: { id, tenantId: user.tenantId! }
  })

  if (!coupon) {
    throw createError({ statusCode: 404, message: 'Cupom não encontrado' })
  }

  const updated = await prisma.coupon.update({
    where: { id },
    data: { isActive: !coupon.isActive }
  })

  return { success: true, isActive: updated.isActive }
})

