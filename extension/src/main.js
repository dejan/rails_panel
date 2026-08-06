import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import Wind from './presets/wind';
import { watchTheme } from './theme';
import './style.css';

watchTheme();

const app = createApp(App);
const pinia = createPinia();
app.use(PrimeVue, {
  unstyled: true,
  pt: Wind
});
app.use(pinia);
app.mount('#app');
