import { utilService } from '../services/util.service.js'
const { useState, useEffect } = React

export function BugPreview({ bug, onRemoveBug, onEditBug }) {
	const [randomImgNumber, setRandomImgNumber] = useState(1)
	const imgSrc = `assets/img/bugs/bug${randomImgNumber}.jpg`
	const clrClass = bug.severity > 9 ? 'a' : bug.severity > 5 ? 'b' : 'c'

	useEffect(() => {
		setRandomImgNumber(utilService.getRandomIntInclusive(1, 9))
	}, [bug])

	return (
		<section className='bug-preview'>
			<h2>{bug.title}</h2>
			<img src={bug.imgSrc || imgSrc} alt={`Bug ${randomImgNumber}`} />
			<p className={`severity ${clrClass}`}>Severity: <span className={clrClass}>{bug.severity}</span></p>
			<p>Owner ID: <span>{bug.creator.fullname}</span></p>
		</section>
	)
}
