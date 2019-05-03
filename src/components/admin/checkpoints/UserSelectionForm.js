import React from 'react';
import autoBind from "react-autobind";
import {connect} from "react-redux";
import {addError, addSuccess, fetchUsers} from '../../../actions';
import {Form} from 'react-bootstrap';

import '../schema.css';
import DependencyManager from "../../DependencyManager";

class UserSelectionForm extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);
        this.dependencies = [() => props.fetchUsers(props.apiKey)];

        this.state = {
            id: null,
        };
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.users !== this.props.users && nextProps.users.length > 0) {
            this.setState(prevState => ({
                id: prevState.id || nextProps.users[0].id,
            }))
        }
    }

    onSelectChange(e) {
        this.setState({id: parseInt(e.target.value, 10) || null});
    }

    render() {
        const {ownProps, users, component: Component} = this.props;
        const state = this.state;

        return (
            <section>
                <DependencyManager spinner blocking={this.dependencies}>
                    <Form.Row>
                        <Form.Group>
                            <Form.Label>Uživatel</Form.Label>
                            <Form.Control as="select" onChange={this.onSelectChange}>
                                {users.map((user, i) => (
                                    <option key={user.id} value={user.id} defaultValue={i === 0}>
                                        {user.name} {user.surname}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>

                    <hr/>

                    {state.id ? (<Component {...state} {...ownProps}/>) : null}
                </DependencyManager>
            </section>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        ownProps,
        users: Object.values(state.users.users),
        apiKey: state.users.users[state.users.currentUser].token
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchUsers(apiKey) {
            return dispatch(fetchUsers(apiKey))
        },
        addError(error) {
            return dispatch(addError(error));
        },
        addSuccess(message) {
            return dispatch(addSuccess(message));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserSelectionForm);
