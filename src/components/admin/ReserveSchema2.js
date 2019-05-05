import React from 'react';
import autoBind from "react-autobind";


import omit from 'lodash/omit';
import './schema.css';
import SchemaLoader from "../user/SchemaLoader";
import TemporaryTicket from "../user/TemporaryTicket";

export default class ReserveSchema2 extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);
        this.state = {
            isSaving: false,
            name: '',
            surname: '',
            // seatId => seat
            reserved: {}
        }
    }

    onMouseSeatClick(seat) {
        if (seat.id in this.state.reserved) {
            this.setState(prevState => ({
                reserved: omit(prevState.reserved, seat.id)
            }))
        } else {
            this.setState(prevState => ({
                reserved: {
                    ...prevState.reserved,
                    [seat.id]: seat
                }
            }))
        }
    }

    onDeleteSeat(seat) {
        this.setState(prevState => ({
            reserved: omit(prevState.reserved, seat.id)
        }))
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

    onBook(seats) {
        const {onBook} = this.props;
        const {name, surname, reserved} = this.state;

        if (!onBook) {
            return;
        }

        const user = {name, surname};

        onBook(user, reserved)
            .then(seats => {
                this.setState({
                    reserved: {},
                    isSaving: false
                });
                return seats;
            }).catch(error => {
            this.setState({
                isSaving: false
            });
            throw error;
        });
    }

    render() {
        const {id} = this.props;
        const {reserved} = this.state;

        return (
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

                <SchemaLoader
                    id={id}
                    onMouseSeatClick={this.onMouseSeatClick}
                />

                <TemporaryTicket
                    seats={Object.values(reserved)}
                    onDeleteSeat={this.onDeleteSeat}
                    onBook={this.onBook}
                />

            </section>
        );
    }

}