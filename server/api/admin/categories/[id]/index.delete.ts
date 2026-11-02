import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'ID da categoria obrigatório' })
  }

  const category = await prisma.category.findFirst({
    where: { id, tenantId: user.tenantId! }
  })

  if (!category) {
    throw createError({ statusCode: 404, message: 'Categoria não encontrada' })
  }

  await prisma.category.delete({
    where: { id }
  })

  return { success: true }
})

