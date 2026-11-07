import { prisma } from '../../../utils/prisma'
import { getAuthenticatedUser, resolveTenantId } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = getAuthenticatedUser(event)
  const tenantId = await resolveTenantId(event, user)

  const body = await readBody(event)
  if (!body.name) {
    throw createError({ statusCode: 400, statusMessage: 'O nome da categoria é obrigatório.' })
  }

  const baseSlug = body.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  let slug = baseSlug
  let count = 1
  while (await prisma.category.findFirst({ where: { tenantId, slug } })) {
    slug = `${baseSlug}-${count}`
    count++
  }

  const category = await prisma.category.create({
    data: {
      tenantId,
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

