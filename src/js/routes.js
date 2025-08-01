
import HomePage from '../pages/home.vue';
import NotFoundPage from '../pages/404.vue';



export default [
	{
		path: '/',
		component: HomePage,
	},
	{
		path: '(.*)',
		component: NotFoundPage,
	},
];