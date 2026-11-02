import { prisma } from '../../utils/prisma'
import { getAuthenticatedUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const authUser = getAuthenticatedUser(event)

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: { tenant: true },
  })

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Usuário não encontrado.',
    })
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    tenant: user.tenant,
  }
})

