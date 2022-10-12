import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import i18n from './main/i18n';
import PiniaPlugin from 'vue-cli-plugin-pinia';
import { createPinia } from 'pinia';
import lokalise from './filters/lokalise';
loadFonts();

const app = createApp(App);
const pinia = createPinia();
app.config.globalProperties.lokalise = {
  lokalise(str: string) {
    return lokalise(str);
  }
};
app
  .use(router)
  .use(vuetify)
  .use(i18n)
  .use(PiniaPlugin)
  .use(pinia)
  .mount('#app');
