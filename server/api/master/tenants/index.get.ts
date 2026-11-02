import { prisma } from '~/server/utils/prisma'
import { getMasterAdminUser } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  getMasterAdminUser(event)

  const query = getQuery(event)
  const search = query.search ? String(query.search).trim() : ''
  const status = query.status ? String(query.status) : '' // 'active', 'suspended', or ''
  const plan = query.plan ? String(query.plan) : ''

  const whereClause: any = {}

  if (search) {
    whereClause.OR = [
      { name: { contains: search } },
      { subdomain: { contains: search } },
      { contactEmail: { contains: search } },
      {
        users: {
          some: {
            OR: [
              { name: { contains: search } },
              { email: { contains: search } }
            ]
          }
        }
      }
    ]
  }

  if (status === 'active') {
    whereClause.isActive = true
  } else if (status === 'suspended') {
    whereClause.isActive = false
  }

  if (plan && ['STARTER', 'PRO', 'ENTERPRISE'].includes(plan.toUpperCase())) {
    whereClause.plan = plan.toUpperCase()
  }

  const tenants = await prisma.tenant.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
        take: 1,
      },
      orders: {
        select: {
          total: true,
          paymentStatus: true,
        }
      },
      _count: {
        select: {
          products: true,
          orders: true,
          categories: true,
        }
      }
    }
  })

  const formatted = tenants.map(t => {
    const totalSales = t.orders.reduce((sum, o) => sum + (o.total || 0), 0)
    const paidSales = t.orders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + (o.total || 0), 0)

    return {
      id: t.id,
      name: t.name,
      subdomain: t.subdomain,
      plan: t.plan,
      isActive: t.isActive,
      contactEmail: t.contactEmail,
      contactWhatsapp: t.contactWhatsapp,
      primaryColor: t.primaryColor,
      accentColor: t.accentColor,
      createdAt: t.createdAt,
      productsCount: t._count.products,
      categoriesCount: t._count.categories,
      ordersCount: t._count.orders,
      totalSales,
      paidSales,
      owner: t.users[0] || null,
    }
  })

  return {
    tenants: formatted,
    total: formatted.length,
  }
})

