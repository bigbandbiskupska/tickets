const defaultState = {
    schemas: {}
};

const schemas = (state = defaultState, action) => {
    switch (action.type) {
        case 'SCHEMAS_FETCH_SUCCESS':
            return {
                ...state,
                schemas: {
                    ...state.schemas,
                    ...action.schemas,
                }
            };
        case 'SCHEMA_FETCH_SUCCESS':
            return {
                ...state,
                schemas: {
                    ...state.schemas,
                    [action.schema.id]: action.schema,
                }
            };
        case 'SCHEMA_UPDATE_SUCCESS':
            return {
                ...state,
                schemas: {
                    ...state.schemas,
                    [action.schema.id]: action.schema,
                }
            };
        case 'SCHEMA_DELETE_SUCCESS':
            const otherSchemas = { ...state };
            delete otherSchemas.schemas[action.schemaId];
            return {
               schemas: otherSchemas.schemas
            };
        default:
            return state
    }
}

export default schemas