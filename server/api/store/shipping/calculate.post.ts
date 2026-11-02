export default defineEventHandler(async (event) => {
  const tenant = event.context.tenant

  if (!tenant) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Loja não encontrada.',
    })
  }

  const body = await readBody(event)
  const zipcode = String(body.zipcode || '').replace(/\D/g, '')

  if (zipcode.length !== 8) {
    throw createError({
      statusCode: 400,
      statusMessage: 'CEP inválido. Informe um CEP com 8 dígitos.',
    })
  }

  const originZip = String(tenant.originZipcode || '01001000').replace(/\D/g, '')
  const destRegion = parseInt(zipcode.substring(0, 1), 10)
  const originRegion = parseInt(originZip.substring(0, 1), 10)
  const diff = Math.abs(destRegion - originRegion)

  // Deterministic realistic rates
  const pacPrice = Number((16.90 + diff * 3.40).toFixed(2))
  const sedexPrice = Number((24.50 + diff * 5.90).toFixed(2))
  const pacDays = 4 + diff
  const sedexDays = 1 + Math.min(diff, 3)

  return {
    rates: [
      {
        id: 'pac',
        name: 'PAC - Correios Econômico',
        company: 'Correios',
        price: pacPrice,
        deliveryTimeDays: pacDays,
      },
      {
        id: 'sedex',
        name: 'SEDEX - Expresso Prioritário',
        company: 'Correios',
        price: sedexPrice,
        deliveryTimeDays: sedexDays,
      },
    ],
  }
})

