import { bugService } from '../../services/bug.service.js'

export const SET_BUGS = 'SET_BUGS'
export const SET_BUG = 'SET_BUG'
export const SET_PAGE_SIZE = 'SET_PAGE_SIZE'
export const DELETE_BUG = 'DELETE_BUG'
export const UPDATE_BUG = 'UPDATE_BUG'
export const SET_FILTER = 'SET_FILTER'
export const SET_SORT = 'SET_SORT'

const initState = {
	bugs: [],
	bug: null,
	totalPageSize: null,
	filterBy: bugService.getDefaultFilter(),
	sortBy: bugService.getDefaultSort()
}

export function bugReducer(state = initState, action) {
	switch (action.type) {
		case SET_BUGS:
			return { ...state, bugs: action.bugs }

		case SET_BUG:
			return { ...state, bug: action.bug }

		case SET_PAGE_SIZE:
			return { ...state, totalPageSize: action.totalPageSize }

		case DELETE_BUG:
			return { ...state, bugs: state.bugs.filter(bug => bug._id !== action.bugId) }

		case UPDATE_BUG:
			return { ...state, bugs: action.bugs.map(bug => (bug._id === action.bug._id ? action.bug : bug)) }

		case SET_FILTER:
			return { ...state, filterBy: action.filterBy }

		case SET_SORT:
			return { ...state, sortBy: action.sortBy }

		default:
			return state
	}
}
