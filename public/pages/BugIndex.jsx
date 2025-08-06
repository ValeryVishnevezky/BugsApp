const { useState, useEffect } = React
import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugList } from '../cmps/BugList.jsx'
import { BugSort } from '../cmps/BugSort.jsx'
import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

export function BugIndex() {
	const [bugs, setBugs] = useState([])
	const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
	const [sortBy, setSortBy] = useState(bugService.getDefaultSort())
	const [totalPageSize, setTotalPageSize] = useState(null)

	useEffect(() => {
		loadBugs()
	}, [filterBy, sortBy])

	function loadBugs() {
		bugService.query(filterBy, sortBy).then(({ bugs, totalPageSize }) => {
			setBugs(bugs)
			setTotalPageSize(totalPageSize)
		})
	}

	function onSetFilter(filterBy) {
		setFilterBy((prevFilter) => ({ ...prevFilter, ...filterBy }))
	}

	function onSetSort(sortBy) {
		setSortBy((prevSort) => ({ ...prevSort, ...sortBy }))
	}

	function onChangePageIdx(diff) {
		setFilterBy((prevFilter) => {
			let newPageIdx = prevFilter.pageIdx + diff
			if (newPageIdx < 0) newPageIdx = totalPageSize
			if (newPageIdx > totalPageSize) newPageIdx = 0
			return { ...prevFilter, pageIdx: newPageIdx }
		})
	}

	function onRemoveBug(bugId) {
		bugService
			.remove(bugId)
			.then(() => {
				console.log('Deleted Succesfully!')
				setBugs((prevBugs) => prevBugs.filter((bug) => bug._id !== bugId))
				showSuccessMsg('Bug removed')
			})
			.catch((err) => {
				console.log('from remove bug', err)
				showErrorMsg('Cannot remove bug')
			})
	}

	function onAddBug() {
		const bug = {
			title: prompt('Bug title?'),
			severity: +prompt('Bug severity?'),
			imgSrc: 'assets/img/bugs/bug1.jpg',
			labels: ['famous', 'need-CR'],
			description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, earum sed corrupti voluptatum voluptatem at.',
			createdAt: Date.now(),
		}

		if (!bug.title || !bug.severity) return showErrorMsg('Please enter title and severity')
		
			bugService
			.save(bug)
			.then((savedBug) => {
				setBugs((prevBugs) => [...prevBugs, savedBug])
				showSuccessMsg('Bug added')
			})
			.catch((err) => {
				console.log('from add bug', err)
				showErrorMsg('Cannot add bug')
			})
	}

	function onEditBug(bug) {
		const severity = +prompt('New severity?')
		const bugToSave = { ...bug, severity }
		bugService
			.save(bugToSave)
			.then((savedBug) => {
				setBugs((prevBugs) => prevBugs.map((currBug) => (currBug._id === savedBug._id ? savedBug : currBug)))
				showSuccessMsg('Bug updated')
			})
			.catch((err) => {
				console.log('from edit bug', err)
				showErrorMsg('Cannot update bug')
			})
	}

	function onDownloadBudsPdf() {
		bugService.downloadBudsPdf().then(() => {
			showSuccessMsg(`Bugs PDF download!`)
		})
	}

	return (
		<section className="main-layout">
			<BugFilter onSetFilter={onSetFilter} filterBy={filterBy} />
			<BugSort onSetSort={onSetSort} sortBy={sortBy} />
			<button className="btn" onClick={onAddBug}>
				Add Bug ⛐
			</button>
			<button className="btn-download" onClick={onDownloadBudsPdf}>
				Download PDF
			</button>

			<BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
			<div className="paging flex">
				<button
					className="btn"
					onClick={() => {
						onChangePageIdx(-1)
					}}
				>
					Previous
				</button>
				<span>{filterBy.pageIdx + 1}</span>
				<button
					className="btn"
					onClick={() => {
						onChangePageIdx(1)
					}}
				>
					Next
				</button>
			</div>
		</section>
	)
}
