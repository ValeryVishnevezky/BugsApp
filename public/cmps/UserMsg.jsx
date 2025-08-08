import { eventBusService } from '../services/event.bus.service.js'
const { useState, useEffect, useRef } = React

export function UserMsg() {
	const [msg, setMsg] = useState(null)

	useEffect(() => {
		const removeEvent = eventBusService.on('show-user-msg', msg => {
			setMsg(msg)
			setTimeout(() => {
				setMsg(null)
			}, 2500)
		})

		return () => removeEvent()
	}, [])

	if (!msg || !msg.txt) return <span></span>
	const msgClass = msg.type || ''
	return (
		<section className={'user-msg ' + msgClass}>
			{msg.txt}
			<button onClick={() => { setMsg(null) }}>⨉</button>
		</section>
	)
}
