export const SET_USERS = 'SET_USERS'
export const SET_USER = 'SET_USER'
export const DELETE_USER = 'DELETE_USER'

const initState = {
	users: [],
	user: null
}

export function userReducer(state = initState, action) {
	switch (action.type) {
		case SET_USERS:
			return { ...state, users: action.users }

		case SET_USER:
			return { ...state, users: action.users }

		case DELETE_USER:
			return { ...state, users: state.users.filter(user => user._id !== action.userId) }

		default:
			return state
	}
}
