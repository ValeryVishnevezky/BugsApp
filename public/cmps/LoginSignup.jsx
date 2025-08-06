import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'
import { LoginForm } from './LoginForm.jsx'

const { useState } = React

export function LoginSignup({ setUser }) {
	const [isSignup, setIsSignUp] = useState(false)

	function onLoginSignup(credentials) {
		isSignup ? onSignup(credentials) : onLogin(credentials)
	}

	function onLogin(credentials) {
		userService.login(credentials)
			.then(setUser)
			.then(() => {showSuccessMsg('Logged in successfully')})
			.catch((err) => {
				console.log('err', err)
				showErrorMsg('Oops try again')
			})
	}

	function onSignup(credentials) {
		userService.signup(credentials)
			.then(setUser)
			.then(() => {showSuccessMsg('Signed in successfully')})
			.catch((err) => {
				console.log('err', err)
				showErrorMsg('Oops try again')
			})
	}

	return (
		<section className="login">
			<LoginForm onLoginSignup={onLoginSignup} isSignup={isSignup} setIsSignUp={() => setIsSignUp((prev) => !prev)}/>
		</section>
	)
}
