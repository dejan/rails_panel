import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
// import Lara from './presets/lara';
import Wind from './presets/wind';
import './style.css';

const app = createApp(App);
const pinia = createPinia();
app.use(PrimeVue, {
  unstyled: true,
  pt: Wind
});
app.use(pinia);
app.mount('#app');
