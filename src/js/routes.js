
import HomePage from '../pages/home.vue';
import BillingPage from '../pages/billing.vue';
import NotFoundPage from '../pages/404.vue';



export default [
	{
		path: '/',
		component: HomePage,
	},
	{
		path: '/billing/',
		component: BillingPage,
	},
	{
		path: '(.*)',
		component: NotFoundPage,
	},
];