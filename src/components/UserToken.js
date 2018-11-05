import React from 'react';
import {connect} from "react-redux";


class UserToken extends React.Component {
    render() {
        return (
            <span>{this.props.token}</span>
        )
    }
}

function mapStateToProps(state) {
    return {
        token: state.users.users[state.users.currentUser].token,
    }
}

export default connect(mapStateToProps, null)(UserToken);