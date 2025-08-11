import { authService } from '../../services/auth.service.js'

export const SET_LOGGEDIN_USER = 'SET_LOGGEDIN_USER'
export const LOGOUT_USER = 'LOGOUT_USER'

const initState = {
	loggedinUser: authService.getLoggedInUser(),
}

export function authReducer(state = initState, action) {
	switch (action.type) {
		case SET_LOGGEDIN_USER:
			return { ...state, loggedinUser: action.loggedinUser }

		case LOGOUT_USER:
			return { ...state, loggedinUser: null }

		default:
			return state
	}
}
