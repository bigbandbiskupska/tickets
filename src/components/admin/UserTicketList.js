import {connect} from 'react-redux';
import {fetchTicketsForUser, updateTicket} from "../../actions/index";
import {TicketList} from "./TicketList";


class UserTicketList extends TicketList {
    componentWillReceiveProps(nextProps) {
        if (nextProps.apiKey !== this.props.apiKey || nextProps.userId !== this.props.userId) {
            this.dependencies = [() => this.fetchData(nextProps)];
        }
    }

    fetchData(props) {
        return props.loadTickets(props.apiKey, props.userId);
    }
}

function mapStateToProps(state, ownProps) {
    return {
        tickets: Object.values(state.tickets.tickets).filter(ticket => ticket.user_id === ownProps.userId),
        apiKey: state.users.users[state.users.currentUser].token,
        ...ownProps,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loadTickets(apiKey, userId) {
            return dispatch(fetchTicketsForUser(apiKey, userId))
        },
        payTicket(apiKey, ticketId) {
            return dispatch(updateTicket(apiKey, ticketId, { confirmed: true }))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserTicketList);