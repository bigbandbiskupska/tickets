import React from 'react';
import autoBind from "react-autobind";
import {connect} from "react-redux";
import Seat from "./Seat";
import {addError, addSuccess, createSchema} from '../../actions';

import './schema.css';
import Overlay from "../Overlay";
import {Redirect} from "react-router-dom";

class NewSchema extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);
        this.state = {
            isSaving: false,
            name: '',
            price: 0,
            limit: 10,
            seats: [
                [
                    this.createNewSeat(1, 1, Seat.FREE, 0)
                ]
            ],
        }
        //this.state = {
        //    ...this.state,
         //   seats: JSON.parse('[[{"price":200,"col":1,"row":1,"x":1,"y":1,"state":0},{"price":200,"col":2,"row":1,"x":2,"y":1,"state":0},{"price":200,"col":3,"row":1,"x":3,"y":1,"state":0},{"price":200,"col":4,"row":1,"x":4,"y":1,"state":0},{"price":200,"col":5,"row":1,"x":5,"y":1,"state":0},{"price":200,"col":6,"row":1,"x":6,"y":1,"state":0},{"price":200,"col":7,"row":1,"x":7,"y":1,"state":1},{"price":200,"col":8,"row":1,"x":8,"y":1,"state":1},{"price":200,"col":9,"row":1,"x":9,"y":1,"state":1},{"price":200,"col":10,"row":1,"x":10,"y":1,"state":1},{"price":200,"col":11,"row":1,"x":11,"y":1,"state":0},{"price":200,"col":12,"row":1,"x":12,"y":1,"state":0},{"price":200,"col":13,"row":1,"x":13,"y":1,"state":0},{"price":200,"col":14,"row":1,"x":14,"y":1,"state":0},{"price":200,"col":15,"row":1,"x":15,"y":1,"state":0}],[{"price":200,"col":1,"row":2,"x":1,"y":2,"state":0},{"price":200,"col":2,"row":2,"x":2,"y":2,"state":0},{"price":200,"col":3,"row":2,"x":3,"y":2,"state":0},{"price":200,"col":4,"row":2,"x":4,"y":2,"state":0},{"price":200,"col":5,"row":2,"x":5,"y":2,"state":1},{"price":200,"col":6,"row":2,"x":6,"y":2,"state":1},{"price":200,"col":7,"row":2,"x":7,"y":2,"state":1},{"price":200,"col":8,"row":2,"x":8,"y":2,"state":1},{"price":200,"col":9,"row":2,"x":9,"y":2,"state":1},{"price":200,"col":10,"row":2,"x":10,"y":2,"state":1},{"price":200,"col":11,"row":2,"x":11,"y":2,"state":1},{"price":200,"col":12,"row":2,"x":12,"y":2,"state":1},{"price":200,"col":13,"row":2,"x":13,"y":2,"state":0},{"price":200,"col":14,"row":2,"x":14,"y":2,"state":0},{"price":200,"col":15,"row":2,"x":15,"y":2,"state":0}],[{"price":200,"col":1,"row":3,"x":1,"y":3,"state":0},{"price":200,"col":2,"row":3,"x":2,"y":3,"state":0},{"price":200,"col":3,"row":3,"x":3,"y":3,"state":0},{"price":200,"col":4,"row":3,"x":4,"y":3,"state":1},{"price":200,"col":5,"row":3,"x":5,"y":3,"state":1},{"price":200,"col":6,"row":3,"x":6,"y":3,"state":1},{"price":200,"col":7,"row":3,"x":7,"y":3,"state":1},{"price":200,"col":8,"row":3,"x":8,"y":3,"state":1},{"price":200,"col":9,"row":3,"x":9,"y":3,"state":1},{"price":200,"col":10,"row":3,"x":10,"y":3,"state":1},{"price":200,"col":11,"row":3,"x":11,"y":3,"state":1},{"price":200,"col":12,"row":3,"x":12,"y":3,"state":1},{"price":200,"col":13,"row":3,"x":13,"y":3,"state":1},{"price":200,"col":14,"row":3,"x":14,"y":3,"state":0},{"price":200,"col":15,"row":3,"x":15,"y":3,"state":0}],[{"price":200,"col":1,"row":4,"x":1,"y":4,"state":0},{"price":200,"col":2,"row":4,"x":2,"y":4,"state":1},{"price":200,"col":3,"row":4,"x":3,"y":4,"state":1},{"price":200,"col":4,"row":4,"x":4,"y":4,"state":1},{"price":200,"col":5,"row":4,"x":5,"y":4,"state":1},{"price":200,"col":6,"row":4,"x":6,"y":4,"state":1},{"price":200,"col":7,"row":4,"x":7,"y":4,"state":1},{"price":200,"col":8,"row":4,"x":8,"y":4,"state":1},{"price":200,"col":9,"row":4,"x":9,"y":4,"state":1},{"price":200,"col":10,"row":4,"x":10,"y":4,"state":1},{"price":200,"col":11,"row":4,"x":11,"y":4,"state":1},{"price":200,"col":12,"row":4,"x":12,"y":4,"state":1},{"price":200,"col":13,"row":4,"x":13,"y":4,"state":1},{"price":200,"col":14,"row":4,"x":14,"y":4,"state":1},{"price":200,"col":15,"row":4,"x":15,"y":4,"state":0}],[{"price":200,"col":1,"row":5,"x":1,"y":5,"state":1},{"price":200,"col":2,"row":5,"x":2,"y":5,"state":1},{"price":200,"col":3,"row":5,"x":3,"y":5,"state":1},{"price":200,"col":4,"row":5,"x":4,"y":5,"state":1},{"price":200,"col":5,"row":5,"x":5,"y":5,"state":1},{"price":200,"col":6,"row":5,"x":6,"y":5,"state":1},{"price":200,"col":7,"row":5,"x":7,"y":5,"state":1},{"price":200,"col":8,"row":5,"x":8,"y":5,"state":1},{"price":200,"col":9,"row":5,"x":9,"y":5,"state":1},{"price":200,"col":10,"row":5,"x":10,"y":5,"state":1},{"price":200,"col":11,"row":5,"x":11,"y":5,"state":1},{"price":200,"col":12,"row":5,"x":12,"y":5,"state":1},{"price":200,"col":13,"row":5,"x":13,"y":5,"state":1},{"price":200,"col":14,"row":5,"x":14,"y":5,"state":1},{"price":200,"col":15,"row":5,"x":15,"y":5,"state":1}],[{"price":200,"col":1,"row":6,"x":1,"y":6,"state":1},{"price":200,"col":2,"row":6,"x":2,"y":6,"state":1},{"price":200,"col":3,"row":6,"x":3,"y":6,"state":1},{"price":200,"col":4,"row":6,"x":4,"y":6,"state":1},{"price":200,"col":5,"row":6,"x":5,"y":6,"state":1},{"price":200,"col":6,"row":6,"x":6,"y":6,"state":1},{"price":200,"col":7,"row":6,"x":7,"y":6,"state":1},{"price":200,"col":8,"row":6,"x":8,"y":6,"state":1},{"price":200,"col":9,"row":6,"x":9,"y":6,"state":1},{"price":200,"col":10,"row":6,"x":10,"y":6,"state":1},{"price":200,"col":11,"row":6,"x":11,"y":6,"state":1},{"price":200,"col":12,"row":6,"x":12,"y":6,"state":1},{"price":200,"col":13,"row":6,"x":13,"y":6,"state":1},{"price":200,"col":14,"row":6,"x":14,"y":6,"state":1},{"price":200,"col":15,"row":6,"x":15,"y":6,"state":1}],[{"price":200,"col":1,"row":7,"x":1,"y":7,"state":1},{"price":200,"col":2,"row":7,"x":2,"y":7,"state":1},{"price":200,"col":3,"row":7,"x":3,"y":7,"state":1},{"price":200,"col":4,"row":7,"x":4,"y":7,"state":1},{"price":200,"col":5,"row":7,"x":5,"y":7,"state":1},{"price":200,"col":6,"row":7,"x":6,"y":7,"state":1},{"price":200,"col":7,"row":7,"x":7,"y":7,"state":1},{"price":200,"col":8,"row":7,"x":8,"y":7,"state":1},{"price":200,"col":9,"row":7,"x":9,"y":7,"state":1},{"price":200,"col":10,"row":7,"x":10,"y":7,"state":1},{"price":200,"col":11,"row":7,"x":11,"y":7,"state":1},{"price":200,"col":12,"row":7,"x":12,"y":7,"state":1},{"price":200,"col":13,"row":7,"x":13,"y":7,"state":1},{"price":200,"col":14,"row":7,"x":14,"y":7,"state":1},{"price":200,"col":15,"row":7,"x":15,"y":7,"state":1}],[{"price":200,"col":1,"row":8,"x":1,"y":8,"state":1},{"price":200,"col":2,"row":8,"x":2,"y":8,"state":1},{"price":200,"col":3,"row":8,"x":3,"y":8,"state":1},{"price":200,"col":4,"row":8,"x":4,"y":8,"state":1},{"price":200,"col":5,"row":8,"x":5,"y":8,"state":1},{"price":200,"col":6,"row":8,"x":6,"y":8,"state":1},{"price":200,"col":7,"row":8,"x":7,"y":8,"state":1},{"price":200,"col":8,"row":8,"x":8,"y":8,"state":1},{"price":200,"col":9,"row":8,"x":9,"y":8,"state":1},{"price":200,"col":10,"row":8,"x":10,"y":8,"state":1},{"price":200,"col":11,"row":8,"x":11,"y":8,"state":1},{"price":200,"col":12,"row":8,"x":12,"y":8,"state":1},{"price":200,"col":13,"row":8,"x":13,"y":8,"state":1},{"price":200,"col":14,"row":8,"x":14,"y":8,"state":1},{"price":200,"col":15,"row":8,"x":15,"y":8,"state":1}],[{"price":200,"col":1,"row":9,"x":1,"y":9,"state":1},{"price":200,"col":2,"row":9,"x":2,"y":9,"state":1},{"price":200,"col":3,"row":9,"x":3,"y":9,"state":1},{"price":200,"col":4,"row":9,"x":4,"y":9,"state":1},{"price":200,"col":5,"row":9,"x":5,"y":9,"state":1},{"price":200,"col":6,"row":9,"x":6,"y":9,"state":1},{"price":200,"col":7,"row":9,"x":7,"y":9,"state":0},{"price":200,"col":8,"row":9,"x":8,"y":9,"state":0},{"price":200,"col":9,"row":9,"x":9,"y":9,"state":0},{"price":200,"col":10,"row":9,"x":10,"y":9,"state":1},{"price":200,"col":11,"row":9,"x":11,"y":9,"state":1},{"price":200,"col":12,"row":9,"x":12,"y":9,"state":1},{"price":200,"col":13,"row":9,"x":13,"y":9,"state":1},{"price":200,"col":14,"row":9,"x":14,"y":9,"state":1},{"price":200,"col":15,"row":9,"x":15,"y":9,"state":1}]]')
        //}
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

    renderStats() {
        const stats = {
            capacity: 0,
            free: 0,
            reserved: 0
        }
        this.state.seats.forEach(row => {
            row.forEach(seat => {
                stats.capacity += seat.state !== Seat.WALL;
                stats.free += seat.state === Seat.FREE;
                stats.reserved += seat.state === Seat.RESERVED;
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

    onCreate(event) {
        this.setState({
            isSaving: true
        })
        this.props.createSchema(this.props.apiKey, {
            'name': this.state.name,
            'price': this.state.price,
            'limit': this.state.limit,
            'seats': this.state.seats,
        }).then(schema => {
            this.setState({
                isSaving: false,
                schemaId: schema.id,
            })

            return this.props.addSuccess('Schéma bylo úspěšně uloženo')
        }).catch(error => {
            this.setState({
                isSaving: false
            })
            return this.props.addError(error)
        });
    }

    render() {
        if(this.state.schemaId) {
            return (<Redirect to={`/admin/schema/${this.state.schemaId}`} />)
        }

        return (
            <section>
                <Overlay show={this.state.isSaving} />
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
                    {this.renderSeats()}
                </div>

                <div className="row">
                    {this.renderStats()}
                </div>

                <div className="row">
                    <button className="btn btn-success" onClick={this.onCreate}>Vytvořit</button>
                </div>

            </section>
        );
    }
}

function mapStateToProps(state) {
    return {
        apiKey: state.users.users[state.users.currentUser].token,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createSchema(apiKey, schema) {
            return dispatch(createSchema(apiKey, schema))
        },
        addError(error) {
            return dispatch(addError(error));
        },
        addSuccess(message) {
            return dispatch(addSuccess(message));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewSchema);
