import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const tenant = event.context.tenant

  if (!tenant) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Loja não encontrada.',
    })
  }

  const body = await readBody(event)

  if (!body.customerName || !body.customerEmail || !body.customerPhone || !body.customerDocument) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Informe os dados do comprador: nome, e-mail, telefone e CPF.',
    })
  }

  if (!body.shippingAddress || !body.shippingAddress.zipcode) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Endereço de entrega incompleto.',
    })
  }

  if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'O carrinho está vazio.',
    })
  }

  const orderNumber = `ORD-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

  // Execute database transaction: create order, create order items, decrement stock
  const order = await prisma.$transaction(async (tx) => {
    let subtotal = 0
    const itemsToCreate = []

    for (const item of body.items) {
      const quantity = Math.floor(Number(item.quantity))
      if (!quantity || quantity <= 0) {
        throw new Error(`Quantidade inválida para o item selecionado.`)
      }

      const product = await tx.product.findUnique({
        where: { id: item.productId },
      })

      if (!product || product.tenantId !== tenant.id) {
        throw new Error(`Produto não encontrado.`)
      }

      let unitPrice = product.price
      let variantName = null

      if (item.variantId) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
        })

        if (!variant || variant.productId !== product.id) {
          throw new Error(`Variação de produto não encontrada.`)
        }

        unitPrice = variant.price
        variantName = variant.name

        if (product.manageStock && variant.stockQuantity < quantity) {
          throw new Error(`Estoque insuficiente para ${product.name} (${variant.name}).`)
        }

        // Decrement variant stock
        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stockQuantity: { decrement: quantity } },
        })
      } else {
        if (product.manageStock && product.stockQuantity < quantity) {
          throw new Error(`Estoque insuficiente para ${product.name}.`)
        }

        // Decrement product stock
        await tx.product.update({
          where: { id: product.id },
          data: { stockQuantity: { decrement: quantity } },
        })
      }

      const itemTotal = Number((unitPrice * quantity).toFixed(2))
      subtotal += itemTotal

      itemsToCreate.push({
        productId: product.id,
        productVariantId: item.variantId || null,
        productName: product.name,
        variantName,
        unitPrice,
        quantity,
        total: itemTotal,
      })
    }

    const shippingCost = Math.max(0, Number(body.shippingCost || 0))
    let discount = 0
    let appliedCouponId = null

    if (body.couponCode) {
      const normalizedCode = String(body.couponCode).trim().toUpperCase()
      const coupon = await tx.coupon.findFirst({
        where: {
          tenantId: tenant.id,
          code: normalizedCode,
          isActive: true,
        }
      })

      if (coupon) {
        const notExpired = !coupon.expiresAt || new Date(coupon.expiresAt) >= new Date()
        const withinMaxUses = !coupon.maxUses || coupon.usedCount < coupon.maxUses
        const meetsMinOrder = !coupon.minOrderValue || subtotal >= coupon.minOrderValue

        if (notExpired && withinMaxUses && meetsMinOrder) {
          if (coupon.discountType === 'PERCENTAGE') {
            discount = Number(((subtotal * coupon.discountValue) / 100).toFixed(2))
          } else {
            discount = Math.min(coupon.discountValue, subtotal)
          }
          appliedCouponId = coupon.id

          // Increment coupon used count
          await tx.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } }
          })
        }
      }
    }

    const total = Number(Math.max(0, (subtotal - discount) + shippingCost).toFixed(2))

    // Handle payment methods
    const method = body.paymentMethod || 'pix'
    let paymentStatus = 'pending'
    let orderStatus = 'pending'
    let paymentMeta: any = {}

    // Simulated PIX Payload
    const pixCopyPaste = `00020126580014br.gov.bcb.pix0136${crypto.randomUUID()}520400005303986540${total.toFixed(2).replace('.', '')}5802BR5925${tenant.name.substring(0, 25)}6009SAO PAULO62070503***6304ABCD`

    if (method === 'credit_card') {
      const card = body.cardDetails || {}
      const cleanNum = String(card.cardNumber || '4242424242424242').replace(/\D/g, '')
      const last4 = cleanNum.slice(-4) || '4242'
      const brand = cleanNum.startsWith('4') ? 'Visa' : cleanNum.startsWith('5') ? 'Mastercard' : cleanNum.startsWith('6') ? 'Elo' : 'Cartão de Crédito'
      const installments = parseInt(card.installments || 1)
      const installmentAmount = Number((total / installments).toFixed(2))

      paymentStatus = 'paid'
      orderStatus = 'processing'
      paymentMeta = {
        method: 'credit_card',
        brand,
        last4,
        cardHolder: card.cardHolder || body.customerName,
        installments,
        installmentAmount,
        status: 'approved',
        paidAt: new Date().toISOString(),
      }
    } else if (method === 'whatsapp') {
      paymentStatus = 'waiting_whatsapp'
      orderStatus = 'pending'
      paymentMeta = {
        method: 'whatsapp',
        status: 'waiting_whatsapp',
        note: 'Pedido para fechamento e pagamento direto via WhatsApp',
      }
    } else {
      // Default: PIX
      paymentStatus = 'pending'
      orderStatus = 'pending'
      paymentMeta = {
        method: 'pix',
        qrCode: pixCopyPaste,
        status: 'pending',
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      }
    }

    const newOrder = await tx.order.create({
      data: {
        tenantId: tenant.id,
        orderNumber,
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        customerDocument: body.customerDocument,
        shippingAddress: JSON.stringify(body.shippingAddress),
        shippingService: body.shippingService || 'Padrão',
        shippingCost,
        subtotal,
        discount,
        total,
        paymentMethod: method,
        paymentStatus,
        orderStatus,
        paymentGatewayId: `sim_${method}_${Math.random().toString(36).substring(2, 10)}`,
        paymentMetadata: JSON.stringify(paymentMeta),
        items: {
          create: itemsToCreate,
        },
      },
      include: {
        items: true,
      },
    })

    return newOrder
  })

  let paymentMetadata = null
  try {
    paymentMetadata = order.paymentMetadata ? JSON.parse(order.paymentMetadata) : null
  } catch {}

  // Format WhatsApp message
  const itemsText = order.items
    .map((item: any) => `• ${item.quantity}x ${item.productName}${item.variantName ? ` (${item.variantName})` : ''} - R$ ${item.total.toFixed(2)}`)
    .join('\n')

  const shippingAddr = typeof body.shippingAddress === 'object'
    ? `${body.shippingAddress.street}, ${body.shippingAddress.number} - ${body.shippingAddress.city}/${body.shippingAddress.state}`
    : ''

  const methodLabel = order.paymentMethod === 'whatsapp'
    ? 'Direto pelo WhatsApp'
    : order.paymentMethod === 'credit_card'
    ? 'Cartão de Crédito (Aprovado)'
    : 'PIX (Aguardando Pagamento)'

  const whatsappMessage = `👋 Olá, ${tenant.name}!\n\nAcabei de realizar um pedido na sua loja online:\n\n📋 *PEDIDO #${order.orderNumber}*\n👤 *Cliente:* ${order.customerName}\n📱 *Telefone:* ${order.customerPhone}\n📍 *Entrega:* ${shippingAddr}\n\n📦 *ITENS:* \n${itemsText}\n\n💰 *Subtotal:* R$ ${order.subtotal.toFixed(2)}\n🚚 *Frete (${order.shippingService}):* R$ ${order.shippingCost.toFixed(2)}${order.discount > 0 ? `\n🏷️ *Desconto:* - R$ ${order.discount.toFixed(2)}` : ''}\n💵 *TOTAL: R$ ${order.total.toFixed(2)}*\n💳 *Forma:* ${methodLabel}\n\n🔗 Acompanhar Pedido:\nhttp://localhost:3000/pedido/${order.orderNumber}`

  const cleanPhone = (tenant.contactWhatsapp || '11999998888').replace(/\D/g, '')
  const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`
  const whatsappLink = `https://wa.me/${fullPhone}?text=${encodeURIComponent(whatsappMessage)}`

  return {
    message: 'Pedido realizado com sucesso!',
    order: {
      id: order.id,
      orderNumber: order.orderNumber,
      total: order.total,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      discount: order.discount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      items: order.items,
    },
    payment: paymentMetadata,
    whatsappLink,
    whatsappMessage,
  }
})

