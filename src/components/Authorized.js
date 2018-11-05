import React, {Component} from "react";
import {connect} from "react-redux";
import {addError} from "../actions";
import {Redirect} from "react-router-dom";

class Authorized extends Component {

    render() {
        const {authorized, addError} = this.props;

        if(!authorized) {
            addError(new Error('Pro tuto akci nemáte dostatečná oprávnění'))
            return <Redirect to={'/'} />;
        }

        return this.props.children;
    }
}

function mapStateToProps(state, ownProps) {
    return {
        authorized: ownProps.roles.some(role => state.users.users[state.users.currentUser].roles.includes(role)),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addError(error) {
            return dispatch(addError(error));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Authorized);