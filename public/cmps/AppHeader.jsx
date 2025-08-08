const { useState, useEffect } = React
const { NavLink, useNavigate, Outlet } = ReactRouterDOM
import { UserMsg } from './UserMsg.jsx'
import { LoginSignup } from './LoginSignup.jsx'
import { authService } from '../services/auth.service.js'

export function AppHeader() {
	const [user, setUser] = useState(authService.getLoggedInUser())
	const [isLogin, setIsLogin] = useState(false)
	const navigate = useNavigate()

	function onLogout() {
		authService.logout().then(() => {
			setUser(null)
			navigate('/')
		})
	}

	return (
		<React.Fragment>
			<header className="flex align-center space-between">
				<img onClick={() => navigate('/')} className="logo" src="/assets/img/small-logo.png" />

				{!user && (
					<div className="nav-bar-container flex space-between">
						<nav className="nav-bar">
							<NavLink to="/">Home</NavLink>
							<NavLink to="/bug">Bugs</NavLink>
							<NavLink to="/about">About</NavLink>
						</nav>
						<button className="btn" onClick={() => setIsLogin(true)}>
							Login
						</button>
						<button className="btn" onClick={() => setIsLogin(true)}>
							Signup
						</button>
						{isLogin && (
							<React.Fragment>
								<div className="backdrop" onClick={() => setIsLogin(false)}></div>
								<section className="login-modal" onClick={(ev) => ev.stopPropagation()}>
									<LoginSignup setUser={setUser} onClose={() => setIsLogin(false)} />
								</section>
							</React.Fragment>
						)}
					</div>
				)}

				{user && (
					<div className="nav-bar-container flex space-between">
						<nav className="nav-bar">
							<NavLink to="/">Home</NavLink>
							<NavLink to="/bug">Bugs</NavLink>
							{user && <NavLink to="/user">Profile</NavLink>}
							{user && user.isAdmin && <NavLink to="/admin">Admin</NavLink>}
							<NavLink to="/about">About</NavLink>
						</nav>
						<div className="logout-container">
							<p>Hello {user.fullname}</p>
							<button className="btn" onClick={onLogout}>
								Logout
							</button>
						</div>
					</div>
				)}
			</header>
			<UserMsg />
		</React.Fragment>
	)
}
