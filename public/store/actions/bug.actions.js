import { bugService } from '../../services/bug.service.js'
import { store } from '../store.js'
import { SET_BUGS, SET_BUG, SET_PAGE_SIZE, DELETE_BUG, UPDATE_BUG, SET_FILTER, SET_SORT } from '../reducers/bug.reducer.js'

export const bugActions = {
	query,
}

function query() {
	const { filterBy } = store.getState().bugModule
	const { sortBy } = store.getState().bugModule
	return bugService.query(filterBy, sortBy).then(({ bugs, totalPageSize }) => {
		store.dispatch({ type: SET_BUGS, bugs })
		store.dispatch({ type: SET_PAGE_SIZE, totalPageSize })
	})
}
