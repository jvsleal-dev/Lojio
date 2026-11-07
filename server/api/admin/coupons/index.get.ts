import { prisma } from '~/server/utils/prisma'
import { requireAuth, resolveTenantId } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const tenantId = await resolveTenantId(event, user)

  const coupons = await prisma.coupon.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' }
  })

  return coupons
})

