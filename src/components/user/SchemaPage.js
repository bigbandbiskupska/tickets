import React from 'react';
import autoBind from "react-autobind";
import {connect} from "react-redux";
import SchemaLoader from "./SchemaLoader";
import {addToTemporaryTicket, deleteFromTemporaryTicket, putTab} from "../../actions";
import Seat from "./Seat";

class SchemaPage extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    onMouseSeatClick(seat) {
        if (seat.state === Seat.FREE) {
            this.props.addToTemporaryTicket(seat.id)
        } else if (seat.state === Seat.TEMPORARY_RESERVED) {
            this.props.deleteFromTemporaryTicket(seat.id);
        }
    }


    render() {
        const {id} = this.props;

        return (
            <SchemaLoader
                id={id}
                onMouseSeatClick={this.onMouseSeatClick}
            />
        );
    }
}


function mapStateToProps(state, ownProps) {
    return {
        id: parseInt(ownProps.match.params.id, 10)
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addToTemporaryTicket(seatId) {
            return dispatch(addToTemporaryTicket(seatId))
        },
        deleteFromTemporaryTicket(seatId) {
            return dispatch(deleteFromTemporaryTicket(seatId))
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


export default connect(mapStateToProps, mapDispatchToProps)(SchemaPage);
