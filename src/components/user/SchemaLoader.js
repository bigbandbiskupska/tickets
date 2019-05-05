import React from 'react';
import get from 'lodash/get';
import DependencyManager from "../DependencyManager";
import autoBind from "react-autobind";
import {addToTemporaryTicket, deleteFromTemporaryTicket, fetchSchema, fetchSeats} from "../../actions/index";
import {connect} from "react-redux";
import Seat from "./Seat";
import {putTab} from "../../actions";
import Schema from "./Schema";

class SchemaLoader extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);
        this.dependencies = [() => this.fetchData(props)];
    }

    fetchData(props) {
        return Promise.all([
                props.loadSchema(props.apiKey, props.id, {forceLoad: true}).then(schema => this.props.saveSchema(schema)),
                props.loadSeats(props.apiKey, props.id),
            ]
        )
    }

    onMouseSeatClick(seat) {
        const {onMouseSeatClick} = this.props;
        onMouseSeatClick && onMouseSeatClick(seat);
    }

    render() {
        const {schema, seats} = this.props;

        return (
            <DependencyManager spinner blocking={this.dependencies}>
                <Schema
                    schema={schema}
                    seats={seats}
                    onMouseSeatClick={this.onMouseSeatClick}
                />
            </DependencyManager>
        );
    }
}


function mapStateToProps(state, ownProps) {
    const {id: schemaId} = ownProps;

    if (!state.schemas.schemas[schemaId] || !state.schemas.schemas[schemaId].seats) {
        return {
            id: ownProps.id,
            schema: undefined,
            seats: [],
            apiKey: state.users.users[state.users.currentUser].token
        };
    }

    const getSeats = () => {
        const length = state.schemas.schemas[schemaId].seats.length
        const filtered = state.schemas.schemas[schemaId].seats.map(seat_id => {
            return state.seats.seats[seat_id]
        }).filter(seat => !!seat);

        if (length !== filtered.length) {
            return []
        }

        return filtered.map(seat => ({
            ...seat,
            state: get(state.seats.seatsState, seat.id,
                seat.state === Seat.RESERVED && state.users.userSeats[state.users.currentUser] && state.users.userSeats[state.users.currentUser].includes(seat.id) ? Seat.MY : seat.state
            )
        }))
    };

    return {
        id: ownProps.id,
        schema: state.schemas.schemas[schemaId],
        seats: getSeats(),
        apiKey: state.users.users[state.users.currentUser].token
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loadSeats(apiKey, schemaId) {
            return dispatch(fetchSeats(apiKey, schemaId))
        },
        loadSchema(apiKey, schemaId, {forceLoad = false} = {}) {
            return dispatch(fetchSchema(apiKey, schemaId, {forceLoad}))
        },
        saveSchema(schema) {
            return dispatch(putTab({
                id: `schema_${schema.id}`,
                index: 1,
                url: `/schema/${schema.id}`,
                name: schema.name
            }))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SchemaLoader);
