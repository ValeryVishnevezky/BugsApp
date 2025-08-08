export const userService = {
	query,
	login,
	logout,
	signup,
	remove,
	getById,
	getLoggedInUser,
	getEmptyCredentials,
}

const STORAGE_KEY = 'loggedinUser'

//! USER
function query() {
	return axios
		.get('/api/user')
		.then((res) => res.data)
		.catch((err) => console.error(err))
}

function getById(userId) {
	return axios
		.get('/api/user/' + userId)
		.then((res) => res.data)
		.catch((err) => console.error(err))
}

function remove(userId) {
	return axios.delete('/api/user/' + userId).catch((err) => console.error(err))
}

//! USER Authentication
function signup(signupInfo) {
	return axios
		.post('/api/auth/signup', signupInfo)
		.then((res) => res.data)
		.then((user) => {
			sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
			return user
		})
		.catch((err) => console.error(err))
}

function login(credentials) {
	return axios
		.post('/api/auth/login', credentials)
		.then((res) => res.data)
		.then((user) => {
			sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
			return user
		})
		.catch((err) => console.error(err))
}

function logout() {
	sessionStorage.removeItem(STORAGE_KEY)
	return axios.post('/api/auth/logout').catch((err) => console.error(err))
}

//! USER frontend
function getEmptyCredentials() {
	return {
		username: '',
		password: '',
		fullname: '',
	}
}

function getLoggedInUser() {
	const entity = sessionStorage.getItem(STORAGE_KEY)
	return JSON.parse(entity)
}
