import React from 'react';
import autoBind from "react-autobind";
import {connect} from "react-redux";
import {addError, addSuccess, logBack, logout} from '../actions';
import {Link} from "react-router-dom";

class Logout extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    onLogout() {
        this.props
            .logout()
            .then(() => this.props.addSuccess('Uživatel byl úspěšně odhlášen'))
            .catch(error => this.props.addError('Nepodařilo se odhlásit'));
    }

    onSwitch() {
        this.props
            .logBack()
            .then(() => this.props.addSuccess('Uživatel byl úspěšně změněn'))
            .catch(error => this.props.addError('Uživatele se nepodařilo změnit'));
    }

    render() {
        const {authenticated, hasPreviousUser, className, children} = this.props;
        if(!authenticated) {
            // don't render anything
            return null;
        }

        if(hasPreviousUser) {
            return (
                <Link to={`${window.location.pathname}`} onClick={this.onSwitch} className={className}>
                    Vrátit se
                </Link>
            );
        }

        return (
            <Link to={`/`} onClick={this.onLogout} className={className}>
                {children}
            </Link>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        logout() {
            return dispatch(logout())
        },
        logBack() {
            return dispatch(logBack())
        },
        addError(error) {
            return dispatch(addError(error));
        },
        addSuccess(success) {
            return dispatch(addSuccess(success));
        },
    }
}

export default connect((state) => ({
    authenticated: !!state.users.currentUser && !!state.users.users[state.users.currentUser] && state.users.users[state.users.currentUser].roles,
    hasPreviousUser: !!state.users.previousUser && !!state.users.users[state.users.previousUser],
}), mapDispatchToProps)(Logout);
