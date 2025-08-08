const STORAGE_KEY = 'loggedinUser'

export const authService = {
	signup,
	login,
	logout,
	getLoggedInUser
}

function signup(signupInfo) {
	return axios.post('/api/auth/signup', signupInfo)
		.then(res => res.data)
		.then(user => {
			sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
			return user
		})
}

function login(credentials) {
	return axios.post('/api/auth/login', credentials)
		.then(res => res.data)
		.then(user => {
			sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
			return user
		})
}

function logout() {
	sessionStorage.removeItem(STORAGE_KEY)
	return axios.post('/api/auth/logout').catch(err => console.error(err))
}

function getLoggedInUser() {
	const entity = sessionStorage.getItem(STORAGE_KEY)
	return JSON.parse(entity)
}
