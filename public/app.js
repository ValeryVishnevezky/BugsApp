const Router = ReactRouterDOM.BrowserRouter
const { Provider } = ReactRedux

import { store } from './store/store.js'
import { App } from './RootCmp.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
	<Provider store={store}>
		<Router>
			<App />
		</Router>
	</Provider>
)
