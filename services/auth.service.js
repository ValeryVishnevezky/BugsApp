import Cryptr from 'cryptr'
import { userService } from './user.service.js'

const crypt = new Cryptr(process.env.SECRET)

export const authService = {
	checkLogin,
	getLoginToken,
	validateLoginToken,
}

function checkLogin({ username, password }) {
	return userService.getByUsername(username)
		.then((user) => {
			if (user && user.password === password) {
				user = { ...user }
				delete user.password
				return Promise.resolve(user)
			}
			return Promise.reject('Username or password do not match')
		})
		.catch((err) => {
			console.log(err)
			return Promise.reject('User not found')
		})
}

function getLoginToken(user) {
	const str = JSON.stringify(user)
	const encryptedToken = crypt.encrypt(str)
	return encryptedToken
}

function validateLoginToken(token) {
	if (!token) return null
	const decryptedToken = crypt.decrypt(token)
	const user = JSON.parse(decryptedToken)
	return user
}
