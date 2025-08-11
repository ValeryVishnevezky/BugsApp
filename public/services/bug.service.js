import { storageService } from './async.storage.service.js'

const BASE_URL = `/api/bug/`
const STORAGE_KEY = 'bugDB'

export const bugService = {
	query,
	getById,
	save,
	remove,
	getDefaultFilter,
	getDefaultSort,
	downloadBugsPdf
}

function query(filterBy = { title: '', minSeverity: '', labels: '', pageIdx: 0, userId: '' }, sortBy = { type: '', desc: 1 }) {
	const filterSortBy = { ...filterBy, ...sortBy }
	return axios.get(BASE_URL, { params: filterSortBy })
	.then(res => res.data)
}

function getById(bugId) {
	return axios.get(BASE_URL + bugId).then(res => res.data)
}

function remove(bugId) {
	return axios.delete(BASE_URL + bugId)
}

function save(bug) {
	const method = bug._id ? 'put' : 'post'
	return axios[method](BASE_URL, bug).then(res => res.data)
}

function getDefaultFilter() {
	return { title: '', minSeverity: '', labels: '', pageIdx: 0, userId: '' }
}

function getDefaultSort() {
	return { type: '', desc: 1 }
}

function downloadBugsPdf() {
	return axios.get(BASE_URL + 'pdf', { responseType: 'blob' }).then(res => res.data)
}
