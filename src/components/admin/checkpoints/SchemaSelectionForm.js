import React from 'react';
import autoBind from "react-autobind";
import {connect} from "react-redux";
import {addError, addSuccess, fetchSchemas} from '../../../actions';
import {Form} from 'react-bootstrap';

import '../schema.css';
import DependencyManager from "../../DependencyManager";

class SchemaSelectionForm extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);
        this.dependencies = [() => props.fetchSchemas(props.apiKey)];

        this.state = {
            id: null,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.schemas !== this.props.schemas && nextProps.schemas.length > 0) {
            this.setState(prevState => ({
                id: prevState.id || nextProps.schemas[0].id,
            }))
        }
    }

    onSelectChange(e) {
        this.setState({id: parseInt(e.target.value, 10) || null});
    }

    render() {
        const {ownProps, schemas, component: Component} = this.props;
        const state = this.state;

        return (
            <section>
                <DependencyManager spinner blocking={this.dependencies}>
                    <Form.Row>
                        <Form.Group>
                            <Form.Label>Akce</Form.Label>
                            <Form.Control as="select" onChange={this.onSelectChange}>
                                {schemas.map((schema, i) => (
                                    <option key={schema.id} value={schema.id} defaultValue={i === 0}>
                                        {schema.name}
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
        schemas: Object.values(state.schemas.schemas),
        apiKey: state.users.users[state.users.currentUser].token
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchSchemas(apiKey) {
            return dispatch(fetchSchemas(apiKey))
        },
        addError(error) {
            return dispatch(addError(error));
        },
        addSuccess(message) {
            return dispatch(addSuccess(message));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SchemaSelectionForm);
