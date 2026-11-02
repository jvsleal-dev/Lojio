import { prisma } from '../../utils/prisma'
import { getAuthenticatedUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = getAuthenticatedUser(event)
  let tenantId = user.tenantId
  if (!tenantId && (user.role === 'SUPERADMIN' || user.role === 'MASTER')) {
    const firstTenant = await prisma.tenant.findFirst({ where: { isActive: true }, orderBy: { createdAt: 'asc' } })
    tenantId = firstTenant?.id || null
  }

  if (!tenantId) {
    throw createError({ statusCode: 400, statusMessage: 'Nenhuma loja associada.' })
  }

  const body = await readBody(event)

  const updatedTenant = await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      name: body.name,
      description: body.description,
      logoUrl: body.logoUrl,
      bannerUrl: body.bannerUrl,
      contactEmail: body.contactEmail,
      contactWhatsapp: body.contactWhatsapp,
      primaryColor: body.primaryColor,
      accentColor: body.accentColor,
      announcementBar: body.announcementBar,
      showAnnouncement: body.showAnnouncement,
      originZipcode: body.originZipcode,
      mpAccessToken: body.mpAccessToken,
      mpPublicKey: body.mpPublicKey,
      melhorEnvioToken: body.themeConfig ? JSON.stringify(body.themeConfig) : (body.melhorEnvioToken !== undefined ? body.melhorEnvioToken : undefined),
      isActive: body.isActive !== undefined ? body.isActive : undefined,
    },
  })

  return {
    message: 'Configurações da loja salvas com sucesso!',
    tenant: updatedTenant,
  }
})
