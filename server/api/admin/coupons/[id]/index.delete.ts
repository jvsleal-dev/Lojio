import { prisma } from '~/server/utils/prisma'
import { requireAuth, resolveTenantId } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const tenantId = await resolveTenantId(event, user)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'ID do cupom obrigatório' })
  }

  const coupon = await prisma.coupon.findFirst({
    where: { id, tenantId }
  })

  if (!coupon) {
    throw createError({ statusCode: 404, message: 'Cupom não encontrado' })
  }

  await prisma.coupon.delete({
    where: { id }
  })

  return { success: true }
})

