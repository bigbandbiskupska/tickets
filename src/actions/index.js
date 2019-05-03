import get from 'lodash/get';
import config from '../config';


const memoize = (fn) => {
    return (url, params = {}) => {
        if (localStorage.getItem(url)) {
            return Promise.resolve({
                json: () => Promise.resolve(JSON.parse(localStorage.getItem(url)))
            });
        }
        return fn(url, params)
            .then(result => {
                return result.json().then(data => {
                    localStorage.setItem(url, JSON.stringify(data));
                    return {
                        ...result,
                        json: () => Promise.resolve(data)
                    }
                });
            });
    }
};

const requestFetch = (url, params) => {
    return fetch(url, params)
        .then(result => {
            if (result.status >= 200 && result.status < 300) {
                return Promise.resolve(result);
            }
            return result.json()
                .then(data => Promise.reject(new Error(data.message || 'Neznámá chyba')))
        });
};

let myFetch = requestFetch; //memoize(requestFetch);
//myFetch = memoize(requestFetch);

export function fetchSchemas(apiKey) {
    return dispatch => {
        if (!apiKey) {
            console.error('apiKey is needed to run the queries!');
            return Promise.reject(new Error('Uživatel nemá platný token'));
        }

        return myFetch(config.apiRoot + '/schemas?token=' + apiKey)
            .then(function (result) {
                return result.json().then(function (data) {
                    dispatch({
                        type: 'SCHEMAS_FETCH_SUCCESS',
                        schemas: data
                    });
                    return data;
                });
            })
            .catch(function (error) {
                dispatch({
                    type: 'SCHEMAS_FETCH_FAIL',
                    error
                });
                return Promise.reject(error);
            });
    }
}


export function fetchTickets(apiKey) {
    return dispatch => {
        if (!apiKey) {
            console.error('apiKey is needed to run the queries!');
            return Promise.reject(new Error('Uživatel nemá platný token'));
        }

        return myFetch(config.apiRoot + '/tickets?token=' + apiKey)
            .then(function (result) {
                return result.json().then(function (data) {
                    dispatch({
                        type: 'TICKETS_FETCH_SUCCESS',
                        tickets: data
                    });
                    return data;
                });
            })
            .catch(function (error) {
                dispatch({
                    type: 'TICKETS_FETCH_FAIL',
                    error
                });
                return Promise.reject(error);
            });
    }
}

export function fetchTicketsForUser(apiKey, id) {
    return dispatch => {
        if (!apiKey) {
            console.error('apiKey is needed to run the queries!');
            return Promise.reject(new Error('Uživatel nemá platný token'));
        }

        return myFetch(config.apiRoot + '/user/' + id + '/tickets?token=' + apiKey)
            .then(function (result) {
                return result.json().then(function (data) {
                    dispatch({
                        type: 'TICKETS_FETCH_SUCCESS',
                        tickets: data
                    });
                    return data;
                });
            })
            .catch(function (error) {
                dispatch({
                    type: 'TICKETS_FETCH_FAIL',
                    error
                });
                return Promise.reject(error);
            });
    }
}

export function createTicket(apiKey, ticket) {
    return (dispatch) => {
        if (!apiKey) {
            console.error('apiKey is needed to run the queries!');
            return Promise.reject(new Error('Uživatel nemá platný token'));
        }

        return myFetch(config.apiRoot + '/tickets?token=' + apiKey, {
            method: 'POST',
            body: JSON.stringify(ticket),
        })
            .then(function (result) {
                return result.json().then(function (data) {
                    dispatch({
                        type: 'TICKET_CREATE_SUCCESS',
                        ticket: data
                    });
                    return data;
                });
            })
            .catch(function (error) {
                dispatch({
                    type: 'TICKET_CREATE_FAIL',
                    error
                });
                return Promise.reject(error);
            });
    }
}

export function fetchSchema(apiKey, id, {forceLoad = false} = {}) {
    return (dispatch, getState) => {
        if (!apiKey) {
            console.error('apiKey is needed to run the queries!');
            return Promise.reject(new Error('Uživatel nemá platný token'));
        }

        const schema = get(getState(), `schemas.schemas.${id}`);

        if (!forceLoad && schema) {
            dispatch({
                type: 'SCHEMA_FETCH_SUCCESS',
                schema: schema,
            });
            return Promise.resolve(schema);
        }

        return myFetch(config.apiRoot + '/schema/' + id + '?token=' + apiKey)
            .then(function (result) {
                return result.json().then(function (data) {
                    dispatch({
                        type: 'SCHEMA_FETCH_SUCCESS',
                        schema: data
                    });
                    return data;
                });
            })
            .catch(function (error) {
                dispatch({
                    type: 'SCHEMA_FETCH_FAIL',
                    error
                });
                return Promise.reject(error);
            });
    }
}

export function fetchTicket(apiKey, id, {forceLoad = false} = {}) {
    return (dispatch, getState) => {
        if (!apiKey) {
            console.error('apiKey is needed to run the queries!');
            return Promise.reject(new Error('Uživatel nemá platný token'));
        }

        const ticket = get(getState(), `tickets.tickets.${id}`);

        if (!forceLoad && ticket) {
            dispatch({
                type: 'TICKET_FETCH_SUCCESS',
                ticket: ticket,
            });
            return Promise.resolve(ticket);
        }

        return myFetch(config.apiRoot + '/ticket/' + id + '?token=' + apiKey)
            .then(function (result) {
                return result.json().then(function (data) {
                    dispatch({
                        type: 'TICKET_FETCH_SUCCESS',
                        ticket: data
                    });
                    return data;
                });
            })
            .catch(function (error) {
                dispatch({
                    type: 'TICKET_FETCH_FAIL',
                    error
                });
                return Promise.reject(error);
            });
    }
}

export function updateTicket(apiKey, id, data) {
    return (dispatch, getState) => {
        if (!apiKey) {
            console.error('apiKey is needed to run the queries!');
            return Promise.reject(new Error('Uživatel nemá platný token'));
        }

        return myFetch(config.apiRoot + '/ticket/' + id + '?token=' + apiKey, {
            method: 'PUT',
            body: JSON.stringify(data),
        })
            .then(function (result) {
                return result.json().then(function (data) {
                    dispatch({
                        type: 'TICKET_UPDATE_SUCCESS',
                        ticket: data
                    });
                    return data;
                });
            })
            .catch(function (error) {
                dispatch({
                    type: 'TICKET_UPDATE_FAIL',
                    error
                });
                return error;
            });
    }
}

export function deleteTicket(apiKey, id, {forceLoad = false} = {}) {
    return (dispatch) => {
        if (!apiKey) {
            console.error('apiKey is needed to run the queries!');
            return Promise.reject(new Error('Uživatel nemá platný token'));
        }

        return myFetch(config.apiRoot + '/ticket/' + id + '?token=' + apiKey, {
            method: 'DELETE'
        })
            .then(function (result) {
                dispatch({
                    type: 'TICKET_DELETE_SUCCESS',
                    id: id,
                });
                return id;
            })
            .catch(function (error) {
                dispatch({
                    type: 'TICKET_DELETE_FAIL',
                    error
                });
                return Promise.reject(error);
            });
    }
}

export function fetchSeats(apiKey, schemaId) {
    return dispatch => {
        if (!apiKey) {
            console.error('apiKey is needed to run the queries!');
            return Promise.reject(new Error('Uživatel nemá platný token'));
        }

        return myFetch(`${config.apiRoot}/schema/${schemaId}/seats?token=${apiKey}`)
            .then(function (result) {
                return result.json().then(function (data) {
                    dispatch({
                        type: 'SCHEMA_SEATS_FETCH_SUCCESS',
                        seats: data
                    });
                    return data;
                });
            })
            .catch(function (error) {
                dispatch({
                    type: 'SCHEMA_SEATS_FETCH_FAIL',
                    error
                });
                return Promise.reject(error);
            });
    }
}

export function fetchTicketSeats(apiKey, ticketId) {
    return dispatch => {
        if (!apiKey) {
            console.error('apiKey is needed to run the queries!');
            return Promise.reject(new Error('Uživatel nemá platný token'));
        }

        return myFetch(`${config.apiRoot}/ticket/${ticketId}/seats?token=${apiKey}`)
            .then(function (result) {
                return result.json().then(function (data) {
                    dispatch({
                        type: 'TICKET_SEATS_FETCH_SUCCESS',
                        seats: data
                    });
                    return data;
                });
            })
            .catch(function (error) {
                dispatch({
                    type: 'TICKET_SEATS_FETCH_FAIL',
                    error
                });
                return Promise.reject(error);
            });
    }
}


export function fetchSeat(apiKey, id, {forceLoad = false} = {}) {
    return (dispatch, getState) => {
        if (!apiKey) {
            console.error('apiKey is needed to run the queries!');
            return Promise.reject(new Error('Uživatel nemá platný token'));
        }

        const seat = get(getState(), `seats.seats.${id}`);

        if (!forceLoad && seat) {
            dispatch({
                type: 'SEAT_FETCH_SUCCESS',
                seat: seat
            });
            return Promise.resolve(seat);
        }

        return myFetch(config.apiRoot + '/seat/' + id + '?token=' + apiKey)
            .then(function (result) {
                return result.json().then(function (data) {
                    dispatch({
                        type: 'SEAT_FETCH_SUCCESS',
                        seat: data
                    });
                    return data;
                });
            })
            .catch(function (error) {
                dispatch({
                    type: 'SEAT_FETCH_FAIL',
                    error
                });
                return Promise.reject(error);
            });
    }
}

export function fetchTemporaryTicket() {
    return dispatch => {
        const DEFAULT_TICKET = JSON.stringify([])
        const storage = window.localStorage;

        if (!storage) {
            return Promise.reject('No local storage available.').catch(function (error) {
                dispatch({
                    type: 'TEMPORARY_TICKET_FETCH_FAIL',
                    error: error,
                })
                return Promise.reject(error);
            });
        }

        return Promise.resolve(storage.getItem('ticket') || DEFAULT_TICKET)
            .then(data => JSON.parse(data))
            .then(data => data && Array.isArray(data) ? Promise.resolve(data) : Promise.resolve([]))
            .then(data => [...new Set(data)])
            .then(data => data.filter(id => Number.isInteger(id)))
            .then(data => data.filter(id => id > 0))
            .then(function (data) {
                dispatch({
                    type: 'TEMPORARY_TICKET_FETCH_SUCCESS',
                    ticket: {
                        seats: data
                    },
                });

                dispatch(saveTemporaryTicket(data));
                return Promise.resolve(data);
            }).catch(error => {
                dispatch({
                    type: 'TEMPORARY_TICKET_FETCH_FAIL',
                    error,
                });
                return Promise.reject(error);
            });
    }
}

export function addToTemporaryTicket(seatId) {
    return dispatch => Promise.resolve(seatId)
        .then(id => dispatch(fetchTemporaryTicket())
            .then(ticket => dispatch(saveTemporaryTicket([...ticket, id]))
                .then(() => {
                    dispatch({
                        type: 'ADD_TO_TEMPORARY_TICKET',
                        id: id,
                    });
                    return Promise.resolve(id);
                })));
}

export function deleteFromTemporaryTicket(seatId) {
    return dispatch => Promise.resolve(seatId)
        .then(id => dispatch(fetchTemporaryTicket())
            .then(ticket => dispatch(saveTemporaryTicket(ticket.filter(seat => seat !== id))))
            .then(() => {
                dispatch({
                    type: 'DELETE_FROM_TEMPORARY_TICKET',
                    id: id,
                });
                return Promise.resolve(id);
            }));
}

export function saveTemporaryTicket(ticket) {
    return dispatch => {
        return Promise.resolve().then(() => {
            const storage = window.localStorage;
            if (storage) {
                storage.setItem('ticket', JSON.stringify([...new Set(ticket)]));
            }
            dispatch({
                type: 'SAVE_TEMPORARY_TICKET_SUCCESS'
            })
        })
    };
}

export function cleanTemporaryTicket() {
    return dispatch => {
        return Promise.resolve().then(function (data) {
            const storage = window.localStorage;
            if (storage.getItem('ticket')) {
                storage.removeItem('ticket');
            }

            dispatch({
                type: 'CLEAN_TEMPORARY_TICKET',
            })
            return data;
        });
    }
}

export function createSchema(apiKey, schema) {
    return dispatch => {
        if (!apiKey) {
            console.error('apiKey is needed to run the queries!');
            return Promise.reject(new Error('Uživatel nemá platný token'));
        }

        return myFetch(config.apiRoot + '/schemas?token=' + apiKey, {
            method: 'POST',
            body: JSON.stringify(schema),
        })
            .then(function (result) {
                return result.json().then(function (data) {
                    dispatch({
                        type: 'SCHEMA_CREATE_SUCCESS',
                        schema: data
                    });
                    return data;
                });
            })
            .catch(function (error) {
                dispatch({
                    type: 'SCHEMA_CREATE_FAIL',
                    error
                });
                return Promise.reject(error);
            });
    }
}

export function updateSchema(apiKey, id, schema) {
    return dispatch => {
        if (!apiKey) {
            console.error('apiKey is needed to run the queries!');
            return Promise.reject(new Error('Uživatel nemá platný token'));
        }

        return myFetch(config.apiRoot + '/schema/' + id + '?token=' + apiKey, {
            method: 'PUT',
            body: JSON.stringify(schema),
        })
            .then(function (result) {
                return result.json().then(function (data) {
                    dispatch({
                        type: 'SCHEMA_UPDATE_SUCCESS',
                        schema: data
                    });
                    return data;
                });
            })
            .catch(function (error) {
                dispatch({
                    type: 'SCHEMA_UPDATE_FAIL',
                    error
                });
                return Promise.reject(error);
            });
    }
}

export function deleteSchema(apiKey, id) {
    return dispatch => {
        if (!apiKey) {
            console.error('apiKey is needed to run the queries!');
            return Promise.reject(new Error('Uživatel nemá platný token'));
        }

        return myFetch(config.apiRoot + '/schema/' + id + '?token=' + apiKey, {
            method: 'DELETE',
        })
            .then(function (result) {
                dispatch({
                    type: 'SCHEMA_DELETE_SUCCESS',
                    schemaId: id
                });
            })
            .catch(function (error) {
                dispatch({
                    type: 'SCHEMA_DELETE_FAIL',
                    error
                });
                return Promise.reject(error);
            });
    }
}

export function fetchCheckpoints(apiKey) {
    return dispatch => {
        if (!apiKey) {
            console.error('apiKey is needed to run the queries!');
            return Promise.reject(new Error('Uživatel nemá platný token'));
        }

        return myFetch(`${config.apiRoot}/checkpoints?token=${apiKey}`)
            .then(function (result) {
                return result.json().then(function (data) {
                    dispatch({
                        type: 'CHECKPOINTS_FETCH_SUCCESS',
                        checkpoints: data,
                    });
                    return data;
                });
            })
            .catch(function (error) {
                dispatch({
                    type: 'CHECKPOINTS_FETCH_FAIL',
                    error
                });
                return Promise.reject(error);
            });
    }
}

export function fetchCheckpointsDiff(apiKey, oldId, newId) {
    return dispatch => {
        if (!apiKey) {
            console.error('apiKey is needed to run the queries!');
            return Promise.reject(new Error('Uživatel nemá platný token'));
        }

        return myFetch(`${config.apiRoot}/checkpoints/diff/${oldId}/${newId || ''}?token=${apiKey}`)
            .then(function (result) {
                return result.json().then(function (data) {
                    dispatch({
                        type: 'DIFFS_FETCH_SUCCESS',
                        diffs: {
                            [`${oldId || 'oldest'}-${newId || 'current'}`]: data
                        },
                    });
                    return data;
                });
            })
            .catch(function (error) {
                dispatch({
                    type: 'DIFFS_FETCH_FAIL',
                    error
                });
                return Promise.reject(error);
            });
    }
}

export function fetchSchemaHistory(apiKey, schemaId) {
    return dispatch => {
        if (!apiKey) {
            console.error('apiKey is needed to run the queries!');
            return Promise.reject(new Error('Uživatel nemá platný token'));
        }

        return myFetch(`${config.apiRoot}/schema/${schemaId}/history?token=${apiKey}`)
            .then(function (result) {
                return result.json().then(function (data) {
                    dispatch({
                        type: 'SEATS_DIFF_FETCH_SUCCESS',
                        seats: data,
                    });
                    return data;
                });
            })
            .catch(function (error) {
                dispatch({
                    type: 'SEATS_DIFF_FETCH_FAIL',
                    error
                });
                return Promise.reject(error);
            });
    }
}

export function fetchUserHistory(apiKey, userId) {
    return dispatch => {
        if (!apiKey) {
            console.error('apiKey is needed to run the queries!');
            return Promise.reject(new Error('Uživatel nemá platný token'));
        }

        return myFetch(`${config.apiRoot}/user/${userId}/history?token=${apiKey}`)
            .then(function (result) {
                return result.json().then(function (data) {
                    dispatch({
                        type: 'USERS_DIFF_FETCH_SUCCESS',
                        users: data,
                    });
                    return data;
                });
            })
            .catch(function (error) {
                dispatch({
                    type: 'USERS_DIFF_FETCH_FAIL',
                    error
                });
                return Promise.reject(error);
            });
    }
}

export function createCheckpoint(apiKey) {
    return (dispatch, getState) => {
        if (!apiKey) {
            console.error('apiKey is needed to run the queries!');
            return Promise.reject(new Error('Uživatel nemá platný token'));
        }

        return myFetch(`${config.apiRoot}/checkpoints?token=${apiKey}`, {
            method: 'POST',
            body: JSON.stringify({}),
        })
            .then(function (result) {
                return result.json().then(function (data) {
                    dispatch({
                        type: 'CHECKPOINT_CREATE_SUCCESS',
                    });
                    return data;
                });
            })
            .catch(function (error) {
                dispatch({
                    type: 'CHECKPOINT_CREATE_FAIL',
                    error
                });
                return Promise.reject(error);
            });
    }
}

export function fetchUsers(apiKey) {
    return dispatch => {
        if (!apiKey) {
            console.error('apiKey is needed to run the queries!');
            return Promise.reject(new Error('Uživatel nemá platný token'));
        }

        return myFetch(`${config.apiRoot}/users?token=${apiKey}`)
            .then(function (result) {
                return result.json().then(function (data) {
                    dispatch({
                        type: 'USERS_FETCH_SUCCESS',
                        users: data
                    });
                    return data;
                });
            })
            .catch(function (error) {
                dispatch({
                    type: 'USERS_FETCH_FAIL',
                    error
                });
                return Promise.reject(error);
            });
    }
}

export function fetchUser(apiKey, id, {forceLoad = false} = {}) {
    return (dispatch, getState) => {
        if (!apiKey) {
            console.error('apiKey is needed to run the queries!');
            return Promise.reject(new Error('Uživatel nemá platný token'));
        }

        const user = get(getState(), `users.users.${id}`);

        if (!forceLoad && user) {
            dispatch({
                type: 'USER_FETCH_SUCCESS',
                user: user,
            });
            return Promise.resolve(user);
        }


        return myFetch(`${config.apiRoot}/user/${id}?token=${apiKey}`)
            .then(function (result) {
                return result.json().then(function (data) {
                    dispatch({
                        type: 'USER_FETCH_SUCCESS',
                        user: data
                    });
                    return data;
                });
            })
            .catch(function (error) {
                dispatch({
                    type: 'USER_FETCH_FAIL',
                    error
                });
                return Promise.reject(error);
            });
    }
}

export function createUser(apiKey, data) {
    return (dispatch, getState) => {
        if (!apiKey) {
            console.error('apiKey is needed to run the queries!');
            return Promise.reject(new Error('Uživatel nemá platný token'));
        }

        return myFetch(`${config.apiRoot}/users?token=${apiKey}`, {
            method: 'POST',
            body: JSON.stringify(data),
        })
            .then(function (result) {
                return result.json().then(function (data) {
                    dispatch({
                        type: 'USER_CREATE_SUCCESS',
                        user: data
                    });
                    return data;
                });
            })
            .catch(function (error) {
                dispatch({
                    type: 'USER_CREATE_FAIL',
                    error
                });
                return Promise.reject(error);
            });
    }
}

export function loginFromLocalStorage() {
    return dispatch => loadUser()
        .then(user => {
            dispatch({
                type: 'USER_LOGIN_SUCCESS',
                user: user
            });
            return user
        })
}

export function login(userData) {
    return (dispatch) => {

        return dispatch(loginFromLocalStorage())
        // if no user in local storage, load it
            .catch(() => myFetch(`${config.apiRoot}/users/login`, {
                method: 'POST',
                body: JSON.stringify(userData),
            })
                .then(function (result) {
                    return result.json().then(function (data) {
                        if (!data.token) {
                            return Promise.reject(new Error('Uživatel nemá přihlašovací token'))
                        }

                        dispatch({
                            type: 'USER_LOGIN_SUCCESS',
                            user: data
                        });
                        return data;
                    });
                }))
            .then(user => saveUser(user))
            .catch(function (error) {
                dispatch({
                    type: 'USER_LOGIN_FAIL',
                    error
                });
                return Promise.reject(error);
            });
    }
}

export function logout() {
    return (dispatch, getState) => {
        const user = get(getState(), `users.users.${get(getState(), `users.currentUser`)}`);
        dispatch({
            type: 'USER_LOGOUT',
            user
        });
        deleteUser()
        return Promise.resolve(user)
    }
}

export function logBack() {
    return (dispatch, getState) => {
        dispatch({
            type: 'USER_SWITCH',
            newUser: get(getState(), `users.users.${get(getState(), `users.previousUser`)}`),
        });
        return Promise.resolve(get(getState(), `users.users.${get(getState(), `users.previousUser`)}`));
    }
}

export function logAs(id) {
    return (dispatch, getState) => {
        dispatch({
            type: 'USER_SWITCH',
            oldUser: get(getState(), `users.users.${get(getState(), `users.currentUser`)}`),
            newUser: get(getState(), `users.users.${id}`),
        });
        return Promise.resolve(get(getState(), `users.users.${id}`));
    }
}

export const saveUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    return Promise.resolve(user);
}
export const loadUser = () => {
    const user = localStorage.getItem('user')
    if (!!user) {
        try {
            return Promise.resolve(JSON.parse(user));
        } catch (e) {
            return Promise.reject(e)
        }
    }
    return Promise.reject(new Error('No user in local storage.'));
}

export const deleteUser = () => Promise.resolve(localStorage.removeItem('user'));

export const deleteError = (error) => (dispatch) => Promise.resolve(dispatch({
    type: 'DELETE_ERROR',
    error
}));

export const deleteSuccess = (success) => (dispatch) => Promise.resolve(dispatch({
    type: 'DELETE_SUCCESS',
    success
}));

export const addError = (error) => (dispatch) => Promise.resolve(dispatch({
    type: 'ADD_ERROR',
    error
})).then(() => new Promise((resolve => setTimeout(() => resolve(dispatch(deleteError(error))), 10000))));

export const addSuccess = (success) => (dispatch) => Promise.resolve(dispatch({
    type: 'ADD_SUCCESS',
    success
})).then(() => new Promise((resolve => setTimeout(() => resolve(dispatch(deleteSuccess(success))), 10000))));


export const putTab = (tab) => dispatch => Promise.resolve(dispatch({
    type: 'PUT_TAB',
    tab
}))

export const deleteTab = (id) => dispatch => Promise.resolve(dispatch({
    type: 'DELETE_TAB',
    id: id
}))