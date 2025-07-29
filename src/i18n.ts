import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'

i18n
  .use(initReactI18next)
  .use(Backend)
  .init({
    fallbackLng: 'en',
  supportedLngs: ['en','ar','fr','es','de','it','ru','ja','tr','zh'],
    backend: {
      loadPath: '/locales/{{lng}}/translation.json'
    },
    interpolation: { escapeValue: false }
  })

export default i18n