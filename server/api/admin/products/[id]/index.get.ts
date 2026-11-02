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

  const product = await prisma.product.findFirst({
    where: {
      id,
      tenantId: user.tenantId,
    },
    include: {
      category: true,
      variants: true,
    },
  })

  if (!product) {
    throw createError({ statusCode: 404, statusMessage: 'Produto não encontrado.' })
  }

  let images: string[] = []
  try {
    images = product.images ? JSON.parse(product.images) : []
  } catch {
    images = []
  }

  return {
    product: {
      ...product,
      parsedImages: images,
    },
  }
})
