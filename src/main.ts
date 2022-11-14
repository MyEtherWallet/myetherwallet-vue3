import { createApp } from 'vue';
import App from './main/mainApp.vue';
import router from './core/router';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import i18n from './main/i18n';
import VueMatomo from 'vue-matomo';
import PiniaPlugin from 'vue-cli-plugin-pinia';
import { createPinia } from 'pinia';
import lokalise from './filters/lokalise';
import { MatomoOptions } from './main/matomo';
import apolloProvider from './main/apolloProvider';
loadFonts();

const app = createApp(App);
const pinia = createPinia();
app.config.globalProperties.lokalise = {
  lokalise(str: string) {
    return lokalise(str);
  }
};
app
  .use(vuetify)
  .use(router)
  .use(i18n)
  .use(PiniaPlugin)
  .use(pinia)
  .use(VueMatomo, MatomoOptions)
  .use(apolloProvider)
  .mount('#app');
