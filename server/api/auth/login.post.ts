import { prisma } from '../../utils/prisma'
import { comparePassword, generateToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Informe seu e-mail e senha.',
    })
  }

  const user = await prisma.user.findUnique({
    where: { email: body.email.toLowerCase() },
    include: { tenant: true },
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'E-mail ou senha incorretos.',
    })
  }

  const validPassword = await comparePassword(body.password, user.password)
  if (!validPassword) {
    throw createError({
      statusCode: 401,
      statusMessage: 'E-mail ou senha incorretos.',
    })
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    name: user.name,
    tenantId: user.tenantId,
    role: user.role,
  })

  return {
    message: 'Login realizado com sucesso.',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    tenant: user.tenant,
  }
})

