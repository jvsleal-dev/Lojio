import { prisma } from '../../../utils/prisma'
import { getAuthenticatedUser } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = getAuthenticatedUser(event)
  if (!user.tenantId) {
    throw createError({ statusCode: 400, statusMessage: 'Nenhuma loja associada.' })
  }

  const body = await readBody(event)
  if (!body.name) {
    throw createError({ statusCode: 400, statusMessage: 'O nome da categoria é obrigatório.' })
  }

  const baseSlug = body.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  let slug = baseSlug
  let count = 1
  while (await prisma.category.findFirst({ where: { tenantId: user.tenantId, slug } })) {
    slug = `${baseSlug}-${count}`
    count++
  }

  const category = await prisma.category.create({
    data: {
      tenantId: user.tenantId,
      name: body.name,
      slug,
      imageUrl: body.imageUrl || null,
      isActive: body.isActive ?? true,
    },
  })

  return {
    message: 'Categoria criada com sucesso!',
    category,
  }
})

