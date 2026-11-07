import { prisma } from '../../../utils/prisma'
import { getAuthenticatedUser, resolveTenantId } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = getAuthenticatedUser(event)
  const tenantId = await resolveTenantId(event, user)

  const categories = await prisma.category.findMany({
    where: { tenantId },
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return { categories }
})

