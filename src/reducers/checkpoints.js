const defaultState = {
    seats: {},
    users: {},
    diffs: {},
    checkpoints: {},
};

const checkpoints = (state = defaultState, action) => {
    switch (action.type) {
        case 'SEATS_DIFF_FETCH_SUCCESS':
            return {
                ...state,
                seats: {
                    ...state.seats,
                    // remap date property to real date
                    ...Object.assign({}, ...Object.keys(action.seats).map(id => ({
                        [id]: [
                            ...action.seats[id].map(checkpoint => ({
                                ...checkpoint,
                                changed_at: new Date(checkpoint.changed_at)
                            })),
                        ]
                    })))
                }
            };
        case 'USERS_DIFF_FETCH_SUCCESS':
            return {
                ...state,
                users: {
                    ...state.users,
                    // remap date property to real date
                    ...Object.assign({}, ...Object.keys(action.users).map(id => ({
                        [id]: [
                            ...action.users[id].map(checkpoint => ({
                                ...checkpoint,
                                changed_at: new Date(checkpoint.changed_at)
                            })),
                        ]
                    })))
                }
            };
        case 'DIFFS_FETCH_SUCCESS':
            return {
                ...state,
                diffs: {
                    ...action.diffs
                }
            };
        case 'CHECKPOINTS_FETCH_SUCCESS':
            return {
                ...state,
                checkpoints: {
                    // remap date property to real date
                    ...state.checkpoints,
                    ...Object.assign({}, ...Object.keys(action.checkpoints).map(id => {
                        return {
                            [id]: {
                                ...action.checkpoints[id],
                                created_at: new Date(action.checkpoints[id].created_at)
                            }
                        }
                    }))
                }
            };
        default:
            return state
    }
};

export default checkpoints