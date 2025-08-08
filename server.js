import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'
import { bugService } from './services/bug.service.js'
import { userService } from './services/user.service.js'
import { authService } from './services/auth.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

// Config the Express App
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())
app.set('query parser', 'extended')

//! BUGS
// List All Bugs
app.get('/api/bug', (req, res) => {
	const filterBy = {
		txt: req.query.txt || '',
		severity: +req.query.severity || 0,
		labels: req.query.labels || '',
		pageIdx: +req.query.pageIdx || 0,
		userId: req.query.userId || '',
	}
	const sortBy = {
		type: req.query.type || '',
		desc: +req.query.desc || 1,
	}

	bugService
		.query(filterBy, sortBy)
		.then((bugs) => res.send(bugs))
		.catch((err) => {
			loggerService.error('[GET BUGS] Cannot get bugs', err)
			res.status(400).send('Error: Something went wrong with loading bugs')
		})
})

// Get Bugs PDF
app.get('/api/bug/pdf', (req, res) => {
	bugService.getPdf(res).catch((err) => {
		loggerService.error('[PDF] Cannot generate PDF', err)
		res.status(400)
	})
})

// Get Bug by id
app.get('/api/bug/:bugId', (req, res) => {
	const { bugId } = req.params
	let visitedBugIds = req.cookies.visitedBugIds || []
	if (!visitedBugIds.includes(bugId)) visitedBugIds.push(bugId)
	if (visitedBugIds.length > 3) return res.status(401).send('Wait for a bit')

	bugService
		.getById(bugId)
		.then((bug) => {
			res.cookie('visitedBugIds', visitedBugIds, { maxAge: 1000 * 60 * 3 })
			res.send(bug)
		})
		.catch((err) => {
			loggerService.error('[GET BUG] Cannot get bug', err)
			res.status(400).send('Cannot get bug')
		})
})

// Delete Bug
app.delete('/api/bug/:bugId', (req, res) => {
	const loggedinUser = authService.validateLoginToken(req.cookies.loginToken)
	if (!loggedinUser) return res.status(401).send(`Logged in user is not valid`)

	const { bugId } = req.params
	console.log(loggedinUser._id)
	bugService
		.remove(bugId, loggedinUser._id)
		.then(() => res.send(`Bug id: ${bugId} deleted`))
		.catch((err) => {
			loggerService.error('[DELETE BUG] Cannot remove bug', err)
			res.status(400).send('Cannot remove bug')
		})
})

// Create Bug
app.post('/api/bug', (req, res) => {
	const loggedinUser = authService.validateLoginToken(req.cookies.add)
	console.log('Logged in user:', loggedinUser)
	if (!loggedinUser) return res.status(401).send(`Logged in user is not valid`)

	const bug = req.body
	delete loggedinUser.username
	bug.creator = loggedinUser

	bugService
		.save(bug)
		.then((addedBug) => res.send(addedBug))
		.catch((err) => {
			loggerService.error('[POST BUG] Had issues:', err)
			res.status(400).send('Cannot add bug')
		})
})

// Update Bug
app.put('/api/bug', (req, res) => {
	const loggedinUser = authService.validateLoginToken(req.cookies.loginToken)
	if (!loggedinUser) return res.status(401).send(`Logged in user is not valid`)

	const bug = req.body
	bugService
		.save(bug, loggedinUser)
		.then((savedBug) => res.send(savedBug))
		.catch((err) => {
			loggerService.error('[POST BUG] Cannot update bug', err)
			res.status(400).send('Cannot update bug')
		})
})

//! User API
// List All Users
app.get('/api/user', (req, res) => {
	userService
		.query()
		.then((users) => res.send(users))
		.catch((err) => {
			loggerService.error('[GET USERS] Cannot get user', err)
			res.status(400).send('Cannot get user')
		})
})

// Get User by id
app.get('/api/user/:userId', (req, res) => {
	const { userId } = req.params

	userService
		.getById(userId)
		.then((user) => res.send(user))
		.catch((err) => {
			loggerService.error('[GET USER] Cannot get user', err)
			res.status(400).send('Cannot get user')
		})
})

// Delete User
app.delete('/api/user/:userId', (req, res) => {
	const loggedinUser = authService.validateLoginToken(req.cookies.loginToken)
	if (!loggedinUser) return res.status(401).send(`Cannot remove bug`)

	const { userId } = req.params

	userService
		.remove(userId)
		.then(() => res.send(`User id: ${userId} deleted`))
		.catch((err) => {
			loggerService.error('[DELETE USER] Cannot remove user', err)
			res.status(400).send('Cannot remove user')
		})
})

//! Auth API
// Create User and save loginToken in cookies
app.post('/api/auth/signup', (req, res) => {
	const user = req.body

	userService
		.save(user)
		.then((addedUser) => {
			const loginToken = authService.getLoginToken(addedUser)
			res.cookie('loginToken', loginToken)
			res.send(addedUser)
		})
		.catch((err) => {
			loggerService.error('[SIGNUP] Invalid credentials cannot signup', err)
			res.status(400).send('Invalid credentials cannot signup')
		})
})

// Login User - check if username and password are correct and save loginToken in cookies
app.post('/api/auth/login', (req, res) => {
	const credentials = {
		username: req.body.username,
		password: req.body.password,
	}

	authService
		.checkLogin(credentials)
		.then((user) => {
			const loginToken = authService.getLoginToken(user)
			res.cookie('loginToken', loginToken)
			res.send(user)
		})
		.catch((err) => {
			loggerService.error('[LOGIN] Invalid credentials cannot login', err)
			res.status(400).send('Invalid credentials cannot login\n Username or password do not match')
		})
})

// Logout User - clear the loginToken in cookies
app.post('/api/auth/logout', (req, res) => {
	res.clearCookie('loginToken')
	res.send('logged-out')
})

// Fallback route
app.get('/*all', (req, res) => {
	res.sendFile(path.resolve('public/index.html'))
})

const port = process.env.PORT || 3030

app.listen(port, () => {
	console.log(`Server is ready at ${port} http://127.0.0.1:${port}/`)
})
