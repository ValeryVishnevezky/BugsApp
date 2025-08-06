import Cryptr from 'cryptr'
import { userService } from './user.service.js'

const crypt = new Cryptr(process.env.SECRET)

export const authService = {
	checkLogin,
	getLoginToken,
	validateLoginToken,
	// saveLoginToken,
	// removeLoginToken,
}

function checkLogin(userCredentials) {
	const { username, password } = userCredentials
	return userService
		.getByUsernamePassword(username, password)
		.then((user) => {
			if (user) {
				user = { ...user }
				delete user.password
				// delete user.tokens
				return Promise.resolve(user)
			}
			return Promise.reject('Username or password do not match')
		})
		.catch((err) => {
			console.log(err)
			return Promise.reject('No user found')
		})
}

function getLoginToken(user) {
	const str = JSON.stringify(user)
	const encryptedToken = crypt.encrypt(str)
	// saveLoginToken(encryptedToken, user.username, user.password)
	return encryptedToken
}

function validateLoginToken(token) {
	if (!token) return null
	const decryptedToken = crypt.decrypt(token)
	const user = JSON.parse(decryptedToken)
	return user
}

// function saveLoginToken(encryptedToken, username, password) {
// 	return userService
// 		.getByUsernamePassword(username, password)
// 		.then((user) => {
// 			user.tokens = user.tokens || []
// 			user.tokens.push(encryptedToken)
// 		})
// 		.then(() => userService.saveUsers())
// }

// function removeLoginToken(tokenToRemove, username, password) {
// 	return userService
// 		.getByUsernamePassword(username, password)
// 		.then((user) => {
// 			user.tokens = user.tokens.filter((token) => token !== tokenToRemove)
// 		})
// 		.then(() => userService.saveUsers())
// }
