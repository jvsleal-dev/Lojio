import { prisma } from '../../utils/prisma'
import { getAuthenticatedUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = getAuthenticatedUser(event)
  let tenantId = user.tenantId

  if (!tenantId && (user.role === 'SUPERADMIN' || user.role === 'MASTER')) {
    const firstTenant = await prisma.tenant.findFirst({ orderBy: { createdAt: 'asc' } })
    tenantId = firstTenant?.id || null
  }

  if (!tenantId) {
    throw createError({ statusCode: 400, statusMessage: 'Nenhuma loja associada a este usuário.' })
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
  })

  if (!tenant) {
    throw createError({ statusCode: 404, statusMessage: 'Loja não encontrada.' })
  }

  const body = await readBody(event).catch(() => ({}))
  const newStatus = typeof body?.publish === 'boolean' ? body.publish : !tenant.isActive

  const updatedTenant = await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      isActive: newStatus,
    },
  })

  return {
    success: true,
    isPublished: updatedTenant.isActive,
    tenant: updatedTenant,
    message: updatedTenant.isActive
      ? '🎉 Loja publicada com sucesso! Sua vitrine está online para clientes.'
      : 'Loja pausada. Ela está agora em modo rascunho (privada).',
  }
})

