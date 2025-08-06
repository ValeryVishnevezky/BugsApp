import fs from 'fs'
import { utilService } from './util.service.js'
import { pdfService } from './pdf.service.js'

const gUsers = utilService.readJsonFile('data/user.json')

export const userService = {
	query,
	getById,
	remove,
	save,
	getByUsernamePassword,
	// saveUsers
}

function query() {
	const usersQuery = gUsers.map((user) => ({ _id: user._id, fullname: user.fullname }))
	return Promise.resolve(usersQuery)
}

function getById(userId) {
	let user = gUsers.find((user) => user._id === userId)
	if (!user) return Promise.reject('No user found')
	user = { ...user }
	delete user.password
	// delete user.tokens
	return Promise.resolve(user)
}

function save(user) {
	if (user._id) {
		const idx = gUsers.findIndex((currUser) => currUser._id === user._id)
		gUsers[idx] = user
	} else {
		let userExist = gUsers.find((currUser) => currUser.username === user.username) // check if username is alrady taken
		if (userExist) return Promise.reject('Username taken')

		user._id = utilService.makeId()
		// user.tokens = []
		gUsers.push(user)
	}

	return _saveUsersToFile().then(() => {
		user = { ...user }
		delete user.password
		// delete user.tokens
		return user
	})
}

function remove(userId) {
	const idx = gUsers.findIndex((user) => user._id === userId)
	if (idx === -1) return Promise.reject('No user found')
	gUsers.splice(idx, 1)
	return _saveUsersToFile()
}

function getByUsernamePassword(username, password) {
	let user = gUsers.find((user) => user.username === username && user.password === password)
	if (!user) return Promise.reject('No user found')
	return Promise.resolve(user)
}

// function saveUsers() {
// 	return _saveUsersToFile()
// }

function _saveUsersToFile() {
	return new Promise((resolve, reject) => {
		fs.writeFile('data/user.json', JSON.stringify(gUsers, null, 2), (err) => {
			if (err) {
				console.log(err)
				reject('Cannot write to file')
			} else {
				console.log('Wrote Successfully!')
				resolve()
			}
		})
	})
}
