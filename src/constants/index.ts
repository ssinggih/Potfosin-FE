export const APP_NAME = import.meta.env.VITE_APP_TITLE || 'Portfosin'

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  THEME: 'theme',
  LOCALE: 'locale',
} as const

export const SECTION_IDS = {
  HERO: 'hero',
  PROJECTS: 'projects',
  TECHS: 'techs',
  CONTACT: 'contact',
} as const

export const NAV_ITEMS = [
  { key: 'home', section: SECTION_IDS.HERO },
  { key: 'projects', section: SECTION_IDS.PROJECTS },
  { key: 'techs', section: SECTION_IDS.TECHS },
  { key: 'contact', section: SECTION_IDS.CONTACT },
] as const
