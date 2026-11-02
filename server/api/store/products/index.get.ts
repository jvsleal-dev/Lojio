import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const tenant = event.context.tenant

  if (!tenant) {
    return {
      products: [],
      total: 0,
    }
  }

  const query = getQuery(event)
  const categorySlug = query.category ? String(query.category) : undefined
  const search = query.q ? String(query.q) : undefined
  const sort = query.sort ? String(query.sort) : 'latest'
  const featured = query.featured === 'true'

  const where: any = {
    tenantId: tenant.id,
    isActive: true,
  }

  if (categorySlug) {
    where.category = { slug: categorySlug }
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ]
  }

  if (featured) {
    where.isFeatured = true
  }

  let orderBy: any = { createdAt: 'desc' }
  if (sort === 'price_asc') orderBy = { price: 'asc' }
  if (sort === 'price_desc') orderBy = { price: 'desc' }
  if (sort === 'name_asc') orderBy = { name: 'asc' }

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      category: { select: { id: true, name: true, slug: true } },
      variants: {
        select: {
          id: true,
          name: true,
          sku: true,
          price: true,
          stockQuantity: true,
          attributes: true,
        },
      },
    },
  })

  return {
    products: products.map((p) => {
      let parsedImages: string[] = []
      try {
        parsedImages = p.images ? JSON.parse(p.images) : []
      } catch {
        parsedImages = []
      }

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        stockQuantity: p.stockQuantity,
        images: parsedImages,
        coverImage: parsedImages[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
        hasVariants: p.hasVariants,
        isFeatured: p.isFeatured,
        category: p.category,
        variants: p.variants.map((v) => ({
          id: v.id,
          name: v.name,
          sku: v.sku,
          price: v.price,
          stockQuantity: v.stockQuantity,
          attributes: v.attributes ? JSON.parse(v.attributes) : {},
        })),
      }
    }),
  }
})

