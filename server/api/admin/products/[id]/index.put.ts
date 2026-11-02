import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  if (!user.tenantId) {
    throw createError({ statusCode: 400, statusMessage: 'Nenhuma loja associada.' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID do produto não informado.' })
  }

  const existing = await prisma.product.findFirst({
    where: { id, tenantId: user.tenantId },
  })

  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Produto não encontrado.' })
  }

  const body = await readBody(event)
  if (!body.name || body.price === undefined || body.price === null) {
    throw createError({ statusCode: 400, statusMessage: 'Nome e preço do produto são obrigatórios.' })
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      categoryId: body.categoryId || null,
      name: body.name,
      description: body.description || '',
      price: Number(body.price),
      compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : null,
      costPrice: body.costPrice ? Number(body.costPrice) : null,
      sku: body.sku || null,
      stockQuantity: Number(body.stockQuantity || 0),
      weightGrams: Number(body.weightGrams || 300),
      images: JSON.stringify(body.images || []),
      isActive: body.isActive ?? true,
      isFeatured: body.isFeatured ?? false,
    },
  })

  return {
    message: 'Produto atualizado com sucesso!',
    product: updatedProduct,
  }
})
