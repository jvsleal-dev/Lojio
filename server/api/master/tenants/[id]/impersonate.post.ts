import { prisma } from '~/server/utils/prisma'
import { getMasterAdminUser, generateToken } from '~/server/utils/auth'

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
    include: {
      users: {
        take: 1,
      }
    }
  })

  if (!tenant) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Loja não encontrada.',
    })
  }

  const merchantUser = tenant.users[0]
  if (!merchantUser) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Nenhum lojista cadastrado para esta loja.',
    })
  }

  const token = generateToken({
    id: merchantUser.id,
    email: merchantUser.email,
    name: merchantUser.name,
    tenantId: tenant.id,
    role: merchantUser.role,
  })

  return {
    message: `Acesso gerado com sucesso para a loja "${tenant.name}"!`,
    token,
    user: {
      id: merchantUser.id,
      name: merchantUser.name,
      email: merchantUser.email,
      role: merchantUser.role,
    },
    tenant,
  }
})

