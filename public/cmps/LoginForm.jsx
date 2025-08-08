import { userService } from '../services/user.service.js'

const { useState } = React

export function LoginForm({ onLoginSignup, isSignup, setIsSignup }) {
	const [credentials, setCredentials] = useState(userService.getEmptyCredentials())

	function handleChange({ target }) {
		const { name: field, value } = target
		setCredentials(prevState =>  ({ ...prevState, [field]: value }))
	}

	function handleSubmit(ev) {
		ev.preventDefault()
		onLoginSignup(credentials)
	}

	return (
		<form className="form flex" onSubmit={handleSubmit}>
			<input type="text" name="username" value={credentials.username} placeholder="Username" onChange={handleChange} required autoFocus />
			<input type="password" name="password" value={credentials.password} placeholder="Password" onChange={handleChange} required />

			{isSignup && <input type="text" name="fullname" value={credentials.fullname} placeholder="Full name" onChange={handleChange} required />}

			<div className="btns">
				<a className="btn" href="#" onClick={() => setIsSignup()}>
					{isSignup ? 'Already a member? Login' : 'New user? Signup here'}
				</a>
				<button className="btn">{isSignup ? 'Signup' : 'Login'}</button>
			</div>
		</form>
	)
}
