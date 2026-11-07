import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const mpAccessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN || 'APP_USR-4119953831524095-110620-2d038806e88e9ad4718325519eb06a2a-3824328154'
  const query = getQuery(event)
  const body = await readBody(event).catch(() => ({}))

  // Mercado Pago sends payment notifications either via query params or JSON body:
  // query: ?type=payment&data.id=123456 OR ?topic=payment&id=123456
  // body: { action: "payment.updated", data: { id: "123456" } }
  const paymentId = (query['data.id'] as string) || (query.id as string) || body?.data?.id

  if (!paymentId) {
    return { received: true, note: 'Nenhum payment ID encontrado no webhook.' }
  }

  try {
    // Consult payment directly from Mercado Pago
    const payment: any = await $fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${mpAccessToken}`,
      },
    })

    if (!payment || !payment.id) {
      return { received: true, note: 'Pagamento não encontrado na API do Mercado Pago.' }
    }

    const gatewayId = String(payment.id)
    const status = payment.status // 'approved', 'pending', 'rejected', 'cancelled'

    // Find corresponding order by paymentGatewayId
    const order = await prisma.order.findFirst({
      where: {
        paymentGatewayId: gatewayId,
      },
    })

    if (order) {
      let newPaymentStatus = order.paymentStatus
      let newOrderStatus = order.orderStatus

      if (status === 'approved') {
        newPaymentStatus = 'paid'
        if (order.orderStatus === 'pending') {
          newOrderStatus = 'processing'
        }
      } else if (status === 'rejected' || status === 'cancelled') {
        newPaymentStatus = 'failed'
        newOrderStatus = 'cancelled'
      }

      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: newPaymentStatus,
          orderStatus: newOrderStatus,
        },
      })
    }

    return { success: true, paymentId, status }
  } catch (err: any) {
    console.error('Webhook Mercado Pago Error:', err?.message || err)
    return { received: true, error: err?.message }
  }
})

