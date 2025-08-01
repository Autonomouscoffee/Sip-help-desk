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
Framework7.use(Framework7Vue);

const pinia = createPinia()
pinia.use(createPersistedState({
	key: id => `__persisted__${id}`,
	auto: true,
}))

const app = createApp(App);
registerComponents(app);
app.use(pinia)
app.mount('#app');