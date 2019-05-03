import React from 'react';
import autoBind from "react-autobind";
import {connect} from "react-redux";
import {addError, addSuccess} from '../../../actions';

import '../schema.css';
import {Col, Row, Tab, Tabs} from "react-bootstrap";
import SchemaSelectionForm from "./SchemaSelectionForm";
import UserSelectionForm from "./UserSelectionForm";
import HistorySchema from "./HistorySchema";
import HistoryUser from "./HistoryUser";
import CheckpointsEnvelopes from "./CheckpointsEnvelopes";
import NewCheckpoint from "./NewCheckpoint";

class CheckpointOverview extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    render() {
        return (
            <Tabs defaultActiveKey="schemas" id="uncontrolled-tab-example">
                <Tab eventKey="schemas" title="Změny v sedadlech">
                    <Row>
                        <Col>
                            <SchemaSelectionForm component={props => (<HistorySchema {...this.props} {...props} />)}/>
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey="users" title="Změny v uživatelích">
                    <Row>
                        <Col>
                            <UserSelectionForm component={props => (<HistoryUser {...this.props} {...props} />)}/>
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey="envelopes" title="Změny v obálkách">
                    <Row>
                        <CheckpointsEnvelopes {...this.props} />
                    </Row>
                </Tab>
                <Tab eventKey="new" title="Vytvořit nový checkpoint">
                    <Row>
                        <NewCheckpoint {...this.props} />
                    </Row>
                </Tab>
            </Tabs>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        ...ownProps,
        apiKey: state.users.users[state.users.currentUser].token,
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

export default connect(mapStateToProps, mapDispatchToProps)(CheckpointOverview);
