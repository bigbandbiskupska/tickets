import autoBind from "react-autobind";
import get from 'lodash/get';
import React, {Component} from "react";
import DependencyManager from "../DependencyManager";
import {
    cleanTemporaryTicket,
    createTicket,
    deleteFromTemporaryTicket,
    fetchSchema,
    fetchSeat,
    fetchSeats,
    fetchTemporaryTicket
} from "../../actions/index";
import {connect} from "react-redux";
import {addError, addSuccess} from "../../actions";
import Overlay from "../Overlay";

class TemporaryTicket extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
        this.state = {
            isSaving: false
        };
        this.dependencies = [() => this.fetchData()];
    }

    fetchData() {
        return Promise.all([
                this.props.loadTemporaryTicket(),
                this.loadSeats(),
            ]
        )
    }

    loadSeats() {
        const {seatIds, apiKey} = this.props;
        return Promise.all(seatIds.map(id => this.props.fetchSeat(apiKey, id)));
    }

    book() {
        const {user, seats, apiKey} = this.props;
        if (seats.length === 0) {
            return;
        }

        this.setState({
            isSaving: true
        })

        this.props.createTicket(apiKey, {
            'user_id': user.id,
            'seats': seats.map(seat => seat.id),
            'note': `${user.name} ${user.surname}`,
        }).then(ticket => {
            return this.props.fetchSchemaSeats(apiKey, seats.reduce((v, seat) => seat.schema_id, undefined));
        }).then(ticket => {
            return this.props.cleanTemporaryTicket();
        }).then(ticket => {
            this.setState({
                isSaving: false
            });
            return this.props.addSuccess('Sedadla byla úspěšně uložena');
        }).catch(error => {
            this.setState({
                isSaving: false
            });
            return this.props.addError(error)
        })
    }

    renderSeats() {
        const {seats} = this.props;
        const $seats = seats.map(seat => {
            return (
                <li key={seat.id}
                    className="list-group-item row"
                >
                    {seat.schema ? seat.schema.name + ' - ' : null}  Řada {seat.row} sedadlo {seat.col}
                    <span
                        onClick={() => this.props.deleteFromTemporaryTicket(seat.id)}
                        className="float-right btn btn-danger badge"
                    >
                        x
                    </span>
                </li>
            );
        });

        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <ul className="list-group">
                            {$seats}
                        </ul>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <button
                            type="submit"
                            className="btn btn-success"
                            onClick={this.book}
                        >
                            Zarezervovat
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const {date, seats} = this.props;

        return (
            <DependencyManager spinner blocking={this.dependencies}>
                <Overlay show={this.state.isSaving} />
                <h1>Vybraná sedadla</h1>

                {seats.length !== 0 ? (
                    <div>
                        <div>
                            <h2>{date}</h2>
                            {this.renderSeats()}
                        </div>
                    </div>
                ) : (<span>Nemáte vybraná žádná sedadla</span>)}
            </DependencyManager>
        );
    }

}


function mapStateToProps(state, ownProps) {
    if (!state.tickets.temporary) {
        return {};
    }

    const getSeats = (ids) => ids.map(id => get(state, `seats.seats.${id}`)).filter(seat => !!seat).map(seat => ({
        ...seat,
        schema: get(state, `schemas.schemas.${seat.schema_id}`)
    }));

    return {
        seatIds: state.tickets.temporary.seats,
        seats: getSeats(state.tickets.temporary.seats),
        date: state.tickets.temporary.date,
        apiKey: state.users.users[state.users.currentUser].token,
        user: state.users.users[state.users.currentUser],
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loadTemporaryTicket() {
            return dispatch(fetchTemporaryTicket())
        },
        fetchSeat(apiKey, id, options = {}) {
            return dispatch(fetchSeat(apiKey, id, options))
        },
        fetchSchema(apiKey, id, options = {}) {
            return dispatch(fetchSchema(apiKey, id, options))
        },
        fetchSchemaSeats(apiKey, id) {
            return dispatch(fetchSeats(apiKey, id));
        },
        deleteFromTemporaryTicket(seatId) {
            return dispatch(deleteFromTemporaryTicket(seatId))
        },
        cleanTemporaryTicket() {
            return dispatch(cleanTemporaryTicket())
        },
        createTicket(apiKey, ticket) {
            return dispatch(createTicket(apiKey, ticket));
        },
        addError(error) {
            return dispatch(addError(error));
        },
        addSuccess(success) {
            return dispatch(addSuccess(success));
        },

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TemporaryTicket);
