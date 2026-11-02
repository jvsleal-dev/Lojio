import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  let tenantId = user.tenantId
  if (!tenantId && (user.role === 'SUPERADMIN' || user.role === 'MASTER')) {
    const firstTenant = await prisma.tenant.findFirst({ where: { isActive: true }, orderBy: { createdAt: 'asc' } })
    tenantId = firstTenant?.id || null
  }

  if (!tenantId) {
    throw createError({ statusCode: 400, statusMessage: 'Nenhuma loja associada.' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID do produto não informado.' })
  }

  const product = await prisma.product.findFirst({
    where: { id, tenantId },
  })

  if (!product) {
    throw createError({ statusCode: 404, statusMessage: 'Produto não encontrado.' })
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      isActive: !product.isActive,
    },
  })

  return {
    message: updated.isActive ? 'Produto ativado na loja!' : 'Produto pausado da loja.',
    product: updated,
  }
})
