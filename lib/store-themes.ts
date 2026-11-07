export type StoreThemeId = 'classic' | 'editorial'

export interface StoreTheme {
  id: StoreThemeId
  name: string
  description: string
  primaryColor: string
  accentColor: string
  bgColor: string
  fontFamily: string
  cardRadius: string
  buttonRadius: string
  containerWidth: string
  sectionGap: string
  iconStyle: 'outline' | 'editorial'
}

export const STORE_THEMES: StoreTheme[] = [
  {
    id: 'classic',
    name: 'Clareza',
    description: 'Equilibrado e versatil para catalogos de qualquer segmento.',
    primaryColor: '#17202a',
    accentColor: '#1f7a52',
    bgColor: '#f7f8f6',
    fontFamily: 'Plus Jakarta Sans',
    cardRadius: '12px',
    buttonRadius: '8px',
    containerWidth: '80rem',
    sectionGap: '3rem',
    iconStyle: 'outline',
  },
  {
    id: 'editorial',
    name: 'Editorial',
    description: 'Mais espaco, tipografia marcante e foco em colecoes.',
    primaryColor: '#231f20',
    accentColor: '#b45f3c',
    bgColor: '#fbf8f3',
    fontFamily: 'DM Sans',
    cardRadius: '4px',
    buttonRadius: '4px',
    containerWidth: '72rem',
    sectionGap: '4.5rem',
    iconStyle: 'editorial',
  },
]

export const getStoreTheme = (themeId?: string): StoreTheme => {
  return STORE_THEMES.find((theme) => theme.id === themeId) || STORE_THEMES[0]
}
