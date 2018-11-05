import React, {Component} from 'react';
import autoBind from 'react-autobind';
import {connect} from 'react-redux';
import classnames from "classnames";
import {Link} from 'react-router-dom';
import {fetchTickets, updateTicket} from "../../actions/index";
import DependencyManager from "../DependencyManager";
import BooleanBadge from "../BooleanBadge";
import {SyncLoader} from "react-spinners";
import {addError} from "../../actions";


class Ticket extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);
        this.state = {
            isSaving: false
        }
    }

    onPay() {
        const {id, onPay} = this.props;
        this.setState({
            isSaving: true
        })
        onPay && onPay(id)
            .then(ticket => {
                this.setState({
                    isSaving: false
                })
            }).catch(error => {
                this.setState({
                    isSaving: false
                })
            })
    }

    render() {
        const {id, note, created_at, confirmed} = this.props;
        return (this.state.isSaving ? (
            <tr>
                <td colSpan="5"><SyncLoader className='text-centered-spinner'/></td>
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
                    {note}
                </td>
                <td>
                    <Link className={classnames('badge', 'badge-info')} to={`/admin/ticket/${id}`}>
                        Zobrazit
                    </Link>
                </td>
                <td>
                    <BooleanBadge enabled={confirmed} yes='Zaplaceno' no={'Nezaplaceno'}/>
                    {!confirmed && (<button
                        type="button"
                        className={classnames('btn', 'badge', 'btn-success')}
                        onClick={this.onPay}
                    >
                        Zaplatit
                    </button>)}
                </td>
            </tr>
        ));
    }
}

export class TicketList extends Component {
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
       return props.loadTickets(props.apiKey);
    }

    onPay(id) {
        return this.props.payTicket(this.props.apiKey, id)
            .catch(error => this.props.addError(error))
    }

    render() {
        const {tickets} = this.props;

        return (
            <DependencyManager spinner blocking={this.dependencies}>
                Přehled objednávek, detail objednávky je možno zobrazit kliknutím na 'Zobrazit'. Objednávka může být ve dvou stavech
                <ol>
                    <li>zaplacená - označená zelenou barvou</li>
                    <li>nezaplacená - označená červenou barvou</li>
                </ol>
                Nezaplacené objednávky jsou automaticky po stanoveném čase rušeny, aby byla sedadla nabídnuta jiným zájemcům.

                Jako administrátor můžete objednávku označit za zaplacenou. Zaplacenou objednávku již nemůže uživatel smazat.
                <table className="table">
                    <thead>
                    <tr>
                        <th>Číslo</th>
                        <th>Datum</th>
                        <th>Uživatel</th>
                        <th>Odkaz</th>
                        <th>Zaplatit</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tickets.map(ticket => (
                        <Ticket key={ticket.id} {...ticket} onPay={this.onPay}/>
                    ))}
                    </tbody>
                </table>
            </DependencyManager>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        tickets: Object.values(state.tickets.tickets),
        apiKey: state.users.users[state.users.currentUser].token,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loadTickets(apiKey) {
            return dispatch(fetchTickets(apiKey))
        },
        payTicket(apiKey, ticketId) {
            return dispatch(updateTicket(apiKey, ticketId, {confirmed: true}))
        },
        addError(error) {
            return dispatch(addError(error))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TicketList);