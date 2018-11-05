import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import {connect} from "react-redux";
import {loadUser} from "../actions";

class Authenticated extends Component {

    getRedirect(location) {
        return (location.query && location.query.redirect) || undefined;
    }

    getNextRedirect(location) {
        if(new URLSearchParams(location.search).get('redirect')) {
            return encodeURIComponent(new URLSearchParams(location.search).get('redirect'));
        }
        return encodeURIComponent((location.pathname === '/' ? '' : location.pathname) + (location.search || '')) || '';
    }

    render() {
        const {location, authenticated} = this.props;

        if(!authenticated && location.pathname === '/login') {
            return null;
        }

        if(!authenticated) {
            if(this.getNextRedirect(location)) {
                return <Redirect to={`/login?redirect=${this.getNextRedirect(location)}`} />;
            } else {
                return <Redirect to={`/login`} />;
            }
        }

        if(this.getRedirect(location)) {
            return <Redirect to={decodeURIComponent(this.getRedirect(location))} />
        }

        return this.props.children;
    }
}

function mapStateToProps(state) {
    return {
        location: window.location,
        authenticated: !!state.users.currentUser && !!state.users.users[state.users.currentUser] && !!state.users.users[state.users.currentUser].token && state.users.users[state.users.currentUser].roles,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loadUser() {
            return loadUser();
        },
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Authenticated);