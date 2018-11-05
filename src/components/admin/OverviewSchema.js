import React from 'react';
import classnames from 'classnames';
import autoBind from "react-autobind";
import {connect} from "react-redux";
import Seat from "../user/Seat";
import {addError, addSuccess, fetchSchema, fetchSeats, putTab} from '../../actions';

import './schema.css';
import DependencyManager from "../DependencyManager";
import get from "lodash/get";

const ControlledTd = ({count, className}) => (
    <td className={classnames({
        [className]: parseInt(count, 10) > 0 || !!count.length,
    })}>
        {count}
    </td>
)

const ControlledTr = ({name, cols, count, className}) => (
  <tr className={classnames({
      [className]: count > 0
  })}>
      <th colSpan={cols ? cols - 3 : 1}>{name}</th>
      <td colSpan={cols ? cols - 3 : 1}>{count}</td>
  </tr>
);
class OverviewSchema extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);
        this.dependencies = [() => this.fetchData(this.props)];
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id !== this.props.match.params.id) {
            this.dependencies = [() => this.fetchData(nextProps)];
        }
    }

    fetchData(props) {
        return Promise.all([
                props.fetchSchema(props.apiKey, parseInt(props.match.params.id, 10)).then(schema => this.props.saveSchema(schema)),
                props.fetchSeats(props.apiKey, parseInt(props.match.params.id, 10)),
            ]
        )
    }

    renderSeats() {
        const {schema} = this.props;
        const {seats, allSeats} = schema;

        return (
            <div className="container">
                <h4>Přehled akce</h4>
                <table className="table">
                    <tbody>
                    <tr>
                        <th>Celková cena</th>
                        <td>{allSeats.filter(seat => seat.state !== Seat.WALL).reduce((a, seat) => a + seat.price, 0)}</td>
                    </tr>
                    <tr>
                        <th>Cena volných</th>
                        <td>{allSeats.filter(seat => seat.state === Seat.FREE).reduce((a, seat) => a + seat.price, 0)}</td>
                    </tr>
                    <ControlledTr
                        count={allSeats.filter(seat => seat.tickets.length > 0 && seat.tickets.every(ticket => ticket.confirmed === 1)).reduce((a, seat) => a + seat.price, 0)}
                        className='table-success'
                        name='Zaplaceno'
                    />
                     <ControlledTr
                        count={allSeats.filter(seat => seat.tickets.length > 0 && seat.tickets.every(ticket => ticket.confirmed === 1)).reduce((a, seat) => a + 1, 0)}
                        className='table-success'
                        name='Zaplaceno (počet)'
                    />
                    <ControlledTr
                        count={allSeats.filter(seat => seat.tickets.length > 0 && seat.tickets.every(ticket => ticket.confirmed === 0)).reduce((a, seat) => a + seat.price, 0)}
                        className='table-danger'
                        name='Nezaplaceno'
                    />
                    <ControlledTr
                        count={allSeats.filter(seat => seat.tickets.length > 0 && seat.tickets.every(ticket => ticket.confirmed === 0)).reduce((a, seat) => a + 1, 0)}
                        className='table-danger'
                        name='Nezaplaceno (počet)'
                    />
                    </tbody>
                </table>
                <h4>Přehled jednotlivých řad</h4>
                {seats.map((row, i) => (
                    <table key={i} className="table table-striped">
                        <thead>
                        <tr>
                            <th>Řada</th>
                            <th>Volná</th>
                            <th>Obsazená</th>
                            <th>Obsazená zaplacená</th>
                            <th>Obsazená nezaplacená</th>
                            <th>Zbývá vydat</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{i + 1}</td>
                            <td>{row.filter(seat => seat.state === Seat.FREE).reduce((a, seat) => a + 1, 0)}</td>
                            <td>{row.filter(seat => seat.state !== Seat.FREE && seat.state !== Seat.WALL).reduce((a, seat) => a + 1, 0)}</td>
                            <ControlledTd className='table-success' count={row.filter(seat => seat.state !== Seat.FREE && seat.state !== Seat.WALL).filter(seat => seat.tickets.every(ticket => ticket.confirmed === 1)).reduce((a, seat) => a + 1, 0)} />
                            <ControlledTd className='table-danger' count={row.filter(seat => seat.state !== Seat.FREE && seat.state !== Seat.WALL).filter(seat => seat.tickets.some(ticket => ticket.confirmed === 0)).reduce((a, seat) => a + 1, 0)} />
                            <td>{row.filter(seat => seat.state === Seat.FREE).reduce((a, seat) => a + 1, 0) - row.filter(seat => seat.state !== Seat.FREE && seat.state !== Seat.WALL).filter(seat => seat.tickets.some(ticket => ticket.confirmed === 1)).reduce((a, seat) => a + 1, 0)}</td>
                        </tr>
                        <tr>
                            <th colSpan="3">Volná sedadla</th>
                            <td colSpan="3">{row.filter(seat => seat.state === Seat.FREE).map(seat => seat.col).join(', ')}</td>
                        </tr>
                        <tr>
                            <th colSpan="3">Obsazená sedadla</th>
                            <td colSpan="3">{row.filter(seat => seat.state !== Seat.FREE && seat.state !== Seat.WALL).map(seat => seat.col).join(', ')}</td>
                        </tr>
                        <ControlledTr
                            className="table-success"
                            name="Obsazená zaplacená sedadla"
                            count={row.filter(seat => seat.tickets.length > 0 && seat.tickets.every(ticket => ticket.confirmed === 1)).map(seat => seat.col).join(', ')}
                            cols={6}
                        />
                        <ControlledTr
                            className="table-success"
                            name="Obsazená zaplacená sedadla cena"
                            count={row.filter(seat => seat.tickets.length > 0 && seat.tickets.every(ticket => ticket.confirmed === 1)).map(seat => seat.price).reduce((a, c) => a + c, 0)}
                            cols={6}
                        />
                        <ControlledTr
                            className="table-danger"
                            name="Obsazená nezaplacená sedadla"
                            count={row.filter(seat => seat.tickets.length > 0 && seat.tickets.some(ticket => ticket.confirmed === 0)).map(seat => seat.col).join(', ')}
                            cols={6}
                        />
                        <ControlledTr
                            className="table-danger"
                            name="Obsazená nezaplacená sedadla cena"
                            count={row.filter(seat => seat.tickets.length > 0 && seat.tickets.every(ticket => ticket.confirmed === 0)).map(seat => seat.price).reduce((a, c) => a + c, 0)}
                            cols={6}
                        />
                        </tbody>
                    </table>
                ))}
            </div>
        )
    }

    render() {
        const {schema} = this.props;

        return (
            <DependencyManager spinner blocking={this.dependencies}>
                <section>
                    <h1>{schema && schema.name}</h1>
                    <p>Přehled obsazenosti jednotlivých sedadel</p>

                    <div className="row">
                        {schema && schema.seats[0] && schema.seats.length && this.renderSeats()}
                    </div>

                </section>
            </DependencyManager>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const id = parseInt(ownProps.match.params.id, 10);
    if (!state.schemas.schemas[id] || !state.schemas.schemas[id].seats) {
        return {
            schema: {
                seats: [],
            },
            apiKey: state.users.users[state.users.currentUser].token,
        };
    }

    const seats = state.schemas.schemas[id].seats.map(id => state.seats.seats[id]).filter(seat => !!seat).map(seat => ({
        ...seat,
        state: get(state.seats.seatsState, seat.id,
            seat.state === Seat.RESERVED && state.tickets.userSeats[state.users.currentUser] && state.tickets.userSeats[state.users.currentUser].includes(seat.id) ? Seat.MY : seat.state
        )
    }));

    let bucketedSeats = [];
    seats.forEach(seat => {
        if (!bucketedSeats[seat.y - 1]) {
            bucketedSeats[seat.y - 1] = []
        }
        if(!bucketedSeats[seat.y - 1][seat.x - 1]) {
            bucketedSeats[seat.y - 1][seat.x - 1] = seat
        }
    });


    return {
        schema: {
            ...state.schemas.schemas[id],
            seats: bucketedSeats,
            allSeats: seats
        },
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
        saveSchema(schema) {
            return dispatch(putTab({
                id: `overview_schema_${schema.id}`,
                index: 4,
                url: `/admin/schema/${schema.id}/overview`,
                name: `${schema.name} přehled`
            }))
        },
        addError(error) {
            return dispatch(addError(error));
        },
        addSuccess(message) {
            return dispatch(addSuccess(message));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OverviewSchema);
