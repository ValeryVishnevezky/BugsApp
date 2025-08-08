const { combineReducers, createStore } = Redux
import { bugReducer } from './reducers/bug.reducer.js'
import { userReducer } from './reducers/user.reducer.js'

const rootReducer = combineReducers({
	bugModule: bugReducer,
	userModule: userReducer,
})

export const store = createStore(rootReducer)
