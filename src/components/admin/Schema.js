import React from 'react';
import get from 'lodash/get';
import DependencyManager from "../DependencyManager";
import autoBind from "react-autobind";
import {fetchSchema, fetchSeats, updateSchema} from "../../actions/index";
import {connect} from "react-redux";
import Seat from "./Seat";
import {addError, addSuccess} from "../../actions";
import Overlay from "../Overlay";

class Schema extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);
        this.dependencies = [() => this.fetchData(parseInt(this.props.match.params.id, 10))];
        this.state = {
            isSaving: false,
            price: props.schema.price,
            name: props.schema.name,
            limit: props.schema.limit,
            seats: props.schema.seats,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id !== this.props.match.params.id) {
            this.dependencies = [() => this.fetchData(parseInt(nextProps.props.match.params.id, 10))];
        }
        this.setState({
            price: nextProps.schema.price,
            name: nextProps.schema.name,
            limit: nextProps.schema.limit,
            seats: nextProps.schema.seats,
        });
    }

    fetchData(id) {
        return Promise.all([
                this.props.loadSchema(this.props.apiKey, id),
                this.props.loadSeats(this.props.apiKey, id),
            ]
        )
    }

    createNewSeat(x, y, state = Seat.FREE, price = 0) {
        return {
            price: price,
            col: x,
            row: y,
            x: x,
            y: y,
            state: state
        }
    }

    getNextState(seat) {
        switch (seat.state) {
            case Seat.FREE:
                return Seat.RESERVED;
            case Seat.RESERVED:
                return Seat.WALL;
            case Seat.WALL:
                return Seat.FREE;
            default:
                return Seat.FREE;
        }
    }

    onMouseSeatIn(seat) {
    }

    onMouseSeatOut(seat) {
    }

    onMouseSeatClick(clickedSeat) {
        this.setState({
            seats: this.state.seats.map(row => {
                return row.map(seat => {
                    if (seat === clickedSeat) {
                        return {
                            ...seat,
                            state: this.getNextState(seat)
                        };
                    }
                    return seat;
                })
            })
        })
    }

    onAddRow() {
        this.setState({
            ...this.state,
            seats: [
                ...this.state.seats,
                this.state.seats[this.state.seats.length - 1].map(seat => this.createNewSeat(seat.x, this.state.seats.length + 1, seat.state, seat.price))
            ]
        });
    }

    onAddCol() {
        this.setState({
            ...this.state,
            seats: this.state.seats.map((row, i) => {
                return [
                    ...row,
                    this.createNewSeat(row.length + 1, i + 1, row[row.length - 1].state, row[row.length - 1].price)
                ];
            })
        });
    }

    renderStats() {
        const stats = {
            capacity: 0,
            free: 0,
            reserved: 0,
            price: 0,
        }
        this.state.seats.forEach(row => {
            row.forEach(seat => {
                stats.capacity += seat.state !== Seat.WALL;
                stats.free += seat.state === Seat.FREE;
                stats.reserved += seat.state === Seat.RESERVED;
                stats.price += seat.state !== Seat.WALL ? seat.price : 0;
            });
        })
        return (
            <table className="table">
                <tbody>
                <tr>
                    <th>Kapacita</th>
                    <td>{stats.capacity}</td>
                </tr>
                <tr>
                    <th>Obsazeno</th>
                    <td>{stats.reserved}</td>
                </tr>
                <tr>
                    <th>Volná místa</th>
                    <td>{stats.free}</td>
                </tr>
                <tr>
                    <th>Celková cena</th>
                    <td>{stats.price}</td>
                </tr>
                </tbody>
            </table>
        )
    }

    onNameChange(event) {
        this.setState({
            name: event.target.value
        })
    }

    onLimitChange(event) {
        this.setState({
            limit: event.target.value
        })
    }

    onPriceChange(event) {
        const price = parseInt(event.target.value, 10) || 0;
        this.setState({
            price: price,
            seats: this.state.seats.map(row => row.map(seat => ({
                ...seat,
                price: seat.price === this.state.price ? price : seat.price
            })))
        })
    }

    onUpdate(event) {
        this.setState({
            isSaving: true,
        })
        this.props.updateSchema(this.props.apiKey, this.props.schema.id, {
            'name': this.state.name,
            'price': this.state.price,
            'limit': this.state.limit,
            'seats': this.state.seats,
        }).then(schema => {
            return this.props.loadSeats(this.props.apiKey, schema.id);
        }).then(result => {
            this.props.addSuccess('Schéma bylo úspěšně uloženo')
            this.setState({
                isSaving: false,
            })
            return result;
        }).catch(error => {
            this.setState({
                isSaving: false,
            })
            return this.props.addError(error)
        });
    }


    renderSeats() {
        const {seats} = this.state;

        return (
            <table className="table schema">
                <tbody>

                <tr>
                    <td className="schema-control"></td>
                    {seats[0].map((col, i) => (<th key={`header_${i + 1}`}>{i + 1}</th>))}
                    <td className="schema-control">
                        <button className="btn btn-success form-control" onClick={this.onAddCol}>
                            +
                        </button>
                    </td>
                </tr>

                {seats.map((row, i) => (
                    <tr key={i + 1}>
                        <th className="schema-control">{i + 1}</th>
                        {row.map((seat, j) => (
                            <Seat
                                key={`${i + 1}${j + 1}`}
                                seat={seat}
                                onMouseIn={this.onMouseSeatIn}
                                onMouseOut={this.onMouseSeatOut}
                                onMouseClick={this.onMouseSeatClick}
                            />
                        ))}
                        <th className="schema-control">{i + 1}</th>
                    </tr>
                ))}

                <tr>
                    <td className="schema-control">
                        <button className="btn btn-success form-control" onClick={this.onAddRow}>
                            +
                        </button>
                    </td>
                    {seats[0].map((seat, i) => (<th key={`footer_${i + 1}`}>{i + 1}</th>))}
                    <td className="schema-control"></td>
                </tr>

                </tbody>
            </table>
        );
    }


    render() {
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
                        <label htmlFor="limit">
                            Limit sedadel:
                        </label>
                        <input name="limit" type="text" className="form-control" value={this.state.limit}
                               onChange={this.onLimitChange}/>
                    </div>

                    <div className="row">
                        <label htmlFor="price">
                            Cena jednoho lístku:
                        </label>
                        <input name="price" type="text" className="form-control" value={this.state.price}
                               onChange={this.onPriceChange}/>
                    </div>

                    <div className="row schema-container">
                        {this.state.seats && this.state.seats[0] && this.renderSeats()}
                    </div>

                    <div className="row">
                        {this.state.seats && this.state.seats[0] && this.renderStats()}
                    </div>

                    <div className="row">
                        <button className="btn btn-success" onClick={this.onUpdate}>Uložit</button>
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
                seatsState: [],
            },
            apiKey: state.users.users[state.users.currentUser].token,
        };
    }

    const seats = state.schemas.schemas[id].seats.map(seat_id => state.seats.seats[seat_id]).filter(seat => !!seat).map(seat => ({
        ...seat,
        state: get(state.seats.seatsState, seat.id,
            seat.state === Seat.RESERVED && state.tickets.userSeats[state.users.currentUser.id] && state.tickets.userSeats[state.users.currentUser.id].includes(seat.id) ? Seat.MY : seat.state
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
        loadSeats(apiKey, schemaId) {
            return dispatch(fetchSeats(apiKey, schemaId))
        },
        loadSchema(apiKey, schemaId) {
            return dispatch(fetchSchema(apiKey, schemaId))
        },
        updateSchema(apiKey, schemaId, schema) {
            return dispatch(updateSchema(apiKey, schemaId, schema));
        },
        addError(error) {
            return dispatch(addError(error));
        },
        addSuccess(message) {
            return dispatch(addSuccess(message));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Schema);
