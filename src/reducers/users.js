import {isArray} from "lodash";

const defaultState = {
    users: {},
    userSeats: {},
    currentUser: 1
};

const users = (state = defaultState, action) => {
    switch (action.type) {
        case 'USERS_FETCH_SUCCESS':
            Object.keys(action.users).forEach(id => {
                action.users[id].last_click_at = action.users[id].last_click_at ? new Date(action.users[id].last_click_at) : undefined
                action.users[id].roles = isArray(action.users[id].roles) ? action.users[id].roles : action.users[id].roles.split(',')
            });
            return {
                ...state,
                users: {
                    ...state.users,
                    ...action.users,
                },
            };
        case 'USER_FETCH_SUCCESS':
            return {
                ...state,
                users: {
                    ...state.users,
                    [action.user.id]: {
                        ...action.user,
                        last_click_at: action.user.last_click_at ? new Date(action.user.last_click_at) : undefined,
                        roles: isArray(action.user.roles) ? action.user.roles : action.user.roles.split(','),
                    },
                },
            };
        case 'USER_LOGOUT':
            const newState = {...state};
            delete newState.currentUser;
            delete newState.previousUser;
            return newState;
        case 'USER_SWITCH':
            const newState2 = {...state};
            if(!action.oldUser) {
                delete newState2.previousUser
            } else {
                newState2.previousUser = action.oldUser.id;
            }
            return {
                ...newState2,
                currentUser: action.newUser.id,
            }
        case 'USER_LOGIN_SUCCESS':
            return {
                ...state,
                users: {
                    ...state.users,
                    [action.user.id]: {
                        ...action.user,
                        last_click_at: action.user.last_click_at ? new Date(action.user.last_click_at) : undefined,
                    },
                },
                currentUser: action.user.id,
            };
        case 'TICKETS_FETCH_SUCCESS':
            const userSeats = {
                ...state.userSeats
            };
            Object.values(action.tickets).forEach(ticket => {
                if(!userSeats[ticket.user_id]) {
                    userSeats[ticket.user_id] = [];
                }
                userSeats[ticket.user_id] = [
                    ...userSeats[ticket.user_id],
                    ...ticket.seats
                ]
            });
            return {
                ...state,
                tickets: {
                    ...state.tickets,
                    ...action.tickets,
                },
                userSeats,
            };
        case 'TICKET_FETCH_SUCCESS':
            const userSeats6 = {
                ...state.userSeats
            };
            if(!userSeats6[action.ticket.user_id]) {
                userSeats6[action.ticket.user_id] = [];
            }
            return {
                ...state,
                tickets: {
                    ...state.tickets,
                    [action.ticket.id]: action.ticket,
                },
                userSeats: {
                    [action.ticket.user_id]: [
                        ...userSeats6[action.ticket.user_id],
                        ...action.ticket.seats,
                    ]
                }
            };
        case 'TICKET_CREATE_SUCCESS':
            const userSeats5 = {
                ...state.userSeats
            };
            if(!userSeats5[action.ticket.user_id]) {
                userSeats5[action.ticket.user_id] = [];
            }
            return {
                ...state,
                userSeats: {
                    ...userSeats5,
                    [action.ticket.user_id]: [
                        ...userSeats5[action.ticket.user_id],
                        ...action.ticket.seats,
                    ],
                }
            };
        case 'SCHEMA_SEATS_FETCH_SUCCESS':
            const userSeats2 = {
                ...state.userSeats,
            };
            Object.keys(action.seats).forEach(id => {
                const seat = action.seats[id];
                seat.tickets.forEach(ticket => {
                    if(!userSeats2[ticket.user_id]) {
                        userSeats2[ticket.user_id] = [];
                    }
                    userSeats2[ticket.user_id] = [
                        ...userSeats2[ticket.user_id],
                        seat.id,
                    ]
                })
            });
            return {
                ...state,
                userSeats: userSeats2
            };
        case 'SEAT_FETCH_SUCCESS':
            const userSeats3 = {
                ...state.userSeats,
            };
            action.seat.tickets.forEach(ticket => {
                if(!userSeats3[ticket.user_id]) {
                    userSeats3[ticket.user_id] = [];
                }
                userSeats3[ticket.user_id] = [
                    ...userSeats3[ticket.user_id],
                    ...action.seat.id,
                ]
            })
            return {
                ...state,
                userSeats: userSeats3
            };
        default:
            return state;
    }
}

export default users;