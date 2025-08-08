import { showErrorMsg, showSuccessMsg } from '../services/event.bus.service.js'
import { authService } from '../services/auth.service.js'
import { LoginForm } from './LoginForm.jsx'

const { useState } = React
const { useNavigate } = ReactRouterDOM

export function LoginSignup({ setUser, isSignUp, onClose }) {
	const [isSignup, setIsSignup] = useState(isSignUp)
	const navigate = useNavigate()

	function onLoginSignup(credentials) {
		isSignup ? onSignup(credentials) : onLogin(credentials)
	}

	function onLogin(credentials) {
		authService.login(credentials)
			.then(user => {
				setUser(user)
				onClose()
				navigate('/bug')
				showSuccessMsg('Logged in successfully')
			})
			.catch(err => {
				console.log('err', err)
				showErrorMsg('Invalid username or password')
			})
	}

	function onSignup(credentials) {
		authService.signup(credentials)
			.then(user => {
				setUser(user)
				onClose()
				navigate('/bug')
				showSuccessMsg('Signed in successfully')
			})
			.catch(err => {
				console.log('err', err)
				showErrorMsg('User already exists, please login')
			})
	}

	return (
		<section className='login'>
			<LoginForm onLoginSignup={onLoginSignup} isSignup={isSignup} setIsSignup={() => setIsSignup(prev => !prev)} />
		</section>
	)
}
