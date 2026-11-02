import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  if (!user.tenantId && user.role !== 'SUPERADMIN') {
    throw createError({ statusCode: 403, message: 'Acesso negado' })
  }

  const coupons = await prisma.coupon.findMany({
    where: { tenantId: user.tenantId! },
    orderBy: { createdAt: 'desc' }
  })

  return coupons
})

