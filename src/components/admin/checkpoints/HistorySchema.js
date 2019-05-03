import React from 'react';
import autoBind from "react-autobind";
import {connect} from "react-redux";
import Seat from "../../user/Seat";
import {addError, addSuccess, createTicket, fetchSchema, fetchSchemaHistory, fetchSeats} from '../../../actions';
import '../schema.css';
import classnames from "classnames";
import DependencyManager from "../../DependencyManager";
import get from "lodash/get";
import {Button, Modal, Popover} from "react-bootstrap";

class HistorySchema extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);
        this.dependencies = [() => this.fetchData(props)];
        this.state = {
            popover: {
                open: false,
                seat: null,
                position: null,
            },
            modal: {
                open: false,
                seat: null,
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.id !== this.props.id) {
            this.dependencies = [() => this.fetchData(nextProps)];
        }
    }

    fetchData(props) {
        return Promise.all([
                props.fetchSchema(props.apiKey, props.id),
                props.fetchSeats(props.apiKey, props.id),
                props.fetchDiff(props.apiKey, props.id),
            ]
        )
    }

    onMouseSeatIn(seat, e) {
        const left = e.clientX, top = e.clientY;
        this.setState({
            popover: {
                open: true,
                seat: seat,
                position: {
                    left, top
                }
            }
        })
    }

    onMouseSeatLeave(seat) {
        this.setState(state => ({
            popover: {
                open: false,
                ...state.popover
            }
        }))
    }

    onMouseClick(seat) {
        this.setState({
            modal: {
                open: true,
                seat: seat
            }
        })
    }

    renderSeats() {
        const {schema, seatDiffs} = this.props;

        return (
            <table className="table schema">
                <tbody>

                <tr>
                    <td className="schema-control"></td>
                    {schema.seats[0].map((col, i) => (<th key={`header_${i + 1}`}>{i + 1}</th>))}
                    <td className="schema-control">
                    </td>
                </tr>

                {schema.seats.map((row, i) => (
                    <tr key={i + 1}>
                        <th className="schema-control">{i + 1}</th>
                        {row.map((seat, j) => (
                            <Seat
                                key={`${i + 1}${j + 1}`}
                                seat={seat}
                                onMouseIn={this.onMouseSeatIn}
                                onMouseLeave={this.onMouseSeatLeave}
                                onMouseClick={this.onMouseClick}
                                className={{
                                    'seat-changed': !!seatDiffs[seat.id]
                                }}
                            />
                        ))}
                        <th className="schema-control">{i + 1}</th>
                    </tr>
                ))}

                <tr>
                    <td className="schema-control">
                    </td>
                    {schema.seats[0].map((seat, i) => (<th key={`footer_${i + 1}`}>{i + 1}</th>))}
                    <td className="schema-control"></td>
                </tr>

                </tbody>
            </table>
        );
    }

    renderDiffSeat(seat) {
        const {seatDiffs} = this.props;

        if (!seatDiffs || !seatDiffs[seat.id]) {
            return 'Žádná historie';
        }

        const checkpoints = seatDiffs[seat.id]

        if (checkpoints.length === 0) {
            return 'Žádná historie';
        }

        return (
            <table className='table'>
                <thead>
                <tr>
                    <th>Datum</th>
                    <th>Původní vlastník</th>
                    <th>Nový vlastník</th>
                </tr>
                </thead>
                <tbody>
                {checkpoints.map(({changed_at, seat, from, to}) => (
                    <tr key={`${changed_at.toLocaleString()}-${seat.id}`}
                        className={classnames({
                            'table-success': from === null && to !== null,
                            'table-danger': from !== null && to === null,
                            'table-warning': from !== null && to !== null,
                        })}>
                        <td>{changed_at.toLocaleString()}</td>
                        <td>{(from && `${from.name} ${from.surname} (${from.email})`) || '-'}</td>
                        <td>{(to && `${to.name} ${to.surname} (${to.email})`) || '-'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    }

    render() {
        const {schema} = this.props;
        const {modal, popover} = this.state;

        return (
            <DependencyManager spinner blocking={this.dependencies}>
                <section>
                    <div className="row">
                        <h1>{schema.name}</h1>
                    </div>

                    <div className="row">
                        {schema && schema.seats.length && this.renderSeats()}
                    </div>

                    {popover.open && (
                        <Popover title={`Sedadlo Ř${popover.seat.row}S${popover.seat.col}`}
                                 style={{
                                     top: popover.position.top,
                                     left: popover.position.left,
                                     maxWidth: '100%',
                                     position: 'fixed',
                                 }}>
                            {this.renderDiffSeat(popover.seat)}
                        </Popover>
                    )}

                    {modal.open && (
                        <Modal onHide={() => this.setState({modal: {...this.state.modal, open: false}})}
                               show={modal.open}>
                            <Modal.Header closeButton>
                                {`Sedadlo Ř${modal.seat.row}S${modal.seat.col}`}
                            </Modal.Header>
                            <Modal.Body>
                                {this.renderDiffSeat(modal.seat)}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary"
                                        onClick={() => this.setState({modal: {...this.state.modal, open: false}})}>
                                    Zavřít
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    )}
                </section>
            </DependencyManager>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const id = ownProps.id;
    if (!state.schemas.schemas[id] || !state.schemas.schemas[id].seats) {
        return {
            schema: {
                seats: [],
            },
            seatDiffs: {},
            apiKey: state.users.users[state.users.currentUser].token,
        };
    }

    const seats = state.schemas.schemas[id].seats.map(id => state.seats.seats[id]).filter(seat => !!seat).map(seat => ({
        ...seat,
        state: get(state.seats.seatsState, seat.id, seat.state)
    }));

    let bucketedSeats = [];
    seats.forEach(seat => {
        if (!bucketedSeats[seat.y - 1]) {
            bucketedSeats[seat.y - 1] = []
        }
        if (!bucketedSeats[seat.y - 1][seat.x - 1]) {
            bucketedSeats[seat.y - 1][seat.x - 1] = seat
        }
    });

    return {
        schema: {
            ...state.schemas.schemas[id],
            seats: bucketedSeats,
        },
        seatDiffs: Object.assign({}, ...seats.filter(seat => !!state.checkpoints.seats[seat.id])
            .map(seat => [seat.id, state.checkpoints.seats[seat.id]
                .filter(checkpoint => !ownProps.old || checkpoint.changed_at >= ownProps.old.created_at)
                .filter(checkpoint => !ownProps.new || checkpoint.changed_at <= ownProps.new.created_at)])
            .filter(([id, diffs]) => diffs.length > 0)
            .map(([id, diffs]) => ({
                [id]: diffs
            }))),
        apiKey: state.users.users[state.users.currentUser].token,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchSchema(apiKey, schemaId) {
            return dispatch(fetchSchema(apiKey, schemaId))
        },
        fetchSeats(apiKey, schemaId) {
            return dispatch(fetchSeats(apiKey, schemaId))
        },
        fetchDiff(apiKey, schemaId) {
            return dispatch(fetchSchemaHistory(apiKey, schemaId))
        },
        createTicket(apiKey, ticket) {
            return dispatch(createTicket(apiKey, ticket))
        },
        addError(error) {
            return dispatch(addError(error));
        },
        addSuccess(message) {
            return dispatch(addSuccess(message));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HistorySchema);
