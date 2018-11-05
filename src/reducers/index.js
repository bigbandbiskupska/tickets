import { combineReducers } from 'redux'
import schemas from './schemas'
import seats from './seats'
import tickets from './tickets'
import users from './users'
import messages from './messages'
import tabs from './tabs'

export default combineReducers({
    schemas,
    seats,
    tickets,
    users,
    messages,
    tabs,
})