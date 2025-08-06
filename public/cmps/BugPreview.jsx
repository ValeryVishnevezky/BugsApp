import { utilService } from '../services/util.service.js'
const { useState, useEffect } = React
export function BugPreview({ bug, onRemoveBug, onEditBug }) {
  const [randomImgNumber, setRandomImgNumber] = useState(1)
  const imgSrc = `assets/img/bugs/bug${randomImgNumber}.jpg`

  useEffect(() => {
    setRandomImgNumber(utilService.getRandomIntInclusive(1, 9))
  }, [bug])

  return (
    <section className="bug-preview">
      <h4>{bug.title}</h4>
      <img src={bug.imgSrc || imgSrc} alt={`Bug ${randomImgNumber}`} />
      <p>
        Severity: <span>{bug.severity}</span>
      </p>
      <p>
        Owner ID: <span>{bug.creator.fullname}</span>
      </p>
    </section>
  )
}
