const defaultState = {
    tickets: {},
    userSeats: {},
    temporary: {
        seats: [],
    },
};

const tickets = (state = defaultState, action) => {
    switch (action.type) {
        case 'TICKETS_FETCH_SUCCESS':
            Object.keys(action.tickets).forEach(key => {
                action.tickets[key] = ({
                    ...action.tickets[key],
                    created_at: new Date(action.tickets[key].created_at),
                    updated_at: new Date(action.tickets[key].updated_at),
                })
            });
            return {
                ...state,
                tickets: {
                    ...state.tickets,
                    ...action.tickets,
                },
            };
        case 'TICKET_UPDATE_SUCCESS':
        case 'TICKET_FETCH_SUCCESS':
            return {
                ...state,
                tickets: {
                    ...state.tickets,
                    [action.ticket.id]: {
                        ...action.ticket,
                        created_at: new Date(action.ticket.created_at),
                        updated_at: new Date(action.ticket.updated_at),
                    },
                },
            };
        case 'TICKET_DELETE_SUCCESS':
            const tickets = state.tickets;
            delete tickets[action.id];
            return {
                ...state,
                tickets
            }
        case 'TEMPORARY_TICKET_FETCH_SUCCESS':
            return {
                ...state,
                temporary: action.ticket,
            };
        case 'ADD_TO_TEMPORARY_TICKET':
            return {
                ...state,
                temporary: {
                    ...state.temporary,
                    seats: state.temporary.seats.includes(action.id) ?
                        state.temporary.seats :
                        [...state.temporary.seats, action.id],
                },
            };
        case 'DELETE_FROM_TEMPORARY_TICKET':
            if (!state.temporary || !state.temporary.seats) {
                return state;
            }

            return {
                ...state,
                temporary: {
                    ...state.temporary,
                    seats: state.temporary.seats.filter(id => id !== action.id),
                }
            };
        case 'CLEAN_TEMPORARY_TICKET':
            return {
                ...state,
                temporary: {
                    seats: [],
                },
            };
        default:
            return state;
    }
}

export default tickets;