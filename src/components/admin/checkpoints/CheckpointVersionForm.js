import React from 'react';
import autoBind from "react-autobind";
import {connect} from "react-redux";
import {addError, addSuccess, fetchCheckpoints} from '../../../actions';
import {Col, Form} from 'react-bootstrap';

import '../schema.css';
import DependencyManager from "../../DependencyManager";

class CheckpointVersionForm extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);
        this.dependencies = [() => this.fetchCheckpoints(this.props)];

        this.state = {
            old: null,
            new: null
        };
    }

    fetchCheckpoints(props) {
        return Promise.all([
                props.fetchCheckpoints(props.apiKey),
            ]
        )
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.checkpoints !== this.props.checkpoints && nextProps.checkpoints.length > 0) {
            this.setState(prevState => ({
                old: prevState.old || nextProps.checkpoints[0],
                new: prevState.new || null
            }))
        }
    }

    onOldRevisionChange(e) {
        const {checkpointsById: checkpoints} = this.props;
        this.setState({old: checkpoints[parseInt(e.target.value, 10)]});
    }

    onNewRevisionChange(e) {
        const {checkpointsById: checkpoints} = this.props;
        this.setState({new: checkpoints[parseInt(e.target.value, 10)]});
    }

    render() {
        const {ownProps, checkpoints, component: Component} = this.props;
        const state = this.state;

        return (
            <section>
                <DependencyManager spinner blocking={this.dependencies}>
                    <Form.Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Stará verze</Form.Label>
                                <Form.Control as="select" onChange={this.onOldRevisionChange}>
                                    {checkpoints.map((checkpoint, i) => (
                                        <option key={checkpoint.id} value={checkpoint.id} defaultValue={i === 0}>
                                            {checkpoint.created_at.toLocaleString()}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>Nová verze</Form.Label>
                                <Form.Control as="select" onChange={this.onNewRevisionChange}>
                                    <option value={null} defaultValue>Aktuální</option>
                                    {checkpoints.map(checkpoint => (
                                        <option key={checkpoint.id} value={checkpoint.id}>
                                            {checkpoint.created_at.toLocaleString()}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Form.Row>

                    <hr/>

                    <Component {...ownProps} {...state}/>
                </DependencyManager>
            </section>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        ownProps,
        apiKey: state.users.users[state.users.currentUser].token,
        checkpointsById: state.checkpoints.checkpoints,
        checkpoints: Object.keys(state.checkpoints.checkpoints).map(id => state.checkpoints.checkpoints[id]).sort((a, b) => a.created_at < b.created_at),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchCheckpoints(apiKey) {
            return dispatch(fetchCheckpoints(apiKey))
        },
        addError(error) {
            return dispatch(addError(error));
        },
        addSuccess(message) {
            return dispatch(addSuccess(message));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckpointVersionForm);
