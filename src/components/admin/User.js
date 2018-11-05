import autoBind from "react-autobind";
import React, {Component} from "react";
import {addError, fetchUser, putTab} from "../../actions";
import {connect} from "react-redux";
import DependencyManager from "../DependencyManager";
import {fetchTicketsForUser} from "../../actions";
import UserTicketList from "./UserTicketList";

class User extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
        this.dependencies = [() => this.fetchData(props)];
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id !== this.props.match.params.id) {
            this.dependencies = [() => this.fetchData(nextProps)];
        }
    }

    fetchData(props) {
        return props.fetchUser(props.apiKey, parseInt(props.match.params.id, 10))
            .then(user => props.saveUser(user))
            .catch(error => props.addError(error))
    }

    render() {
        const {user} = this.props;
        return (
            <DependencyManager spinner blocking={this.dependencies}>
                {user && (
                    <article>
                        <dl>
                            <dt>Jméno</dt>
                            <dd>{user.name}</dd>
                            <dt>Příjmení</dt>
                            <dd>{user.surname}</dd>
                            <dt>Email</dt>
                            <dd>{user.email}</dd>
                            <dt>Role</dt>
                            <dd>{user.roles.map(role => (<span key={role} className="badge badge-dark">{role}</span>))}</dd>
                        </dl>
                        <UserTicketList userId={user.id} />
                    </article>
                )}
            </DependencyManager>
        );
    }
};

function mapStateToProps(state, ownProps) {
    const id = parseInt(ownProps.match.params.id, 10);

    return {
        user: state.users.users[id],
        apiKey: state.users.users[state.users.currentUser].token,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchUser(apiKey, userId) {
            return dispatch(fetchUser(apiKey, userId))
        },
        fetchTicketsForUser(apiKey, userId) {
            return dispatch(fetchTicketsForUser(apiKey, userId))
        },
        saveUser(user) {
            return dispatch(putTab({id: `user_${user.id}`, index: 2, url: `/admin/user/${user.id}`, name: `${user.name} ${user.surname}`}))
        },
        addError(error) {
            return dispatch(addError(error))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(User);