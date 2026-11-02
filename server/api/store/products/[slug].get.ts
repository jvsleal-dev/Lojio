import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const tenant = event.context.tenant
  const slug = getRouterParam(event, 'slug')

  if (!tenant) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Loja não encontrada.',
    })
  }

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Produto não informado.',
    })
  }

  const product = await prisma.product.findFirst({
    where: {
      tenantId: tenant.id,
      slug,
      isActive: true,
    },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      variants: {
        select: {
          id: true,
          name: true,
          sku: true,
          price: true,
          compareAtPrice: true,
          stockQuantity: true,
          attributes: true,
        },
      },
    },
  })

  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Produto não encontrado.',
    })
  }

  let parsedImages: string[] = []
  try {
    parsedImages = product.images ? JSON.parse(product.images) : []
  } catch {
    parsedImages = []
  }

  return {
    product: {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      sku: product.sku,
      stockQuantity: product.stockQuantity,
      weightGrams: product.weightGrams,
      images: parsedImages,
      hasVariants: product.hasVariants,
      isFeatured: product.isFeatured,
      category: product.category,
      variants: product.variants.map((v) => ({
        id: v.id,
        name: v.name,
        sku: v.sku,
        price: v.price,
        compareAtPrice: v.compareAtPrice,
        stockQuantity: v.stockQuantity,
        attributes: v.attributes ? JSON.parse(v.attributes) : {},
      })),
    },
  }
})

