export default defineEventHandler((event) => {
  const tenant = event.context.tenant

  if (!tenant) {
    return {
      store: null,
      isPlatform: true,
    }
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
    },
  }
})
