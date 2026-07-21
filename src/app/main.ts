import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createI18n } from 'vue-i18n'
import { watch } from 'vue'
import App from './App.vue'
import { router } from './router'
import { useLocaleStore } from '@/stores/localeStore'
import { STORAGE_KEYS } from '@/constants'
import id from '@/shared/locales/id.json'
import en from '@/shared/locales/en.json'
import '@styles/main.css'

const savedLocale = localStorage.getItem(STORAGE_KEYS.LOCALE) || 'id'

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: { id, en },
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(VueQueryPlugin)
app.use(i18n)

const localeStore = useLocaleStore()

localeStore.setLocale(savedLocale)

watch(
  () => localeStore.locale,
  (val) => {
    i18n.global.locale.value = val as 'id' | 'en'
  },
  { immediate: true },
)

app.mount('#app')
