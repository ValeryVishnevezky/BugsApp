const { combineReducers, createStore } = Redux
import { bugReducer } from './reducers/bug.reducer.js'
import { userReducer } from './reducers/user.reducer.js'
import { authReducer } from './reducers/auth.reducer.js'

const rootReducer = combineReducers({
	bugModule: bugReducer,
	userModule: userReducer,
	authModule: authReducer
})

export const store = createStore(rootReducer)
