import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  const stores = await prisma.tenant.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      subdomain: true,
      description: true,
      primaryColor: true,
      accentColor: true,
      plan: true,
      _count: {
        select: {
          products: true,
          categories: true,
        }
      }
    },
    orderBy: { createdAt: 'asc' }
  })

  return {
    stores: stores.map(s => ({
      ...s,
      productsCount: s._count.products,
      categoriesCount: s._count.categories,
    }))
  }
})

