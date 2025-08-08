import fs from 'fs'
import { utilService } from './util.service.js'
import { pdfService } from './pdf.service.js'

const gUsers = utilService.readJsonFile('data/user.json')

export const userService = {
	query,
	getById,
	save,
	remove,
	getByUsername,
}

function query() {
	const usersQuery = gUsers.map((user) => ({ _id: user._id, fullname: user.fullname }))
	return Promise.resolve(usersQuery)
}

function getById(userId) {
	let user = gUsers.find((user) => user._id === userId)
	if (!user) return Promise.reject('User not found')
	user = { ...user }
	delete user.password
	return Promise.resolve(user)
}

function save(user) {
	if (user._id) {
		const idx = gUsers.findIndex((currUser) => currUser._id === user._id)
		if (idx === -1) return Promise.reject('User not found')
		gUsers[idx] = user
	} else {
		const userExist = getByUsername(user.username)
		if (userExist) return Promise.reject('Username taken')
		user._id = utilService.makeId()
		//TODO call the authService here to encrypt the password
		gUsers.push(user)
	}

	return _saveUsersToFile().then(() => {
		user = { ...user }
		delete user.password
		return user
	})
}

function remove(userId) {
	const idx = gUsers.findIndex((user) => user._id === userId)
	if (idx === -1) return Promise.reject('User not found')
	gUsers.splice(idx, 1)
	return _saveUsersToFile()
}

function getByUsername(username) {
	var user = gUsers.find((user) => user.username === username)
	return Promise.resolve(user)
}

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
