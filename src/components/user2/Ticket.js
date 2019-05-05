import autoBind from "react-autobind";
import React, {Component} from "react";
import {addError, addSuccess, fetchTicket, fetchTicketSeats, putTab} from "../../actions";
import {connect} from "react-redux";
import DependencyManager from "../DependencyManager";
import BooleanBadge from "../BooleanBadge";
import {Redirect} from "react-router-dom";

const Seat = ({schema, seat}) => {
    return (
        <tr>
            <td>{seat.id}</td>
            <td>{schema.name}</td>
            <td>{seat.row}</td>
            <td>{seat.col}</td>
            <td>{seat.price}</td>
        </tr>
    );
}

class Ticket extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
        this.dependencies = [() => this.fetchData(parseInt(this.props.match.params.id, 10))];
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id !== this.props.match.params.id) {
            this.dependencies = [() => this.fetchData(parseInt(nextProps.match.params.id, 10))];
        }
    }

    fetchData(id) {
        return this.props.fetchTicket(this.props.apiKey, id)
            .then(ticket => {
                return this.props.saveTicket(ticket)
                    .then(() => Promise.resolve(ticket))
            })
            .then(ticket =>  this.props.fetchSeats(this.props.apiKey, ticket.id))
            .catch(error => this.props.addError(error))
    }

    render() {
        const {ticket, user} = this.props;
        console.log(ticket, user)
        return (
            <DependencyManager spinner blocking={this.dependencies}>
                {ticket && (
                    <div>
                        {ticket.user_id !== user.id && !user.roles.includes('administrator') ? (
                            <Redirect to={'/tickets'} />
                        )
                            : null}
                        Tato objednávka byla vytvořena {ticket.created_at.toLocaleString()}.
                        Aktuálně je označena jako <BooleanBadge enabled={ticket.confirmed} yes="zaplacená" no="nezaplacená" />.
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th>Id</th>
                                <th>Akce</th>
                                <th>Řada</th>
                                <th>Sedadlo</th>
                                <th>Cena</th>
                            </tr>
                            </thead>
                            <tbody>
                            {ticket.seats && ticket.seats.map(seat => {
                                return (
                                    <Seat key={seat.id} schema={ticket.schema} seat={seat} />
                                );
                            })}
                            </tbody>
                            <tfoot>
                            <tr>
                                <th colSpan="4">Celková cena</th>
                                <th>{ticket.seats && ticket.seats.reduce((c, seat) => seat.price + c, 0)}</th>
                            </tr>
                            {!ticket.confirmed ? (
                                <tr className="table-danger">
                                    <th colSpan="4">Zbývá zaplatit</th>
                                    <th>{ticket.seats && ticket.seats.reduce((c, seat) => seat.price + c, 0)}</th>
                                </tr>
                            ) : (
                                <tr className="table-success">
                                    <th colSpan="4">Zaplaceno</th>
                                    <th>{ticket.seats && ticket.seats.reduce((c, seat) => seat.price + c, 0)}</th>
                                </tr>
                            )}
                            </tfoot>
                        </table>
                        {!ticket.confirmed ? (
                            <div className="text-center">
                                <p>Zaplatit můžete hotově na příští zkoušce nebo elektronicky převodem na účet pomocí QR platby.</p>
                                <img
                                    src={`http://pay.bigbandbiskupska.cz/ss/1/vs/${ticket.id}/${ticket.seats && ticket.seats.reduce((c, seat) => seat.price + c, 0)}/Objednavka%20${ticket.id}%20-%20${ticket.seats && ticket.seats.length}%20sedadel`}
                                    alt={`Zaplatit ${ticket.seats && ticket.seats.reduce((c, seat) => seat.price + c, 0)} přes QR platbu`}
                                />
                                <p>
                                    Tento účet patří administrátorovi aplikace a vaší platbu předá organizátorovi akce.
                                    Pokud s tím nesouhlasíte, zaplaťte prosím lístky osobně v hotovosti.
                                </p>
                            </div>
                        ) : null}
                    </div>
                )}
            </DependencyManager>
        );
    }
};

function mapStateToProps(state, ownProps) {
    const id = parseInt(ownProps.match.params.id, 10);
    if (!state.tickets.tickets[id]) {
        return {
            ticket: undefined,
            apiKey: state.users.users[state.users.currentUser].token,
        };
    }

    return {
        ticket: {
            ...state.tickets.tickets[id],
            seats: state.tickets.tickets[id].seats.map(seatId => state.seats.seats[seatId]).filter(seat => !!seat),
        },
        user: state.users.users[state.users.currentUser],
        apiKey: state.users.users[state.users.currentUser].token,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchTicket(apiKey, ticketId) {
            return dispatch(fetchTicket(apiKey, ticketId))
        },
        fetchSeats(apiKey, ticketId) {
            return dispatch(fetchTicketSeats(apiKey, ticketId))
        },
        saveTicket(ticket) {
            return dispatch(putTab({id: `ticket_${ticket.id}`, index: 3, url: `/ticket/${ticket.id}`, name: `Objednávka ${ticket.id}`}))
        },
        addSuccess(success) {
            return dispatch(addSuccess(success));
        },
        addError(error) {
            return dispatch(addError(error));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Ticket);