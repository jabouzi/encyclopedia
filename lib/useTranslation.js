import ar from '../locales/ar.json'
import en from '../locales/en.json'
import fr from '../locales/fr.json'

const locales = { ar, en, fr }

export const SUPPORTED_LANGS = ['ar', 'en', 'fr']
export const DEFAULT_LANG = 'ar'

export function useTranslation(lang) {
  const strings = locales[lang] || locales[DEFAULT_LANG]

  function t(key, vars = {}) {
    let str = strings[key] || key
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(`{${k}}`, v)
    }
    return str
  }

  return { t }
}
