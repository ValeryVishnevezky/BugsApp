import { bugService } from '../../services/bug.service.js'
import { store } from '../store.js'
import { SET_BUGS, SET_BUG, SET_PAGE_SIZE, DELETE_BUG, UPDATE_BUG, ADD_BUG, SET_FILTER, SET_SORT } from '../reducers/bug.reducer.js'

export const bugActions = {
	query,
	getById,
	remove,
	save
}

function query() {
	const { filterBy } = store.getState().bugModule
	const { sortBy } = store.getState().bugModule
	return bugService.query(filterBy, sortBy).then(({ bugs, totalPageSize }) => {
		store.dispatch({ type: SET_BUGS, bugs })
		store.dispatch({ type: SET_PAGE_SIZE, totalPageSize })
	})
}

function getById(bugId) {
	return bugService.getById(bugId).then(bug => store.dispatch({ type: SET_BUG, bug }))
}

function remove(bugId) {
	return bugService.remove(bugId).then(() => store.dispatch({ type: DELETE_BUG, bugId }))
}

function save(bug) {
	const type = bug._id ? UPDATE_BUG : ADD_BUG
	return bugService.save(bug).then(bug => store.dispatch({ type, bug }))
}
