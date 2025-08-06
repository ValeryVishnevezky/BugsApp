export const userService = {
  query,
  login,
  logout,
  signup,
  remove,
  getById,
  getLoggedInUser,
  getEmptyCredentials
}

const STORAGE_KEY = 'loggedinUser'

//! USER
function query() {
  return axios.get('/api/user').then(res => res.data)
}

function getById(userId) {
  return axios.get('/api/user/' + userId)
	.then(res => res.data)
	.catch(err => console.log(err))
}

function remove(userId) {
	return axios.delete('/api/user/' + userId)
}

//! USER Authentication
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
  return axios.post('/api/auth/logout')
}

//! USER frontend
function getEmptyCredentials() {
  return {
    username: '',
    password: '',
    fullname: ''
  }
}

function getLoggedInUser() {
  const entity = sessionStorage.getItem(STORAGE_KEY)
  return JSON.parse(entity)
}
