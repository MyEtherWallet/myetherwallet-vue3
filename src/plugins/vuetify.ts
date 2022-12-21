// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// components
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Theme
import { vuetifyThemes } from '@myetherwallet/mew-components-vue3';

// Vuetify
import { createVuetify } from 'vuetify';

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: vuetifyThemes
  }
});
