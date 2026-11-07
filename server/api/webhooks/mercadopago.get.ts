export default defineEventHandler(async (event) => {
  return {
    status: 'ok',
    service: 'Mercado Pago Webhook Endpoint',
    timestamp: new Date().toISOString(),
  }
})

