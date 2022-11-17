// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// components
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Theme
import vuetifyTheme from '@/vuetifyTheme';

console.log(vuetifyTheme);
// Vuetify
import { createVuetify } from 'vuetify';

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: vuetifyTheme.theme.themes.light
      },
      dark: {
        dark: true,
        colors: vuetifyTheme.theme.themes.dark
      }
    }
  }
});
