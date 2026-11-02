import { prisma } from '~/server/utils/prisma'
import { getMasterAdminUser, hashPassword } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  getMasterAdminUser(event)
  const body = await readBody(event)

  if (!body.name || !body.subdomain || !body.ownerEmail || !body.ownerPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Preencha todos os campos obrigatórios (nome da loja, subdomínio, e-mail e senha do lojista).',
    })
  }

  // Format and validate subdomain
  const cleanSubdomain = body.subdomain
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '')

  if (cleanSubdomain.length < 3) {
    throw createError({
      statusCode: 400,
      statusMessage: 'O subdomínio deve conter pelo menos 3 caracteres alfanuméricos.',
    })
  }

  // Check if subdomain exists
  const existingSubdomain = await prisma.tenant.findUnique({
    where: { subdomain: cleanSubdomain },
  })

  if (existingSubdomain) {
    throw createError({
      statusCode: 400,
      statusMessage: `O subdomínio "${cleanSubdomain}" já está em uso por outro cliente.`,
    })
  }

  // Check if email already in use
  const existingUser = await prisma.user.findUnique({
    where: { email: body.ownerEmail.toLowerCase().trim() },
  })

  if (existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: `O e-mail "${body.ownerEmail}" já possui cadastro na plataforma.`,
    })
  }

  // Hash password
  const hashedPassword = await hashPassword(body.ownerPassword)

  // Create tenant and merchant user in a transaction
  const result = await prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: {
        name: body.name.trim(),
        subdomain: cleanSubdomain,
        description: body.description || `Loja oficial ${body.name}`,
        contactEmail: body.ownerEmail.toLowerCase().trim(),
        contactWhatsapp: body.contactWhatsapp || null,
        plan: body.plan || 'PRO',
        primaryColor: body.primaryColor || '#0f172a',
        accentColor: body.accentColor || '#2563eb',
        announcementBar: `🎉 Bem-vindo(a) à nossa loja online! Aproveite nossos lançamentos.`,
        isActive: true,
      }
    })

    const user = await tx.user.create({
      data: {
        tenantId: tenant.id,
        name: body.ownerName || body.name,
        email: body.ownerEmail.toLowerCase().trim(),
        password: hashedPassword,
        role: 'MERCHANT',
      }
    })

    // Seed default starter category for convenience
    await tx.category.create({
      data: {
        tenantId: tenant.id,
        name: 'Destaques',
        slug: 'destaques',
        imageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&auto=format&fit=crop&q=80',
      }
    })

    return { tenant, user }
  })

  return {
    message: 'Loja de cliente criada com sucesso!',
    tenant: result.tenant,
    owner: {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
    }
  }
})

