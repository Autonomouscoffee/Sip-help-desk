import { createApp } from 'vue';
import Framework7 from 'framework7/lite-bundle';
import Framework7Vue, { registerComponents } from 'framework7-vue/bundle';
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import 'framework7/css/bundle';
import '../css/icons.css';
import '../css/grid.scss';
import '../css/app.scss';
import App from '../components/app.vue';
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

Framework7.use(Framework7Vue);

const pinia = createPinia()
pinia.use(createPersistedState({
	key: id => `__persisted__${id}`,
	auto: true,
}))

const app = createApp(App);
registerComponents(app);
app.use(pinia)
app.component('VueDatePicker', VueDatePicker);
app.mount('#app');