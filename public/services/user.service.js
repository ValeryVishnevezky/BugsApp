export const userService = {
	query,
	remove,
	getById,
	getEmptyCredentials,
}

//* USER
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

//* USER frontend
function getEmptyCredentials() {
	return {
		username: '',
		password: '',
		fullname: '',
	}
}

