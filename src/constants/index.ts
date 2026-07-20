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
  { label: 'home', labelEn: 'Home', section: SECTION_IDS.HERO },
  { label: 'projects', labelEn: 'Projects', section: SECTION_IDS.PROJECTS },
  { label: 'techs', labelEn: 'Techs', section: SECTION_IDS.TECHS },
  { label: 'contact', labelEn: 'Contact', section: SECTION_IDS.CONTACT },
] as const
