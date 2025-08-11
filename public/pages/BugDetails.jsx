const { Link, useParams } = ReactRouterDOM
const { useState, useEffect } = React
const { useSelector } = ReactRedux
// import { bugService } from '../services/bug.service.js'
import { bugActions } from '../store/actions/bug.actions.js'
import { showSuccessMsg, showErrorMsg } from '../services/event.bus.service.js'

export function BugDetails() {
	const bug = useSelector(state => state.bugModule.bug)
	const { bugId } = useParams()

	useEffect(() => {
		bugActions.getById(bugId)
			.catch((err) => {
				console.log('from load bug details')
				console.error('Error: Something went wrong with load bug \n', err)
				showErrorMsg('Cannot load bug')
			})
			.catch((err) => {
				console.log('Error is:', err)
			})
	}, [])

	if (!bug) return <div>Loading...</div>
	return (
		bug && (
			<div>
				<h3>Bug Details 🐛</h3>
				<h4>{bug.title}</h4>
				<p>
					Severity: <span>{bug.severity}</span>
				</p>
				<p>
					Description: <span>{bug.description}</span>
				</p>
				<Link to="/bug">Back to List</Link>
			</div>
		)
	)
}
