import fs from 'fs'
import { utilService } from './util.service.js'
import { pdfService } from './pdf.service.js'

let gBugs = utilService.readJsonFile('data/bug.json')

export const bugService = {
	query,
	getById,
	remove,
	save,
	getPdf,
}

const PAGE_SIZE = 3

function query(filterBy, sortBy) {
	var bugs = [...gBugs]

	// SS - Filter~
	if (filterBy.txt) {
		const regex = new RegExp(filterBy.txt, 'i')
		bugs = gBugs.filter((bug) => regex.test(bug.title))
	}
	if (filterBy.severity) {
		bugs = bugs.filter((bug) => bug.severity >= filterBy.severity)
	}
	if (filterBy.labels) {
		const labelsToFilter = filterBy.labels
		bugs = bugs.filter((bug) => labelsToFilter.some((label) => bug.labels.includes(label)))
	}
	if (filterBy.userId) {
		bugs = bugs.filter((bug) => bug.creator._id === filterBy.userId)
	}

	// sort
	if (sortBy.type === 'createdAt') {
		bugs.sort((b1, b2) => sortBy.desc * (b2.createdAt - b1.createdAt))
	} else if (sortBy.type === 'severity') {
		bugs.sort((b1, b2) => sortBy.desc * (b1.severity - b2.severity))
	} else if (sortBy.type === 'title') {
		bugs.sort((b1, b2) => sortBy.desc * b1.title.localeCompare(b2.title))
	}

	const totalPageSize = Math.ceil(bugs.length / PAGE_SIZE) - 1

	// SS - Pagination~
	if (filterBy.pageIdx !== null) {
		const startIdx = filterBy.pageIdx * PAGE_SIZE
		bugs = bugs.slice(startIdx, startIdx + PAGE_SIZE)
	}

	return Promise.resolve({ bugs, totalPageSize })
}

function save(bug, userId) {
	console.log(bug)
	if (bug._id) {
		if (bug.creator._id !== userId) return Promise.reject('You can not update bug, another creator id')
		const idx = gBugs.findIndex((currBug) => currBug._id === bug._id)
		gBugs[idx] = bug
	} else {
		bug._id = utilService.makeId()
		gBugs.push(bug)
	}
	return _saveBugsToFile().then(() => bug)
}

function remove(bugId, userId) {
	const idx = gBugs.findIndex((bug) => bug._id === bugId)
	if (idx === -1) return Promise.reject('No bug found to remove')
	if (gBugs[idx].creator._id !== userId) return Promise.reject('Can not remove bug, another creator id')
	gBugs.splice(idx, 1)
	return _saveBugsToFile()
}

function getById(bugId) {
	const bug = gBugs.find((bug) => bug._id === bugId)
	if (!bug) return Promise.reject('No bug found')
	else return Promise.resolve(bug)
}

function getPdf(res) {
	pdfService.buildBugsPDF(res, gBugs)
	return Promise.resolve(res)
}

function _saveBugsToFile() {
	return new Promise((resolve, reject) => {
		fs.writeFile('data/bug.json', JSON.stringify(gBugs, null, 2), (err) => {
			if (err) {
				console.log(err)
				reject('Cannot write to file')
			} else {
				console.log('Wrote Successfully!')
				resolve()
			}
		})
	})
}
