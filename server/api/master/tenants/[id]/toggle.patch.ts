import { prisma } from '~/server/utils/prisma'
import { getMasterAdminUser } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  getMasterAdminUser(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID da loja não informado.',
    })
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id },
  })

  if (!tenant) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Loja não encontrada.',
    })
  }

  const updated = await prisma.tenant.update({
    where: { id },
    data: {
      isActive: !tenant.isActive,
    }
  })

  return {
    message: updated.isActive
      ? `A loja "${updated.name}" foi ativada com sucesso!`
      : `A loja "${updated.name}" foi suspensa.`,
    tenant: updated,
  }
})

