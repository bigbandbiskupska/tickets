import React from 'react';
import autoBind from "react-autobind";
import {connect} from "react-redux";
import get from 'lodash/get';
import {addError, addSuccess, fetchCheckpointsDiff} from '../../../actions';
import DependencyManager from "../../DependencyManager";
import classnames from 'classnames';
import {Card, ListGroup} from 'react-bootstrap';

const Change = ({from, to, className, seat, variant}) => {
    return (
        <ListGroup.Item variant={variant}>
            <span>{get(from, 'name', null)} {get(from, 'surname', null)}</span>
            <span>{' '}</span>
            <span className={classnames({
                'fa': true,
                [className]: true
            })}></span>
            <span>{' '}</span>
            <span>{get(to, 'name', null)} {get(to, 'surname', null)}</span>
            <span>{' '}</span>
            <span>{seat.schema.name} - Ř{seat.row}S{seat.col}</span>
        </ListGroup.Item>
    )
};

class CheckpointsEnvelopes extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);
        this.dependencies = [() => this.fetchDiff(props)];
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.old !== nextProps.old || this.props.new !== nextProps.new) {
            this.dependencies = [() => this.fetchDiff(nextProps)];
        }
    }

    fetchDiff(props) {
        return Promise.all([
                props.fetchCheckpointsDiff(props.apiKey, get(props, 'old.id'), get(props, 'new.id'))
                    .catch(error => props.addError(new Error(`Unable to fetch the diff for old = ${get(props, 'old.id')} and new = ${get(props, 'new.id')}`))),
            ]
        )
    }

    renderChanges(user, changes) {
        return [
            // add seat removals
            ...changes.filter(change => change.from && change.from.id === user.id && change.to === null)
                .map(change => (
                        <Change
                            key={`${user.id}-${change.seat.id}`}
                            from={null}
                            className='fa-minus'
                            variant='danger'
                            to={null}
                            seat={change.seat}/>
                    )
                ),
            // add seat additions
            ...changes.filter(change => change.to && change.to.id === user.id && change.from === null)
                .map(change => (
                        <Change
                            key={`${user.id}-${change.seat.id}`}
                            from={null}
                            className='fa-plus'
                            variant='success'
                            to={null}
                            seat={change.seat}/>
                    )
                ),
            // add changes which moved seat from this user to another user
            ...changes.filter(change => change.from !== null && change.to !== null && change.to.id === user.id)
                .map(change => (
                        <Change
                            key={`${user.id}-${change.seat.id}`}
                            from={change.from}
                            className='fa-arrow-right'
                            variant='warning'
                            to={null}
                            seat={change.seat}/>
                    )
                ),
            // add changes which moved seat from another user to this one
            ...changes.filter(change => change.from !== null && change.from.id === user.id && change.to !== null)
                .map(change => (
                    <Change
                        key={`${user.id}-${change.seat.id}`}
                        from={null}
                        className='fa-arrow-right'
                        variant='warning'
                        to={change.to}
                        seat={change.seat}
                    />)
                ),
        ];
    }

    render() {
        const {users} = this.props;

        if (users.length > 0) {
            return (
                <DependencyManager spinner blocking={this.dependencies}>
                    {users.map(({user, changes}) => (
                        <Card key={user.id}>
                            <Card.Header>{user.name} {user.surname} ({user.email})</Card.Header>
                            <ListGroup>
                                {this.renderChanges(user, changes)}
                            </ListGroup>
                        </Card>
                    ))}
                </DependencyManager>
            );
        }

        return (
            <DependencyManager spinner blocking={this.dependencies}>
                Žádná historie
            </DependencyManager>
        );
    }
}

function remapSeats(checkpoint) {
    if (!checkpoint) {
        return {};
    }

    const users = {}
    checkpoint.data.seats.forEach(seatChange => {
        const xxx = {
            seat: seatChange.seat, //`Ř${seatChange.seat.row}S${seatChange.seat.col}`,
            from: seatChange.from, // && `${seatChange.from.name} ${seatChange.from.surname}` || null,
            to: seatChange.to, // && `${seatChange.to.name} ${seatChange.to.surname}` || null,
        }


        if (seatChange.from && !(seatChange.from.id in users)) {
            users[seatChange.from.id] = {
                user: seatChange.from,
                changes: []
            }
        }

        if (seatChange.to && !(seatChange.to.id in users)) {
            users[seatChange.to.id] = {
                user: seatChange.to,
                changes: []
            }
        }

        if (seatChange.from) {
            users[seatChange.from.id].changes.push(xxx)
        }

        if (seatChange.to) {
            users[seatChange.to.id].changes.push(xxx)
        }
    });

    return users;
}

function mapStateToProps(state, ownProps) {
    const remapped = remapSeats(state.checkpoints.diffs[`${get(ownProps, 'old.id', 'oldest')}-${get(ownProps, 'new.id', 'current')}`])

    return {
        ...ownProps,
        apiKey: state.users.users[state.users.currentUser].token,
        users: Object.keys(remapped)
        // sort by name
            .sort((id1, id2) => {
                if (remapped[id1].user.surname === remapped[id2].user.surname) {
                    return remapped[id1].user.name > remapped[id2].user.name;
                }
                return remapped[id1].user.surname > remapped[id2].user.surname;
            })
            .map(id => remapped[id])

    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchCheckpointsDiff(apiKey, oldId, newId) {
            return dispatch(fetchCheckpointsDiff(apiKey, oldId, newId))
        },
        addError(error) {
            return dispatch(addError(error));
        },
        addSuccess(message) {
            return dispatch(addSuccess(message));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckpointsEnvelopes);
