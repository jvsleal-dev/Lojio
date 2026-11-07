export default defineEventHandler((event) => {
  const tenant = event.context.tenant

  if (!tenant) {
    return {
      store: null,
      isPlatform: true,
    }
  }

  let themeConfig: any = {}
  const rawTheme = tenant.themeConfig || tenant.melhorEnvioToken
  if (rawTheme) {
    try {
      themeConfig = JSON.parse(rawTheme)
    } catch {}
  }

  return {
    isPlatform: false,
    store: {
      id: tenant.id,
      name: tenant.name,
      subdomain: tenant.subdomain,
      customDomain: tenant.customDomain,
      logoUrl: tenant.logoUrl,
      bannerUrl: tenant.bannerUrl,
      description: tenant.description,
      contactEmail: tenant.contactEmail,
      contactWhatsapp: tenant.contactWhatsapp,
      primaryColor: tenant.primaryColor || '#0f172a',
      accentColor: tenant.accentColor || '#2563eb',
      announcementBar: tenant.announcementBar,
      showAnnouncement: tenant.showAnnouncement,
      isActive: tenant.isActive ?? true,
      isPublished: tenant.isActive ?? true,
      themeConfig,
    },
  }
})
