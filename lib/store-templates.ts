export type StoreTemplateId = 'standard' | 'collection'

export interface StoreTemplate {
  id: StoreTemplateId
  name: string
  description: string
  heroStyle: 'wide' | 'editorial'
  productColumns: string
  showTrustBar: boolean
  showCategoryNavigation: boolean
}

export const STORE_TEMPLATES: StoreTemplate[] = [
  {
    id: 'standard',
    name: 'Loja Padrao',
    description: 'Modelo completo para catalogo, ofertas e compra rapida.',
    heroStyle: 'wide',
    productColumns: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    showTrustBar: true,
    showCategoryNavigation: true,
  },
  {
    id: 'collection',
    name: 'Colecoes',
    description: 'Modelo editorial para marcas que vendem por colecoes e lancamentos.',
    heroStyle: 'editorial',
    productColumns: 'grid-cols-2 md:grid-cols-3',
    showTrustBar: false,
    showCategoryNavigation: true,
  },
]

export const getStoreTemplate = (templateId?: string): StoreTemplate => {
  return STORE_TEMPLATES.find((template) => template.id === templateId) || STORE_TEMPLATES[0]
}
