import React from 'react';
import autoBind from "react-autobind";
import {connect} from "react-redux";
import Seat from "../user/Seat";
import {addError, addSuccess, createTicket, fetchSchema, fetchSeats} from '../../actions';

import './schema.css';
import DependencyManager from "../DependencyManager";
import get from "lodash/get";
import Overlay from "../Overlay";

class ReserveSchema extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);
        this.state = {
            isSaving: false,
            name: '',
            surname: '',
            reserved: []
        }
        this.dependencies = [() => this.fetchData(this.props)];
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id !== this.props.match.params.id) {
            this.dependencies = [() => this.fetchData(nextProps)];
        }
    }

    fetchData(props) {
        return Promise.all([
                props.fetchSchema(props.apiKey, parseInt(props.match.params.id, 10)),
                props.fetchSeats(props.apiKey, parseInt(props.match.params.id, 10)),
            ]
        )
    }

    getNextState(seat) {
        switch (seat.state) {
            case Seat.FREE:
                return Seat.RESERVED;
            case Seat.RESERVED:
                return Seat.FREE;
            default:
                return Seat.FREE;
        }
    }

    onMouseSeatIn(seat) {
    }

    onMouseSeatLeave(seat) {
    }

    onMouseSeatClick(clickedSeat) {
        if (clickedSeat.state === Seat.TEMPORARY_RESERVED && this.state.reserved.includes(clickedSeat.id)) {
            this.setState({
                reserved: this.state.reserved.filter(id => id !== clickedSeat.id)
            })
        } else if (clickedSeat.state === Seat.FREE) {
            this.setState({
                reserved: [...this.state.reserved, clickedSeat.id]
            })
        }
    }

    renderSeats() {
        const {schema} = this.props;

        return (
            <table className="table schema">
                <tbody>

                <tr>
                    <td className="schema-control"></td>
                    {schema.seats[0].map((col, i) => (<th key={`header_${i + 1}`}>{i + 1}</th>))}
                    <td className="schema-control">
                    </td>
                </tr>

                {schema.seats.map((row, i) => (
                    <tr key={i + 1}>
                        <th className="schema-control">{i + 1}</th>
                        {row.map((seat, j) => (
                            <Seat
                                key={`${i + 1}${j + 1}`}
                                seat={{
                                    ...seat,
                                    state: this.state.reserved.includes(seat.id) ? Seat.TEMPORARY_RESERVED : seat.state
                                }}
                                onMouseIn={this.onMouseSeatIn}
                                onMouseLeave={this.onMouseSeatLeave}
                                onMouseClick={this.onMouseSeatClick}
                            />
                        ))}
                        <th className="schema-control">{i + 1}</th>
                    </tr>
                ))}

                <tr>
                    <td className="schema-control">
                    </td>
                    {schema.seats[0].map((seat, i) => (<th key={`footer_${i + 1}`}>{i + 1}</th>))}
                    <td className="schema-control"></td>
                </tr>

                </tbody>
            </table>
        );
    }

    onNameChange(event) {
        this.setState({
            name: event.target.value
        })
    }

    onSurnameChange(event) {
        this.setState({
            surname: event.target.value
        })
    }

    onBook(event) {

        if (this.state.reserved.length === 0) {
            return;
        }

        this.setState({
            isSaving: true
        })

        this.props.createTicket(this.props.apiKey, {
            'user': {
                'name': this.state.name,
                'surname': this.state.surname,
            },
            'seats': this.state.reserved,
            'note': `${this.state.name} ${this.state.surname}`,
        }).then(ticket => {
            return this.props.fetchSeats(this.props.apiKey, this.props.schema.id);
        }).then(seats => {
            this.setState({
                reserved: [],
                isSaving: false
            })
            return this.props.addSuccess('Externí rezervace byla úspěšně vytvořena')
        }).catch(error => {
            this.setState({
                isSaving: false
            })
            return this.props.addError(error)
        })
    }

    render() {
        const {schema} = this.props;

        return (
            <DependencyManager spinner blocking={this.dependencies}>
                <Overlay show={this.state.isSaving} />
                <section>
                    <div className="row">
                        <label htmlFor="name">
                            Jméno:
                        </label>
                        <input name="name" type="text" className="form-control" value={this.state.name}
                               onChange={this.onNameChange}/>
                    </div>

                    <div className="row">
                        <label htmlFor="surname">
                            Příjmení:
                        </label>
                        <input name="surname" type="text" className="form-control" value={this.state.surname}
                               onChange={this.onSurnameChange}/>
                    </div>

                    <div className="row">
                        {schema && schema.seats.length && this.renderSeats()}
                    </div>

                    <div className="row">
                        <button className="btn btn-success" onClick={this.onBook}>Rezervovat</button>
                    </div>

                </section>
            </DependencyManager>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const id = parseInt(ownProps.match.params.id, 10);
    if (!state.schemas.schemas[id] || !state.schemas.schemas[id].seats) {
        return {
            schema: {
                seats: [],
            },
            apiKey: state.users.users[state.users.currentUser].token,
        };
    }

    const seats = state.schemas.schemas[id].seats.map(id => state.seats.seats[id]).filter(seat => !!seat).map(seat => ({
        ...seat,
        state: get(state.seats.seatsState, seat.id,
            seat.state === Seat.RESERVED && state.tickets.userSeats[state.users.currentUser] && state.tickets.userSeats[state.users.currentUser].includes(seat.id) ? Seat.MY : seat.state
        )
    }));

    let bucketedSeats = [];
    seats.forEach(seat => {
        if (!bucketedSeats[seat.y - 1]) {
            bucketedSeats[seat.y - 1] = []
        }
        if(!bucketedSeats[seat.y - 1][seat.x - 1]) {
            bucketedSeats[seat.y - 1][seat.x - 1] = seat
        }
    });


    return {
        schema: {
            ...state.schemas.schemas[id],
            seats: bucketedSeats,
        },
        apiKey: state.users.users[state.users.currentUser].token,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchSchema(apiKey, schemaId) {
            return dispatch(fetchSchema(apiKey, schemaId))
        },
        fetchSeats(apiKey, schemaId) {
            return dispatch(fetchSeats(apiKey, schemaId))
        },
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

export default connect(mapStateToProps, mapDispatchToProps)(ReserveSchema);
