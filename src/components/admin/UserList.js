import React, {Component} from 'react';
import autoBind from 'react-autobind';
import {connect} from 'react-redux';
import classnames from "classnames";
import {Link} from 'react-router-dom';
import {fetchUsers, logAs} from "../../actions/index";
import DependencyManager from "../DependencyManager";


class User extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this)
    }

    onLogAs() {
        this.props.logAs(this.props.id);
    }

    dateDiff(d1, d2) {
        if (d1.getFullYear() !== d2.getFullYear()) {
            return `${d1.getFullYear() - d2.getFullYear()} let`
        }
        if (d1.getMonth() !== d2.getMonth()) {
            return `${d1.getMonth() - d2.getMonth()} měsíců`
        }
        if (d1.getDate() !== d2.getDate()) {
            return `${d1.getDate() - d2.getDate()} dnů`
        }
        if (d1.getHours() !== d2.getHours()) {
            return `${d1.getHours() - d2.getHours()} hodin`
        }
        if (d1.getMinutes() !== d2.getMinutes()) {
            return `${d1.getMinutes() - d2.getMinutes()} minut`
        }
        if (d1.getSeconds() !== d2.getSeconds()) {
            return `${d1.getSeconds() - d2.getSeconds()} vteřin`
        }
    }

    render() {
        const {currentUser, roles, id, name, last_click_at, surname, email} = this.props;
        return (
            <tr>
                <td>
                    {id}
                </td>
                <td>
                    {name}
                </td>
                <td>
                    {surname}
                </td>
                <td>
                    {roles.map(role => (<span key={role} className='badge badge-dark'>{role}</span>))}
                </td>
                <td>
                    {email}
                </td>
                <td>
                    <Link className={classnames('badge', 'badge-info')} to={`/admin/user/${id}`}>
                        Zobrazit
                    </Link>
                </td>
                <td>
                    {currentUser.id !== id && (
                        <button
                            type="button"
                            className={classnames('btn', 'badge', 'btn-success')}
                            onClick={this.onLogAs}
                        >
                            Přihlasit se
                        </button>
                    )}
                </td>
                <td>
                    {last_click_at && last_click_at > new Date(new Date().getTime() - 30 * 60 * 1000) ? (
                        <span
                            className={classnames({
                                'badge': true,
                                'badge-success': last_click_at > new Date(new Date().getTime() - 5 * 60 * 1000) && last_click_at <= new Date(),
                                'badge-warning': last_click_at > new Date(new Date().getTime() - 15 * 60 * 1000) && last_click_at <= new Date(new Date().getTime() - 5 * 60 * 1000),
                                'badge-danger': last_click_at > new Date(new Date().getTime() - 30 * 60 * 1000) && last_click_at <= new Date(new Date().getTime() - 15 * 60 * 1000),
                            })}
                            title={'Poslední klik ' + last_click_at.toLocaleString()}
                        >
                            online
                        </span>
                    ) : null}
                    {last_click_at && last_click_at <= new Date(new Date().getTime() - 30 * 60 * 1000) ? (
                        <span className="badge badge-dark" title={'Poslední klik ' + last_click_at.toLocaleString()}>
                            {this.dateDiff(new Date(), last_click_at)}
                        </span>
                    ) : null}
                    {!last_click_at ? (
                        <span className="badge badge-dark" title={'Poslední klik nikdy'}>
                            nikdy
                        </span>
                    ) : null}
                </td>
            </tr>
        );
    }
}


User = connect((state) => {
    return {
        currentUser: state.users.users[state.users.currentUser],
    }
}, dispatch => {
    return {
        logAs(userId) {
            return dispatch(logAs(userId))
        }
    }
})(User);

class UserList extends Component {
    constructor(props) {
        super(props);
        autoBind(this);
        this.dependencies = [() => this.props.loadUsers(this.props.apiKey)]
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id !== this.props.match.params.id) {
            this.dependencies = [() => this.props.loadUsers(nextProps.apiKey)];
        }
    }

    render() {
        const {users, match} = this.props;

        return (
            <DependencyManager spinner blocking={this.dependencies}>
                V přehledu uživatelů najdete všechny uživatele v aplikaci. Uživatel může mít jednu z rolí
                <ul>
                    <li>administrator</li>
                    <li>user - člen kapely</li>
                    <li>guest - externí rezervace</li>
                </ul>
                Z přehledu můžete pokračovat na přehled uživatele a nebo se můžete přihlásit pod uživatelovou identitou.
                <table className="table">
                    <thead>
                    <tr>
                        <th>Číslo</th>
                        <th>Jméno</th>
                        <th>Příjmení</th>
                        <th>Role</th>
                        <th>Email</th>
                        <th>Odkaz</th>
                        <th>Přihlásit se</th>
                        <th>Online</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <User key={user.id} {...user} match={match}/>
                    ))}
                    </tbody>
                    <tfoot>
                    <tr>
                        <th colSpan="6"></th>
                        <th>
                            <Link to={`/admin/users/new`}>
                                <button className="btn btn-success">Nový uživatel</button>
                            </Link>
                        </th>
                    </tr>
                    </tfoot>
                </table>
            </DependencyManager>
        );
    }
}

function mapStateToProps(state) {
    return {
        users: Object.values(state.users.users),
        apiKey: state.users.users[state.users.currentUser].token,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loadUsers(apiKey) {
            return dispatch(fetchUsers(apiKey))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserList);