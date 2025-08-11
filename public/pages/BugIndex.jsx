const { useState, useEffect } = React
const { useSelector, useDispatch } = ReactRedux
import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugList } from '../cmps/BugList.jsx'
import { BugSort } from '../cmps/BugSort.jsx'
import { bugService } from '../services/bug.service.js'
import { bugActions } from '../store/actions/bug.actions.js'
import { SET_FILTER, SET_SORT } from '../store/reducers/bug.reducer.js'
import { showSuccessMsg, showErrorMsg } from '../services/event.bus.service.js'

export function BugIndex() {
	const dispatch = useDispatch()
	const loggedinUser = useSelector(state => state.authModule.loggedinUser)
	const bugs = useSelector(state => state.bugModule.bugs)
	const totalPageSize = useSelector(state => state.bugModule.totalPageSize)
	const filterBy = useSelector(state => state.bugModule.filterBy)
	const sortBy = useSelector(state => state.bugModule.sortBy)

	useEffect(() => {
		bugActions.query()
	}, [filterBy, sortBy])

	function onSetFilter(filterBy) {
		dispatch({ type: SET_FILTER, filterBy })
	}

	function onSetSort(sortBy) {
		dispatch({ type: SET_SORT, sortBy })
	}

	function onChangePageIdx(diff) {
		let newPageIdx = filterBy.pageIdx + diff
		if (newPageIdx < 0) newPageIdx = totalPageSize
		if (newPageIdx > totalPageSize) newPageIdx = 0
		dispatch({ type: SET_FILTER, filterBy: { ...filterBy, pageIdx: newPageIdx } })
	}

	function onRemoveBug(bugId) {
		bugService
			.remove(bugId)
			.then(() => {
				setBugs(prevBugs => prevBugs.filter(bug => bug._id !== bugId))
				showSuccessMsg('Bug removed')
			})
			.catch(err => {
				console.log('from remove bug')
				console.error('Error: Something went wrong with remove bug \n', err)
				if (loggedinUser) showErrorMsg('Cannot remove bug')
				if (!loggedinUser) showErrorMsg('Please sign in to remove a bug')
			})
	}

	function onAddBug() {
		const bug = {
			title: prompt('Bug title?'),
			severity: +prompt('Bug severity?')
		}

		if (!bug.title || !bug.severity) return showErrorMsg('Please enter title and severity')

		bugService
			.save(bug)
			.then(savedBug => {
				setBugs(prevBugs => [...prevBugs, savedBug])
				showSuccessMsg('Bug added')
			})
			.catch(err => {
				console.log('from add bug')
				console.error('Error: Something went wrong with add bug \n', err)
				if (loggedinUser) showErrorMsg('Cannot add bug')
				if (!loggedinUser) showErrorMsg('Please sign in to add a bug')
			})
	}

	function onEditBug(bug) {
		const severity = +prompt('New severity?')
		const bugToSave = { ...bug, severity }
		bugService
			.save(bugToSave)
			.then(savedBug => {
				setBugs(prevBugs => prevBugs.map(currBug => (currBug._id === savedBug._id ? savedBug : currBug)))
				showSuccessMsg('Bug updated')
			})
			.catch(err => {
				console.log('from edit bug')
				console.error('Error: Something went wrong with edit bug \n', err)
				if (loggedinUser) showErrorMsg('Cannot update bug')
				if (!loggedinUser) showErrorMsg('Please sign in to update a bug')
			})
	}

	function onDownloadBugsPdf() {
		bugService
			.downloadBugsPdf()
			.then(pdfBlob => {
				const url = window.URL.createObjectURL(pdfBlob)
				const link = document.createElement('a')
				link.href = url
				link.setAttribute('download', 'Bugs.pdf')
				document.body.appendChild(link)
				link.click()
				link.remove()
			})
			.catch(err => {
				console.log('from download bugs PDF')
				console.error('Error: Something went wrong with download bugs PDF \n', err)
				showErrorMsg('Cannot download bugs PDF')
			})
	}

	return (
		<section className='main-layout main-layout-bugs'>
			<div>
				<BugFilter onSetFilter={onSetFilter} filterBy={filterBy} />
				<section className='sort-act-container'>
					<BugSort onSetSort={onSetSort} sortBy={sortBy} />
					<div>
						{/* prettier-ignore */}
						<button className='btn' onClick={onAddBug}>Add Bug</button>
						{/* prettier-ignore */}
						<button className='btn btn-download' onClick={onDownloadBugsPdf}>Download PDF</button>
					</div>
				</section>
				{bugs.length === 0 ? <h1 className='no-bugs'>No bugs to show</h1> : <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />}
			</div>

			<div className='paging flex'>
				{/* prettier-ignore */}
				<button className='btn' onClick={() => onChangePageIdx(-1)}>Prev</button>
				<span>{filterBy.pageIdx + 1}</span>
				{/* prettier-ignore */}
				<button className='btn' onClick={() => onChangePageIdx(1)}>Next</button>
			</div>
		</section>
	)
}
