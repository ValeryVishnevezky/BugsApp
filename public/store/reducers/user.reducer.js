export const SET_USERS = 'SET_USERS'
export const SET_LOGGEDIN_USER = 'SET_LOGGEDIN_USER'
export const LOGOUT_USER = 'LOGOUT_USER'

const initState = {
	users: [],
	loggedinUser: null,
}

export function userReducer(state = initState, action) {
	switch (action.type) {
		case SET_USERS:
			return { ...state, users: action.users }

		case SET_LOGGEDIN_USER:
			return { ...state, loggedinUser: action.loggedinUser }

		case LOGOUT_USER:
			return { ...state, loggedinUser: null }

		default:
			return state
	}
}
