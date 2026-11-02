import { prisma } from '../../utils/prisma'
import { hashPassword, generateToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.name || !body.email || !body.password || !body.storeName || !body.subdomain) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Todos os campos são obrigatórios: nome, e-mail, senha, nome da loja e subdomínio.',
    })
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: body.email.toLowerCase() },
  })

  if (existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Este e-mail já está em uso.',
    })
  }

  const cleanSubdomain = body.subdomain.toLowerCase().trim().replace(/[^a-z0-9-]/g, '')
  if (cleanSubdomain.length < 3) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Subdomínio inválido. Deve ter pelo menos 3 caracteres alfanuméricos.',
    })
  }

  const existingTenant = await prisma.tenant.findUnique({
    where: { subdomain: cleanSubdomain },
  })

  if (existingTenant) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Este subdomínio já está sendo utilizado por outra loja.',
    })
  }

  const hashedPassword = await hashPassword(body.password)

  // Transaction: Create Tenant + User + Default Category
  const result = await prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: {
        name: body.storeName,
        subdomain: cleanSubdomain,
        contactEmail: body.email,
        primaryColor: '#0f172a',
        accentColor: '#2563eb',
        announcementBar: '🎉 Bem-vindo(a) à nossa loja online!',
        showAnnouncement: true,
      },
    })

    const user = await tx.user.create({
      data: {
        tenantId: tenant.id,
        name: body.name,
        email: body.email.toLowerCase(),
        password: hashedPassword,
        role: 'MERCHANT',
      },
    })

    await tx.category.create({
      data: {
        tenantId: tenant.id,
        name: 'Destaques',
        slug: 'destaques',
        isActive: true,
      },
    })

    return { user, tenant }
  })

  const token = generateToken({
    id: result.user.id,
    email: result.user.email,
    name: result.user.name,
    tenantId: result.tenant.id,
    role: result.user.role,
  })

  return {
    message: 'Conta e loja criadas com sucesso!',
    token,
    user: {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
    },
    tenant: result.tenant,
  }
})

