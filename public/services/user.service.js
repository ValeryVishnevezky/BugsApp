export const userService = {
	query,
	remove,
	getById,
	getEmptyCredentials
}

function query() {
	return axios.get('/api/user').then(res => res.data)
}

function getById(userId) {
	return axios.get('/api/user/' + userId).then(res => res.data)
}

function remove(userId) {
	return axios.delete('/api/user/' + userId)
}

function getEmptyCredentials() {
	return {
		username: 'admin',
		password: 'admin',
		fullname: 'Bugs Admin'
	}
}
