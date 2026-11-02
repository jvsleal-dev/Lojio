import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const tenant = event.context.tenant
  if (!tenant) {
    throw createError({ statusCode: 400, message: 'Loja não identificada' })
  }

  const body = await readBody(event)
  const { code, cartSubtotal } = body

  if (!code || typeof code !== 'string') {
    throw createError({ statusCode: 400, message: 'Código do cupom é obrigatório' })
  }

  const normalizedCode = code.trim().toUpperCase()

  const coupon = await prisma.coupon.findFirst({
    where: {
      tenantId: tenant.id,
      code: normalizedCode,
      isActive: true,
    }
  })

  if (!coupon) {
    throw createError({ statusCode: 404, message: 'Cupom inválido ou expirado' })
  }

  // Verificar validade de data
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    throw createError({ statusCode: 400, message: 'Este cupom já expirou' })
  }

  // Verificar limite de usos
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    throw createError({ statusCode: 400, message: 'Limite de utilização deste cupom esgotado' })
  }

  // Verificar valor mínimo
  const subtotal = Number(cartSubtotal || 0)
  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    throw createError({
      statusCode: 400,
      message: `Este cupom exige compra mínima de R$ ${coupon.minOrderValue.toFixed(2)}`
    })
  }

  // Calcular desconto
  let discountAmount = 0
  if (coupon.discountType === 'PERCENTAGE') {
    discountAmount = (subtotal * coupon.discountValue) / 100
  } else {
    discountAmount = Math.min(coupon.discountValue, subtotal)
  }

  return {
    valid: true,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
    },
    discountAmount: Number(discountAmount.toFixed(2))
  }
})

