import { prisma } from '../../../utils/prisma'
import { getAuthenticatedUser } from '../../../utils/auth'

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

  const query = getQuery(event)
  const status = query.status ? String(query.status) : undefined
  const paymentStatus = query.paymentStatus ? String(query.paymentStatus) : undefined
  const search = query.search ? String(query.search).trim() : ''

  const where: any = { tenantId }

  if (status && status !== 'all') {
    where.orderStatus = status
  }

  if (paymentStatus && paymentStatus !== 'all') {
    where.paymentStatus = paymentStatus
  }

  if (search) {
    where.OR = [
      { orderNumber: { contains: search } },
      { customerName: { contains: search } },
      { customerEmail: { contains: search } },
      { customerDocument: { contains: search } },
      { trackingCode: { contains: search } },
    ]
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return { orders }
})
