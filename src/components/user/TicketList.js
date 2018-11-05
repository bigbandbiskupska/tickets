import React, {Component} from 'react';
import autoBind from 'react-autobind';
import {connect} from 'react-redux';
import classnames from "classnames";
import {Link} from 'react-router-dom';
import {fetchTicketsForUser} from "../../actions/index";
import DependencyManager from "../DependencyManager";
import {addError, addSuccess, deleteTicket} from "../../actions";
import {SyncLoader} from "react-spinners";


class Ticket extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
        this.state = {
            isSaving: false
        }
    }

    onDelete() {
        this.setState({
            isSaving: true
        })
        return this.props.onDelete(this.props.id)
            .then(() => {
                this.setState({
                    isSaving: false
                })
            }).catch(() => {
                this.setState({
                    isSaving: false
                })
            })
    }

    render() {
        const {id, schema, created_at, note, confirmed} = this.props;

        return (this.state.isSaving ? (
            <tr>
                <td colSpan="6"><SyncLoader className='text-centered-spinner'/></td>
            </tr>
        ) : (
            <tr className={classnames({
                'table-success': confirmed,
                'table-danger': !confirmed,
            })}>
                <td>{id}</td>
                <td>
                    {created_at.toLocaleString()}
                </td>
                <td>
                    {schema.name}
                </td>
                <td>
                    {note}
                </td>
                <td>
                    <Link className={classnames('badge', 'badge-info')} to={`ticket/${id}`}>
                        Zobrazit
                    </Link>
                </td>
                <td>
                    {!confirmed ? (<button
                        type="button"
                        className={classnames('btn', 'badge', 'btn-danger')}
                        onClick={this.onDelete}
                    >
                        Zrušit objednávku
                    </button>) : null}
                </td>
            </tr>
        ));
    }
}

class TicketList extends Component {
    constructor(props) {
        super(props);
        autoBind(this);
        this.dependencies = [() => this.fetchData(props)]
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user !== this.props.user || nextProps.apiKey !== this.props.apiKey) {
            this.dependencies = [() => this.fetchData(nextProps)];
        }
    }

    fetchData(props) {
        return props.loadTickets(props.apiKey, props.user.id)
            .catch(error => props.addError(error))
    }

    onDelete(id) {
        return this.props.deleteTicket(this.props.apiKey, id)
            .then(() => this.props.addSuccess(`Objednávka ${id} byla úspěšně smazána`))
            .catch((error) => this.props.addError(error));
    }

    render() {
        const {tickets} = this.props;

        return (
            <DependencyManager spinner blocking={this.dependencies}>
                <p>
                    Seznam vašich objednávek. Zaplacené objednávky jsou zobrazeny zeleně, nezaplacené červeně.
                    Nezaplacenou objednávku lze kdykoliv zrušit, zaplacenou pouze po domluvě s organizátorem akce.
                </p>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Číslo</th>
                        <th>Datum</th>
                        <th>Akce</th>
                        <th>Poznámka</th>
                        <th>Odkaz</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {tickets.map(ticket => (
                        <Ticket key={ticket.id} {...ticket} onDelete={this.onDelete}/>
                    ))}
                    </tbody>
                </table>
            </DependencyManager>
        );
    }
}

function mapStateToProps(state) {
    return {
        tickets: Object.values(state.tickets.tickets).filter(ticket => ticket.user_id === state.users.currentUser),
        user: state.users.users[state.users.currentUser],
        apiKey: state.users.users[state.users.currentUser].token,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loadTickets(apiKey, userId) {
            return dispatch(fetchTicketsForUser(apiKey, userId))
        },
        deleteTicket(apiKey, ticketId) {
            return dispatch(deleteTicket(apiKey, ticketId))
        },
        addError(error) {
            return dispatch(addError(error));
        },
        addSuccess(success) {
            return dispatch(addSuccess(success));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TicketList);