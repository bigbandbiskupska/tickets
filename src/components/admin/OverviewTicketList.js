import React, {Component} from 'react';
import autoBind from 'react-autobind';
import {connect} from 'react-redux';
import classnames from 'classnames';
import DependencyManager from "../DependencyManager";
import {
    addError,
    fetchSchema,
    fetchTickets,
    fetchTicketSeats,
    fetchTicketsForUser,
    fetchUser,
    fetchUsers
} from "../../actions";

class Ticket extends React.Component {

    render() {
        const {name, seats} = this.props;

        return (
            <div>
                <h3>{name}</h3>
                {seats ? (
                    Object.keys(seats).sort().map(row => (
                        <span key={row}>
                                    <dl>
                                    <dt className="">Řada {row}:{' '}</dt>
                                        {seats[row].sort((s1, s2) => s1.col - s2.col).map(seat => (
                                            <dd key={seat.id}
                                                className="badge badge-success">S{seat.col}</dd>
                                        ))}
                                    </dl>
                                </span>
                    ))
                ) : null}
            </div>
        );
    }
}


class User extends React.Component {

    constructor(props) {
        super(props)
        autoBind(this)
        this.state = {
            visible: false,
        }
        this.dependencies = [() => this.fetchData(props)];
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.id !== this.props.id) {
            this.dependencies = [() => this.fetchData(nextProps)];
        }
    }

    fetchData(props) {
        const getTickets = (tickets) => Object.keys(tickets).map(id => tickets[id]);
        return props.fetchTicketsForUser(props.apiKey, props.id)
            .then(tickets => Promise.all(getTickets(tickets).map(ticket => props.fetchTicketSeats(props.apiKey, ticket.id))))
            .catch(error => props.addError(error));
    }

    toggle() {
        this.setState({
            visible: !this.state.visible
        })
    }

    render() {
        const {name, surname, schemas, seatCount, ticketCount} = this.props;

        return (
            <div>
                <div className="card">
                    <div className="card-header">
                        <h4 className="float-left">{name} {surname}
                            {' '}<small>({ticketCount} objednávek - {seatCount} sedadel)</small>
                        </h4>
                        <button
                            className="btn btn-info float-right"
                            onClick={this.toggle}
                        >
                            Zobrazit
                        </button>
                    </div>
                    <div className={classnames({
                        'd-none': !this.state.visible,
                        'card-body': true
                    })}
                    >
                        {this.state.visible ? (
                            <DependencyManager spinner inline blocking={this.dependencies}>
                                {Object.keys(schemas).sort((a, b) => a.localeCompare(b)).map(name => (
                                    <Ticket key={name} name={name} seats={schemas[name]}/>
                                ))}
                            </DependencyManager>
                        ) : null}
                    </div>
                </div>

                <hr/>
            </div>
        );
    }
}

function mapStateToProps1(state, ownProps) {

    const schemas = {};

    Object.entries(ownProps.data).forEach(([name, tickets]) => {
        if (!schemas[name]) {
            schemas[name] = {}
        }

        tickets.map(ticket => ({
            ...ticket,
            seats: ticket.seats.map(id => state.seats.seats[id]).filter(seat => !!seat)
        })).forEach(ticket => {
            ticket.seats.forEach(seat => {
                if (!schemas[name][seat.row]) {
                    schemas[name][seat.row] = []
                }
                schemas[name][seat.row].push(seat)
            })
        })
    });


    return {
        schemas,
        ticketCount: Object.values(ownProps.data).map(tickets => tickets.length).reduce((a, c) => a + c, 0),
        seatCount: Object.values(ownProps.data).map(tickets => tickets.map(ticket => ticket.seats.length).reduce((a, c) => a + c, 0)).reduce((a, c) => a + c, 0),
        apiKey: state.users.users[state.users.currentUser].token,
    }
}

function mapDispatchToProps1(dispatch) {
    return {
        fetchUser(apiKey, userId) {
            return dispatch(fetchUser(apiKey, userId))
        },
        fetchTicketsForUser(apiKey, userId) {
            return dispatch(fetchTicketsForUser(apiKey, userId))
        },
        fetchTicketSeats(apiKey, ticketId) {
            return dispatch(fetchTicketSeats(apiKey, ticketId));
        },
        fetchSchema(apiKey, schemaId) {
            return dispatch(fetchSchema(apiKey, schemaId));
        },
        addError(error) {
            return dispatch(addError(error))
        }
    }
}

User = connect(mapStateToProps1, mapDispatchToProps1)(User);

class OverviewTicketList extends Component {
    constructor(props) {
        super(props);
        autoBind(this);
        this.dependencies = [() => this.fetchData(props)]
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.apiKey !== this.props.apiKey) {
            this.dependencies = [() => this.fetchData(nextProps)];
        }
    }

    fetchData(props) {
        return Promise.all([
            props.loadUsers(props.apiKey),
            props.loadTickets(props.apiKey)
        ]).catch(error => props.addError(error))
    }

    render() {
        const {users, userData} = this.props;

        return (
            <DependencyManager spinner blocking={this.dependencies}>
                Zde naleznete přehled nevyřízených objednávek, které máte vydat.
                <hr />
                {users.map(user => (<User key={user.id} {...user} data={userData[user.id]}/>))}
            </DependencyManager>
        );
    }
}

function mapStateToProps(state) {

    const users = {}

    Object.values(state.tickets.tickets)
        .filter(ticket => ticket.confirmed === 0)
        .forEach(ticket => {
            if (!users[ticket.user_id]) {
                users[ticket.user_id] = {}
            }
            if (!users[ticket.user_id][ticket.schema.name]) {
                users[ticket.user_id][ticket.schema.name] = []
            }
            users[ticket.user_id][ticket.schema.name].push(ticket)
        });


    return {
        users: Object.keys(users).map(id => state.users.users[id]).filter(user => !!user).sort((u1, u2) => (u1.surname + u1.name).localeCompare(u2.surname + u2.name)),
        userData: users,
        apiKey: state.users.users[state.users.currentUser].token,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loadUsers(apiKey) {
            return dispatch(fetchUsers(apiKey))
        },
        loadTickets(apiKey) {
            return dispatch(fetchTickets(apiKey))
        },
        addError(error) {
            return dispatch(addError(error))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OverviewTicketList);