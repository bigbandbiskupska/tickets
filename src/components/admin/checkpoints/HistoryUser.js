import React from 'react';
import autoBind from "react-autobind";
import classnames from "classnames";
import get from 'lodash/get';
import {connect} from "react-redux";
import {addError, addSuccess, fetchUser, fetchUserHistory} from '../../../actions';
import '../schema.css';
import DependencyManager from "../../DependencyManager";

class HistoryUser extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);
        this.dependencies = [() => this.fetchData(props)];
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.id !== this.props.id) {
            this.dependencies = [() => this.fetchData(nextProps)];
        }
    }

    fetchData(props) {
        return Promise.all([
                props.fetchUser(props.apiKey, props.id),
                props.fetchDiff(props.apiKey, props.id),
            ]
        )
    }

    renderUserHistory() {
        const {checkpoints} = this.props;

        if (!checkpoints) {
            return 'Žádná historie';
        }

        if (!checkpoints || checkpoints.length === 0) {
            return 'Žádná historie';
        }

        return (
            <table className='table'>
                <thead>
                <tr>
                    <th>Datum</th>
                    <th>Akce</th>
                    <th>Sedadlo</th>
                    <th>Před</th>
                    <th>Nyní</th>
                    <th>Poznámka</th>
                </tr>
                </thead>
                <tbody>
                {checkpoints.map(({changed_at, user, seat, action, from, to, reason}) => (
                    <tr key={`${changed_at.toLocaleString()}-${user.id}-${seat.id}`} className={classnames({
                        'table-success': action === 'added',
                        'table-danger': action === 'removed',
                        'table-warning': action === 'moved',
                    })}>
                        <td>{changed_at.toLocaleString()}</td>
                        <td>{action}</td>
                        <td>{seat.schema.name} - Ř{seat.row}S{seat.col}</td>
                        <td>{from}</td>
                        <td>{to}</td>
                        <td>({reason})</td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    }

    render() {
        const {user} = this.props;

        return (
            <DependencyManager spinner blocking={this.dependencies}>
                {user && (
                    <section>
                        <div className="row">
                            <h1>{user.name} {user.surname} ({user.email})</h1>
                        </div>

                        {this.renderUserHistory()}
                    </section>
                )}

            </DependencyManager>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        user: state.users.users[ownProps.id],
        checkpoints: get(state.checkpoints.users, ownProps.id, [])
            .filter(checkpoint => !ownProps.old || checkpoint.changed_at >= ownProps.old.created_at)
            .filter(checkpoint => !ownProps.new || checkpoint.changed_at <= ownProps.new.created_at),
        apiKey: state.users.users[state.users.currentUser].token,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchUser(apiKey, userId) {
            return dispatch(fetchUser(apiKey, userId))
        },
        fetchDiff(apiKey, userId) {
            return dispatch(fetchUserHistory(apiKey, userId))
        },
        addError(error) {
            return dispatch(addError(error));
        },
        addSuccess(message) {
            return dispatch(addSuccess(message));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HistoryUser);
