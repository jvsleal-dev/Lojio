import { prisma } from '~/server/utils/prisma'
import { getAuthenticatedUser, resolveTenantId } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = getAuthenticatedUser(event)
  const tenantId = await resolveTenantId(event, user)

  const body = await readBody(event)
  if (!body.name || body.price === undefined || body.price === null) {
    throw createError({ statusCode: 400, statusMessage: 'Nome e preço do produto são obrigatórios.' })
  }

  const baseSlug = body.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  let slug = baseSlug
  let count = 1
  while (await prisma.product.findFirst({ where: { tenantId, slug } })) {
    slug = `${baseSlug}-${count}`
    count++
  }

  const product = await prisma.$transaction(async (tx) => {
    const newProduct = await tx.product.create({
      data: {
        tenantId,
        categoryId: body.categoryId || null,
        name: body.name,
        slug,
        description: body.description || '',
        price: Number(body.price),
        compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : null,
        costPrice: body.costPrice ? Number(body.costPrice) : null,
        sku: body.sku || null,
        stockQuantity: Number(body.stockQuantity || 0),
        weightGrams: Number(body.weightGrams || 300),
        images: JSON.stringify(body.images || []),
        hasVariants: Boolean(body.variants && body.variants.length > 0),
        isActive: body.isActive ?? true,
        isFeatured: body.isFeatured ?? false,
      },
    })

    if (body.variants && Array.isArray(body.variants)) {
      for (const v of body.variants) {
        await tx.productVariant.create({
          data: {
            productId: newProduct.id,
            name: v.name,
            sku: v.sku || null,
            price: Number(v.price || body.price),
            compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
            stockQuantity: Number(v.stockQuantity || 0),
            attributes: JSON.stringify(v.attributes || {}),
          },
        })
      }
    }

    return newProduct
  })

  return {
    message: 'Produto cadastrado com sucesso!',
    product,
  }
})

