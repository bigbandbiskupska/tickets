import React from 'react';
import {connect} from "react-redux";
import get from 'lodash/get';
import {addError, addSuccess} from "../actions";

class Messages extends React.Component {

    componentWillReceiveProps(props){

    }

    render() {
        const {errors, success} = this.props;
        return (
            <div>
                {errors && errors.map((message, i) => (
                    <div key={i} className="alert alert-danger">
                        {message}
                    </div>
                ))}
                {success && success.map((message, i) => (
                    <div key={i} className="alert alert-success">
                        {message}
                    </div>
                ))}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        errors: get(state, 'messages.errors'),
        success: get(state, 'messages.success')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addError(error) {
            return dispatch(addError(error));
        },
        addSuccess(message) {
            return dispatch(addSuccess(message));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
