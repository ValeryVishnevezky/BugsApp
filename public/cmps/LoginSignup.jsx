import { showErrorMsg, showSuccessMsg } from '../services/event.bus.service.js'
import { authService } from '../services/auth.service.js'
import { LoginForm } from './LoginForm.jsx'

const { useState } = React
const { useNavigate } = ReactRouterDOM

export function LoginSignup({ setUser, onClose }) {
	const [isSignup, setIsSignUp] = useState(false)
	const navigate = useNavigate()

	function onLoginSignup(credentials) {
		isSignup ? onSignup(credentials) : onLogin(credentials)
		onClose()
		navigate('/bug')
	}

	function onLogin(credentials) {
		authService
			.login(credentials)
			.then(setUser)
			.then(() => {
				showSuccessMsg('Logged in successfully')
			})
			.catch(err => {
				console.log('err', err)
				showErrorMsg('Oops try again')
			})
	}

	function onSignup(credentials) {
		authService
			.signup(credentials)
			.then(setUser)
			.then(() => {
				showSuccessMsg('Signed in successfully')
			})
			.catch(err => {
				console.log('err', err)
				showErrorMsg('Oops try again')
			})
	}

	return (
		<section className='login'>
			<LoginForm onLoginSignup={onLoginSignup} isSignup={isSignup} setIsSignUp={() => setIsSignUp(prev => !prev)} />
		</section>
	)
}
