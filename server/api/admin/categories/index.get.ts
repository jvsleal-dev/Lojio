import { prisma } from '../../../utils/prisma'
import { getAuthenticatedUser } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = getAuthenticatedUser(event)
  if (!user.tenantId) {
    throw createError({ statusCode: 400, statusMessage: 'Nenhuma loja associada.' })
  }

  const categories = await prisma.category.findMany({
    where: { tenantId: user.tenantId },
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return { categories }
})

