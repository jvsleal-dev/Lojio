import { prisma } from '../../utils/prisma'
import { getMasterAdminUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check master admin permission
  getMasterAdminUser(event)

  // Aggregate metrics
  const totalStores = await prisma.tenant.count()
  const activeStores = await prisma.tenant.count({ where: { isActive: true } })
  const suspendedStores = totalStores - activeStores

  const totalProducts = await prisma.product.count()
  const totalOrders = await prisma.order.count()

  const orders = await prisma.order.findMany({
    select: {
      total: true,
      paymentStatus: true,
      createdAt: true,
    }
  })

  const totalGMV = orders.reduce((acc, order) => acc + (order.total || 0), 0)
  const paidOrders = orders.filter(o => o.paymentStatus === 'paid')
  const paidGMV = paidOrders.reduce((acc, o) => acc + (o.total || 0), 0)

  // Stores by plan
  const starterCount = await prisma.tenant.count({ where: { plan: 'STARTER' } })
  const proCount = await prisma.tenant.count({ where: { plan: 'PRO' } })
  const enterpriseCount = await prisma.tenant.count({ where: { plan: 'ENTERPRISE' } })

  // Recent stores
  const recentStores = await prisma.tenant.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
        },
        take: 1,
      },
      _count: {
        select: {
          products: true,
          orders: true,
        }
      }
    }
  })

  // Recent orders across all stores
  const recentOrders = await prisma.order.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          subdomain: true,
        }
      }
    }
  })

  return {
    metrics: {
      totalStores,
      activeStores,
      suspendedStores,
      totalProducts,
      totalOrders,
      totalGMV,
      paidGMV,
      paidOrdersCount: paidOrders.length,
      averageTicket: paidOrders.length > 0 ? (paidGMV / paidOrders.length) : 0,
      plans: {
        starter: starterCount,
        pro: proCount,
        enterprise: enterpriseCount,
      }
    },
    recentStores: recentStores.map(store => ({
      id: store.id,
      name: store.name,
      subdomain: store.subdomain,
      plan: store.plan,
      isActive: store.isActive,
      createdAt: store.createdAt,
      productsCount: store._count.products,
      ordersCount: store._count.orders,
      owner: store.users[0] || null,
    })),
    recentOrders,
  }
})

