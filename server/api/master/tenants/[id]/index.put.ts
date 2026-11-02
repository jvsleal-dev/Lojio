import { prisma } from '~/server/utils/prisma'
import { getMasterAdminUser } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  getMasterAdminUser(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

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

  const updateData: any = {}
  if (body.name) updateData.name = body.name
  if (body.plan) updateData.plan = body.plan
  if (body.contactEmail) updateData.contactEmail = body.contactEmail
  if (body.contactWhatsapp !== undefined) updateData.contactWhatsapp = body.contactWhatsapp
  if (body.primaryColor) updateData.primaryColor = body.primaryColor
  if (body.accentColor) updateData.accentColor = body.accentColor
  if (typeof body.isActive === 'boolean') updateData.isActive = body.isActive

  const updated = await prisma.tenant.update({
    where: { id },
    data: updateData,
  })

  return {
    message: 'Loja atualizada com sucesso!',
    tenant: updated,
  }
})

