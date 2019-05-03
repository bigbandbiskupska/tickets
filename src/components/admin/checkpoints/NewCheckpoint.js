import React from 'react';
import autoBind from "react-autobind";
import {connect} from "react-redux";
import {addError, addSuccess, createCheckpoint} from '../../../actions';

import Overlay from "../../Overlay";
import {Redirect} from "react-router-dom";

class NewCheckpoint extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);
        this.state = {
            isSaving: false,
        }
    }

    onCreate(event) {
        this.setState({
            isSaving: true
        })
        this.props
            .createCheckpoint(this.props.apiKey)
            .then(checkpoint => {
                this.setState({
                    isSaving: false,
                    checkpointId: checkpoint.id,
                });

                return this.props.addSuccess('Checkpoint byl úspěšně vytvořen.')
            }).catch(error => {
            this.setState({
                isSaving: false
            });
            return this.props.addError(error)
        });
    }

    render() {
        if (this.state.checkpointId) {
            return (<Redirect to={`/admin/tickets/checkpoints`}/>)
        }

        return (
            <section>
                <Overlay show={this.state.isSaving}/>
                <button className="btn btn-success" onClick={this.onCreate}>Vytvořit nyní</button>
            </section>
        );
    }
}

function mapStateToProps(state) {
    return {
        apiKey: state.users.users[state.users.currentUser].token,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createCheckpoint(apiKey) {
            return dispatch(createCheckpoint(apiKey))
        },
        addError(error) {
            return dispatch(addError(error));
        },
        addSuccess(message) {
            return dispatch(addSuccess(message));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewCheckpoint);
