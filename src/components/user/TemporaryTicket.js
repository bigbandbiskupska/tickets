import autoBind from "react-autobind";
import React, {Component} from "react";

export default class TemporaryTicket extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    onBook() {
        const {onBook, seats} = this.props;
        onBook && onBook(seats);
        /*    const {user, seats, apiKey} = this.props;
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
            */
    }

    onDeleteSeat(seat) {
        const {onDeleteSeat} = this.props;
        onDeleteSeat && onDeleteSeat(seat)
    }

    renderSeats() {
        const {seats} = this.props;
        const $seats = seats.map(seat => {
            return (
                <li key={seat.id}
                    className="list-group-item row"
                >
                    {seat.schema ? seat.schema.name + ' - ' : null} Řada {seat.row} sedadlo {seat.col}
                    <span
                        onClick={() => this.onDeleteSeat(seat)}
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
                            onClick={this.onBook}
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

        if (seats.length === 0) {
            return (
                <section>
                    <h1>Vybraná sedadla</h1>
                    <span>Nemáte vybraná žádná sedadla</span>
                </section>
            );
        }

        return (
            <section>
                <h1>Vybraná sedadla</h1>
                <div>
                    <div>
                        <h2>{date}</h2>
                        {this.renderSeats()}
                    </div>
                </div>
            </section>
        );
    }
}