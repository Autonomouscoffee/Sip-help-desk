import { createStore } from 'framework7/lite';

const store = createStore({
	state: {
		isLoggedIn: false,
		token: ''
	},
	getters: {
		isLoggedIn ({ state }) {
			return state.isLoggedIn;
		},
		token ({ state }) {
			return state.token
		}
	},
	actions: {
		async login ({ state }, { isLoggedIn, token }) {
			state.isLoggedIn = isLoggedIn
			state.token = token
		},
		logOut ({ state }) {
			state.isLoggedIn = false
			state.token = ''
		}
	},
})

export default store;
