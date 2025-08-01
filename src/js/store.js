import { createStore } from 'framework7/lite';

const store = createStore({
	state: {
		isLoggedIn: false
	},
	getters: {
		isLoggedIn ({ state }) {
			return state.isLoggedIn;
		}
	},
	actions: {
		login ({ state }, { isLoggedIn }) {
			state.isLoggedIn = isLoggedIn
		},
	},
})

export default store;
