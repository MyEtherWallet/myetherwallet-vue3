import languages from '@/translations';
import { createI18n } from 'vue-i18n/dist/vue-i18n';
import axios from 'axios';

const i18n = createI18n({
  locale: 'en_US',
  allowComposition: true,
  fallbackLocale: 'en_US',
  messages: languages,
  silentTranslationWarn: true
});

export default i18n;

// our default language that is preloaded
const loadedLanguages = ['en_US'];

const setI18nLanguage = (lang: 'en_US' | 'ru_RU') => {
  i18n.global.locale = lang;
  axios.defaults.headers.common['Accept-Language'] = lang;
  document.querySelector('html')?.setAttribute('lang', lang);
  return lang;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const loadLanguageAsync = (lang: 'en_US' | 'ru_RU') => {
  // If the same language
  if (i18n.global.locale === lang) {
    return Promise.resolve(setI18nLanguage(lang));
  }

  // If the language was already loaded
  if (loadedLanguages.includes(lang)) {
    return Promise.resolve(setI18nLanguage(lang));
  }

  // If the language hasn't been loaded yet
  return import(
    /* webpackChunkName: "lang-[request]" */ `@/translations/${lang}.js`
  ).then(messages => {
    i18n.global.setLocaleMessage(lang, messages.default);
    loadedLanguages.push(lang);
    return setI18nLanguage(lang);
  });
};
