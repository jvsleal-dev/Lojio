import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  if (!user.tenantId && user.role !== 'SUPERADMIN') {
    throw createError({ statusCode: 403, message: 'Acesso negado' })
  }

  const body = await readBody(event)
  const { code, discountType, discountValue, minOrderValue, maxUses, expiresAt } = body

  if (!code || !discountType || discountValue === undefined) {
    throw createError({ statusCode: 400, message: 'Código, tipo e valor do desconto são obrigatórios' })
  }

  const normalizedCode = String(code).trim().toUpperCase()

  // Verificar duplicidade de cupom para o tenant
  const existing = await prisma.coupon.findFirst({
    where: {
      tenantId: user.tenantId!,
      code: normalizedCode
    }
  })

  if (existing) {
    throw createError({ statusCode: 400, message: 'Já existe um cupom cadastrado com este código' })
  }

  const coupon = await prisma.coupon.create({
    data: {
      tenantId: user.tenantId!,
      code: normalizedCode,
      discountType: discountType === 'FIXED' ? 'FIXED' : 'PERCENTAGE',
      discountValue: Number(discountValue),
      minOrderValue: minOrderValue ? Number(minOrderValue) : null,
      maxUses: maxUses ? parseInt(maxUses) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isActive: true,
    }
  })

  return coupon
})

