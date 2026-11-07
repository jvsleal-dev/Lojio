import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('[Seed] Iniciando seed completo do banco de dados...')

  // Limpar dados existentes
  await prisma.coupon.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()
  await prisma.tenant.deleteMany()

  const defaultPassword = await bcrypt.hash('senha123', 10)
  const masterPassword = await bcrypt.hash('admin123', 10)

  // 1. Criar Usuário SuperAdmin (Dono da Plataforma)
  const superAdmin = await prisma.user.create({
    data: {
      name: 'Administrador Geral',
      email: 'admin@saas.com',
      password: masterPassword,
      role: 'SUPERADMIN',
    }
  })
  console.log(`[Master] SuperAdmin criado: ${superAdmin.email} (senha: admin123)`)

  // 2. Loja Cliente 1: Moda Urbana (Streetwear)
  const tenant1 = await prisma.tenant.create({
    data: {
      name: 'Moda Urbana',
      subdomain: 'modaurbana',
      description: 'A melhor curadoria de streetwear, sneakers e moda contemporânea.',
      contactEmail: 'contato@modaurbana.com.br',
      contactWhatsapp: '11999998888',
      primaryColor: '#0f172a',
      accentColor: '#2563eb',
      announcementBar: 'Frete grátis em compras acima de R$ 199 com o cupom BEMVINDO',
      showAnnouncement: true,
      originZipcode: '01310-100',
      plan: 'ENTERPRISE',
      isActive: true,
    }
  })

  await prisma.user.create({
    data: {
      tenantId: tenant1.id,
      name: 'Lucas Moda',
      email: 'lojista@demo.com',
      password: defaultPassword,
      role: 'MERCHANT',
    }
  })

  const catStreetwear = await prisma.category.create({
    data: {
      tenantId: tenant1.id,
      name: 'Camisetas & Tops',
      slug: 'camisetas-e-tops',
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    }
  })

  const catSneakers = await prisma.category.create({
    data: {
      tenantId: tenant1.id,
      name: 'Tênis & Sneakers',
      slug: 'tenis-e-sneakers',
      imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80',
    }
  })

  const prodCamiseta = await prisma.product.create({
    data: {
      tenantId: tenant1.id,
      categoryId: catStreetwear.id,
      name: 'Camiseta Oversized Heavyweight Cotton',
      slug: 'camiseta-oversized-heavyweight-cotton',
      description: 'Camiseta confeccionada em algodão nobre 100% penteado fio 20.1, gramatura pesada 240g, caimento solto e estruturado estilo vintage.',
      price: 129.90,
      compareAtPrice: 159.90,
      costPrice: 45.00,
      sku: 'CMS-OVR-01',
      stockQuantity: 40,
      weightGrams: 350,
      lengthCm: 25,
      heightCm: 5,
      widthCm: 20,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
      ]),
      hasVariants: true,
      isActive: true,
      isFeatured: true,
    }
  })

  for (const tam of ['P', 'M', 'G', 'GG']) {
    await prisma.productVariant.create({
      data: {
        productId: prodCamiseta.id,
        name: `Tamanho ${tam} / Preto`,
        sku: `CMS-OVR-BLK-${tam}`,
        price: 129.90,
        compareAtPrice: 159.90,
        stockQuantity: 10,
        attributes: JSON.stringify({ tamanho: tam, cor: 'Preto' }),
      }
    })
  }

  const prodSneaker = await prisma.product.create({
    data: {
      tenantId: tenant1.id,
      categoryId: catSneakers.id,
      name: 'Sneaker Minimalist White Leather',
      slug: 'sneaker-minimalist-white-leather',
      description: 'Tênis produzido artesanalmente em couro legítimo vegetal, forração em couro respirável e solado de borracha vulcanizada antiderrapante.',
      price: 389.00,
      compareAtPrice: 449.00,
      costPrice: 150.00,
      sku: 'SNK-MNL-01',
      stockQuantity: 20,
      weightGrams: 850,
      lengthCm: 32,
      heightCm: 12,
      widthCm: 20,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
      ]),
      hasVariants: true,
      isActive: true,
      isFeatured: true,
    }
  })

  for (const tam of [39, 40, 41, 42]) {
    await prisma.productVariant.create({
      data: {
        productId: prodSneaker.id,
        name: `Tamanho ${tam}`,
        sku: `SNK-MNL-WHT-${tam}`,
        price: 389.00,
        stockQuantity: 5,
        attributes: JSON.stringify({ tamanho: String(tam) }),
      }
    })
  }

  await prisma.order.create({
    data: {
      tenantId: tenant1.id,
      orderNumber: 'ORD-2026-0001',
      customerName: 'Mariana Costa',
      customerEmail: 'mariana.costa@email.com',
      customerPhone: '11988887777',
      customerDocument: '12345678909',
      shippingAddress: JSON.stringify({
        street: 'Avenida Paulista',
        number: '1578',
        complement: 'Apto 82',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        zipcode: '01310-200'
      }),
      shippingService: 'SEDEX - Expresso',
      shippingCost: 22.50,
      subtotal: 129.90,
      discount: 0,
      total: 152.40,
      paymentMethod: 'pix',
      paymentStatus: 'paid',
      orderStatus: 'shipped',
      trackingCode: 'BR123456789BR',
      paymentGatewayId: 'pix_sim_demo_01',
      items: {
        create: [
          {
            productId: prodCamiseta.id,
            productName: prodCamiseta.name,
            variantName: 'Tamanho M / Preto',
            unitPrice: 129.90,
            quantity: 1,
            total: 129.90,
          }
        ]
      }
    }
  })

  // 3. Loja Cliente 2: TechZone Store (Eletrônicos & Setup)
  const tenant2 = await prisma.tenant.create({
    data: {
      name: 'TechZone Store',
      subdomain: 'techzone',
      description: 'Periféricos premium, áudio de alta fidelidade e acessórios para setups profissionais.',
      contactEmail: 'contato@techzone.com.br',
      contactWhatsapp: '11977776666',
      primaryColor: '#09090b',
      accentColor: '#7c3aed', // Purple neon
      announcementBar: 'Mega Semana Gamer: Até 40% OFF em periféricos mecânicos e fones Hi-Fi!',
      showAnnouncement: true,
      originZipcode: '04543-000',
      plan: 'PRO',
      isActive: true,
    }
  })

  await prisma.user.create({
    data: {
      tenantId: tenant2.id,
      name: 'Carlos Tech',
      email: 'tech@demo.com',
      password: defaultPassword,
      role: 'MERCHANT',
    }
  })

  const catAudio = await prisma.category.create({
    data: {
      tenantId: tenant2.id,
      name: 'Fones & Áudio Pro',
      slug: 'fones-e-audio-pro',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    }
  })

  const catPerifericos = await prisma.category.create({
    data: {
      tenantId: tenant2.id,
      name: 'Teclados Mecânicos & Mouses',
      slug: 'teclados-e-mouses',
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    }
  })

  const prodHeadphone = await prisma.product.create({
    data: {
      tenantId: tenant2.id,
      categoryId: catAudio.id,
      name: 'Headphone Wireless Active Noise Cancelling ANC-700',
      slug: 'headphone-wireless-anc-700',
      description: 'Cancelamento ativo de ruído híbrido, drivers de titânio de 40mm, bateria de 60 horas e suporte a áudio Lossless LDAC.',
      price: 649.00,
      compareAtPrice: 799.00,
      costPrice: 280.00,
      sku: 'HPH-ANC-700',
      stockQuantity: 25,
      weightGrams: 520,
      lengthCm: 22,
      heightCm: 18,
      widthCm: 9,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
      ]),
      hasVariants: true,
      isActive: true,
      isFeatured: true,
    }
  })

  for (const cor of ['Space Gray', 'Midnight Black', 'Silver']) {
    await prisma.productVariant.create({
      data: {
        productId: prodHeadphone.id,
        name: `Cor: ${cor}`,
        sku: `HPH-ANC-${cor.toUpperCase().slice(0, 3)}`,
        price: 649.00,
        compareAtPrice: 799.00,
        stockQuantity: 8,
        attributes: JSON.stringify({ cor }),
      }
    })
  }

  const prodTeclado = await prisma.product.create({
    data: {
      tenantId: tenant2.id,
      categoryId: catPerifericos.id,
      name: 'Teclado Mecânico Custom 75% RGB Hot-Swap Gasket Mount',
      slug: 'teclado-mecanico-custom-75-rgb',
      description: 'Montagem Gasket Mount com switches lineares lubrificados de fábrica, keycaps PBT Doubleshot e conexão Tri-mode (Bluetooth 5.1, 2.4Ghz e Cabo Tipo-C).',
      price: 529.90,
      compareAtPrice: 620.00,
      costPrice: 210.00,
      sku: 'TEC-75-CST',
      stockQuantity: 18,
      weightGrams: 980,
      lengthCm: 34,
      heightCm: 5,
      widthCm: 15,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      ]),
      hasVariants: false,
      isActive: true,
      isFeatured: true,
    }
  })

  await prisma.order.create({
    data: {
      tenantId: tenant2.id,
      orderNumber: 'ORD-2026-9021',
      customerName: 'Gabriel Siqueira',
      customerEmail: 'gabriel.siqueira@email.com',
      customerPhone: '11966665555',
      customerDocument: '98765432100',
      shippingAddress: JSON.stringify({
        street: 'Rua Funchal',
        number: '418',
        complement: 'Conjunto 101',
        neighborhood: 'Vila Olímpia',
        city: 'São Paulo',
        state: 'SP',
        zipcode: '04551-060'
      }),
      shippingService: 'SEDEX 10',
      shippingCost: 35.00,
      subtotal: 649.00,
      discount: 0,
      total: 684.00,
      paymentMethod: 'pix',
      paymentStatus: 'paid',
      orderStatus: 'delivered',
      trackingCode: 'BR987654321BR',
      paymentGatewayId: 'pix_tech_demo_02',
      items: {
        create: [
          {
            productId: prodHeadphone.id,
            productName: prodHeadphone.name,
            variantName: 'Cor: Space Gray',
            unitPrice: 649.00,
            quantity: 1,
            total: 649.00,
          }
        ]
      }
    }
  })

  // 4. Loja Cliente 3: Aroma & Grão Café (Cafés Especiais)
  const tenant3 = await prisma.tenant.create({
    data: {
      name: 'Aroma & Grão Café',
      subdomain: 'cafegourmet',
      description: 'Cafés especiais selecionados de produtores artesanais da Mantiqueira de Minas.',
      contactEmail: 'contato@aromaegrao.com.br',
      contactWhatsapp: '35988881111',
      primaryColor: '#3d1d0e',
      accentColor: '#d97706', // Amber gold
      announcementBar: 'Assine o clube do café ou compre avulso com torra fresca semanal!',
      showAnnouncement: true,
      originZipcode: '37500-000',
      plan: 'STARTER',
      isActive: true,
    }
  })

  await prisma.user.create({
    data: {
      tenantId: tenant3.id,
      name: 'Helena Café',
      email: 'cafe@demo.com',
      password: defaultPassword,
      role: 'MERCHANT',
    }
  })

  const catCafeEspecial = await prisma.category.create({
    data: {
      tenantId: tenant3.id,
      name: 'Grãos Especiais 250g & 1kg',
      slug: 'graos-especiais',
      imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80',
    }
  })

  const prodCafeMantiqueira = await prisma.product.create({
    data: {
      tenantId: tenant3.id,
      categoryId: catCafeEspecial.id,
      name: 'Café Especial Microlote Bourbon Amarelo 88 Pontos',
      slug: 'cafe-especial-bourbon-amarelo-88-pontos',
      description: 'Notas sensoriais de chocolate belga, caramelo e frutas amarelas. Altitude 1.250m, processo natural com torra média suave.',
      price: 54.90,
      compareAtPrice: 65.00,
      costPrice: 18.00,
      sku: 'CAF-BRB-250',
      stockQuantity: 60,
      weightGrams: 260,
      lengthCm: 20,
      heightCm: 12,
      widthCm: 8,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
      ]),
      hasVariants: true,
      isActive: true,
      isFeatured: true,
    }
  })

  for (const moagem of ['Em Grãos', 'Moído para Filtro', 'Moído para Prensa Francesa', 'Moído para Espresso']) {
    await prisma.productVariant.create({
      data: {
        productId: prodCafeMantiqueira.id,
        name: `Moagem: ${moagem}`,
        sku: `CAF-BRB-${moagem.slice(0, 3).toUpperCase()}`,
        price: 54.90,
        stockQuantity: 15,
        attributes: JSON.stringify({ moagem }),
      }
    })
  }

  // Cupons da Moda Urbana
  await prisma.coupon.create({
    data: {
      tenantId: tenant1.id,
      code: 'BEMVINDO10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderValue: 99,
      isActive: true,
    }
  })

  await prisma.coupon.create({
    data: {
      tenantId: tenant1.id,
      code: 'FRETEGRATIS',
      discountType: 'FIXED',
      discountValue: 22.50,
      minOrderValue: 199,
      isActive: true,
    }
  })

  // Cupons da TechZone
  await prisma.coupon.create({
    data: {
      tenantId: tenant2.id,
      code: 'TECH15',
      discountType: 'PERCENTAGE',
      discountValue: 15,
      minOrderValue: 299,
      isActive: true,
    }
  })

  // Cupons do Café Gourmet
  await prisma.coupon.create({
    data: {
      tenantId: tenant3.id,
      code: 'CAFE10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderValue: 50,
      isActive: true,
    }
  })

  console.log('[Seed] Finalizado com sucesso!')
  console.log('---')
  console.log('[Auth] SUPERADMIN PLATAFORMA: admin@saas.com / admin123 (Painel: /master)')
  console.log('[Auth] LOJA 1: modaurbana.localhost:3000 ou ?tenant=modaurbana (Lojista: lojista@demo.com / senha123)')
  console.log('[Auth] LOJA 2: techzone.localhost:3000 ou ?tenant=techzone (Lojista: tech@demo.com / senha123)')
  console.log('[Auth] LOJA 3: cafegourmet.localhost:3000 ou ?tenant=cafegourmet (Lojista: cafe@demo.com / senha123)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
