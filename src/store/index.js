import {applyMiddleware, createStore} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import reducer from '../reducers'
import config from '../config';

const middlewares = [
    thunkMiddleware
];

if (config.env !== 'production') {
    middlewares.push(createLogger({collapsed: true}))
}

const middleware = applyMiddleware(...middlewares)
const store = createStore(reducer, middleware)

export default store