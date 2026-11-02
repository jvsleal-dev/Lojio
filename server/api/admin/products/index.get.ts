import { prisma } from '~/server/utils/prisma'
import { getAuthenticatedUser } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = getAuthenticatedUser(event)
  if (!user.tenantId) {
    throw createError({ statusCode: 400, statusMessage: 'Nenhuma loja associada.' })
  }

  const query = getQuery(event)
  const search = query.search ? String(query.search) : undefined

  const where: any = { tenantId: user.tenantId }
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { sku: { contains: search } },
    ]
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      category: { select: { id: true, name: true } },
      variants: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return {
    products: products.map((p) => {
      let parsedImages = []
      try {
        parsedImages = p.images ? JSON.parse(p.images) : []
      } catch {}

      return {
        ...p,
        images: parsedImages,
        coverImage: parsedImages[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
      }
    }),
  }
})

