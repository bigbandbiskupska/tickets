import React from 'react';
import autoBind from "react-autobind";
import {connect} from "react-redux";

import './schema.css';
import ReserveSchema2 from "./ReserveSchema2";
import {addError, addSuccess, createTicket} from "../../actions";

class ReserveSchemaPage extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    onBook(user, seats) {
        const {apiKey, addError, addSuccess} = this.props;

        if (Object.keys(seats).length === 0) {
            addError(new Error('Na tiketu nejsou žádná sedadla'));
            return;
        }

        this.setState({
            isSaving: true
        });

        return this.props.createTicket(apiKey, {
            'user': user,
            'seats': Object.keys(seats),
            'note': `${user.name} ${user.surname}`,
            //}).then(ticket => {
            //    return ticket;
            //    return this.props.fetchSeats(this.props.apiKey, this.props.schema.id);
        }).then(seats => addSuccess('Externí rezervace byla úspěšně vytvořena'))
            .catch(error => addError(error))
    }

    render() {
        const {id} = this.props;

        return (
            <ReserveSchema2
                id={id}
                onBook={this.onBook}
            />
        );
    }
}


function mapStateToProps(state, ownProps) {
    return {
        id: parseInt(ownProps.match.params.id, 10),
        apiKey: state.users.users[state.users.currentUser].token,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createTicket(apiKey, ticket) {
            return dispatch(createTicket(apiKey, ticket))
        },
        addError(error) {
            return dispatch(addError(error));
        },
        addSuccess(message) {
            return dispatch(addSuccess(message));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReserveSchemaPage);
