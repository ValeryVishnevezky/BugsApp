import { bugService } from '../../services/bug.service.js'

export const SET_BUGS = 'SET_BUGS'
export const SET_BUG = 'SET_BUG'
export const DELETE_BUG = 'DELETE_BUG'
export const UPDATE_BUG = 'UPDATE_BUG'

export const SET_FILTER = 'SET_FILTER'

const initState = {
	bugs: [],
	bug: null,
	filterBy: bugService.getDefaultFilter(),
}

export function bugReducer(state = initState, action) {
	switch (action.type) {
		case SET_BUGS:
			return { ...state, bugs: action.bugs }

		case SET_BUG:
			return { ...state, bug: action.bug }

		case DELETE_BUG:
			return { ...state, bugs: state.bugs.filter(bug => bug._id !== action.bugId) }

		case UPDATE_BUG:
			return { ...state, bugs: action.bugs.map(bug => bug._id === action.bug._id ? action.bug : bug) }

		case SET_FILTER:
			return { ...state, filterBy: action.filterBy }

		default:
			return state
	}
}
