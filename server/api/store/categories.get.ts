import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const tenant = event.context.tenant

  if (!tenant) {
    return {
      categories: [],
    }
  }

  const categories = await prisma.category.findMany({
    where: { tenantId: tenant.id, isActive: true },
    include: {
      _count: {
        select: { products: { where: { isActive: true } } },
      },
    },
    orderBy: { name: 'asc' },
  })

  return {
    categories: categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      imageUrl: cat.imageUrl,
      productsCount: cat._count.products,
    })),
  }
})

