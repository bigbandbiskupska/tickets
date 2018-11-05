import Seat from '../components/user/Seat';

const defaultState = {
    seats: {},
    seatsState: {},
};

const seats = (state = defaultState, action) => {
    switch (action.type) {
        case 'TICKET_SEATS_FETCH_SUCCESS':
        case 'SCHEMA_SEATS_FETCH_SUCCESS':
            return {
                ...state,
                seats: {
                    ...state.seats,
                    ...action.seats,
                }
            };
        case 'SEAT_FETCH_SUCCESS':
            return {
                ...state,
                seats: {
                    ...state.seats,
                    [action.seat.id]: action.seat,
                }
            };
        case 'ADD_TO_TEMPORARY_TICKET':
            return {
                ...state,
                seatsState: {
                    ...state.seatsState,
                    [action.id]: Seat.TEMPORARY_RESERVED,
                }
            };
        case 'TEMPORARY_TICKET_FETCH_SUCCESS':
            if (!action.ticket.seats.length) {
                return state;
            }

            return {
                ...state,
                seatsState: {
                    ...state.seatsState,
                    ...Object.assign(...action.ticket.seats.map(id => ({[id]: Seat.TEMPORARY_RESERVED})))
                }
            };
        case 'DELETE_FROM_TEMPORARY_TICKET':
            const states = state.seatsState;
            delete states[action.id];
            return {
                ...state,
                seatsState: states,
            };
        case 'CLEAN_TEMPORARY_TICKET':
            return {
                ...state,
                seatsState: {}
            };
        default:
            return state
    }
}

export default seats