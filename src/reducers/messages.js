const defaultState = {
    errors: [],
    success: [],
};

const messages = (state = defaultState, action) => {
    switch (action.type) {
        case 'ADD_ERROR':
            return {
                ...state,
                errors: [...state.errors, action.error.message]
            };
        case 'ADD_SUCCESS':
            return {
                ...state,
                success: [...state.success, action.success]
            };
        case 'DELETE_ERROR':
            return {
                ...state,
                errors: state.errors.filter(error => error !== action.error.message)
            };
        case 'DELETE_SUCCESS':
            return {
                ...state,
                success: state.success.filter(success => success !== action.success)
            };
        default:
            return state
    }
}

export default messages