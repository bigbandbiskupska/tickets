const defaultState = {
    tabs: []
};

const tabs = (state = defaultState, action) => {
    switch (action.type) {
        case 'PUT_TAB':
            if(state.tabs.some(tab => tab.id === action.tab.id)) {
                return state;
            }

            return {
                ...state,
                tabs: [
                    ...state.tabs,
                    action.tab
                ]
            };
        case 'DELETE_TAB':
            return {
                ...state,
                tabs: state.tabs.filter(tab => tab.id !== action.id)
            };
        default:
            return state
    }
}

export default tabs