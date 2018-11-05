import React from 'react';
import get from 'lodash/get';
import DependencyManager from "../DependencyManager";
import autoBind from "react-autobind";
import {addToTemporaryTicket, deleteFromTemporaryTicket, fetchSchema, fetchSeats} from "../../actions/index";
import {connect} from "react-redux";
import Seat from "./Seat";
import {putTab} from "../../actions";
import {Link, Redirect} from "react-router-dom";

class Schema extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);
        this.dependencies = [() => this.fetchData(props)];
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id !== this.props.match.params.id) {
            this.dependencies = [() => this.fetchData(nextProps)];
        }
    }

    componentDidMount() {
        this.interval = {
            interval: setInterval(() => {
                this.fetchData(this.props);
            }, 10 * 1000),
            stop: () => clearInterval(this.interval.interval)
        }
    }

    componentWillUnmount() {
        this.interval.stop()
    }

    fetchData(props) {
        const id = parseInt(props.match.params.id, 10);
        return Promise.all([
                props.loadSchema(props.apiKey, id, { forceLoad: true }).then(schema => this.props.saveSchema(schema)),
                props.loadSeats(props.apiKey, id),
            ]
        )
    }

    onMouseSeatIn(seat) {
    }

    onMouseSeatLeave(seat) {
    }

    onMouseSeatClick(seat) {
        if (seat.state === Seat.FREE) {
            this.props.addToTemporaryTicket(seat.id)
        } else if (seat.state === Seat.TEMPORARY_RESERVED) {
            this.props.deleteFromTemporaryTicket(seat.id);
        }
    }

    renderSeats() {
        const {schema} = this.props;
        const seats = schema.seats;


        let maxX = -1;
        let bucketedSeats = [];
        seats.forEach(seat => {
            if (!bucketedSeats[seat.y - 1]) {
                bucketedSeats[seat.y - 1] = []
            }
            if(!bucketedSeats[seat.y - 1][seat.x - 1]) {
                bucketedSeats[seat.y - 1][seat.x - 1] = seat
            }
            if(seat.x > maxX) {
                maxX = seat.x;
            }
        });

        if (!bucketedSeats || bucketedSeats.length === 0 || !bucketedSeats[0] || bucketedSeats[0].length === 0) {
            return null;
        }

        return (
            <table className="table schema">
                <thead>
                <tr>
                    <th></th>
                    <th className="table-info text-center" colSpan={maxX}>Jeviště</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {bucketedSeats.map((row, i) => {
                    const nonEmptySeats = row.filter(seat => seat.state !== Seat.WALL)
                    const nonEmpty = nonEmptySeats.length ? nonEmptySeats[0] : null;
                    return (
                        <tr key={i}>
                            <th>{nonEmpty ? nonEmpty.row : null}</th>
                            {row.map(seat => (
                                <Seat
                                    key={seat.id}
                                    seat={seat}
                                    onMouseIn={this.onMouseSeatIn}
                                    onMouseLeave={this.onMouseSeatLeave}
                                    onMouseClick={this.onMouseSeatClick}
                                />
                            ))}
                            <th>{nonEmpty ? nonEmpty.row : null}</th>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        );
    }

    renderStats() {
        const stats = {
            capacity: 0,
            free: 0,
            reserved: 0,
            price: 0,
            my: 0,
            myPrice: 0,
        }
        this.props.schema.seats.forEach(seat => {
            stats.capacity += seat.state !== Seat.WALL;
            stats.free += seat.state === Seat.FREE;
            stats.reserved += seat.state === Seat.MY;
            stats.reserved += seat.state === Seat.RESERVED;
            stats.reserved += seat.state === Seat.TEMPORARY_RESERVED;
            stats.price += seat.state !== Seat.WALL ? seat.price : 0;
            stats.my += seat.state === Seat.MY || seat.state === Seat.TEMPORARY_RESERVED;
            stats.myPrice += seat.state === Seat.MY ? seat.price : 0;
        })
        return (
            <table className="table">
                <tbody>
                <tr>
                    <th>Kapacita</th>
                    <td>{stats.capacity}</td>
                </tr>
                <tr>
                    <th>Obsazeno</th>
                    <td>{stats.reserved}</td>
                </tr>
                <tr>
                    <th>Volná místa</th>
                    <td>{stats.free}</td>
                </tr>
                <tr>
                    <th>Moje sedadla</th>
                    <td>{stats.my}</td>
                </tr>
                <tr>
                    <th>Cena mých sedadel</th>
                    <td>{stats.myPrice}</td>
                </tr>
                </tbody>
            </table>
        )
    }

    render() {
        const {schema, reservedCount} = this.props;

        return (
            <DependencyManager spinner blocking={this.dependencies}>
                {schema.hidden ? (<Redirect to={'/'} />) : (
                    <section>
                        <div className="row">
                            <h2>{schema && schema.name}</h2>
                        </div>

                        <div className="row">
                            <p>
                                Pokračujte výběrem sedadel a jejich rezervací. Na tuto akci můžete rezervovat
                                maximálně {schema.limit} sedadel.
                                Cenu jednotlivých sedadel můžete zjistit najetím myši na konkrétní sedadlo.
                            </p>
                        </div>

                        <div className="row">
                            <p>Barvy označují stav sedadel:
                                <span className="badge badge-success">Volné sedadlo</span>
                                <span className="badge badge-danger">Rezervované sedadlo</span>
                                <span className="badge badge-info">Vámi rezervované sedadlo</span>
                                <span className="badge badge-warning">Vámi vybrané sedadlo</span>
                            </p>
                        </div>

                        <div className="row schema-container">
                            {schema && schema.seats && this.renderSeats()}
                        </div>

                        {reservedCount > 0 ? (
                            <div className="row">
                                <div className="col-md-12">
                                    <hr/>
                                    <h2>Objednávka</h2>
                                    <p>Přejít do košíku</p>
                                    <Link className="btn btn-info" to={`/ticket`}>
                                        Zarezervovat
                                        {' '}
                                        {reservedCount > 0 ? (
                                            <span className="badge badge-dark"> {reservedCount}</span>) : null}
                                    </Link>
                                    <hr/>
                                </div>
                            </div>
                        ) : null}

                        <div className="row">
                            <div className="col-md-12">
                                <h2>Statistika</h2>
                                {schema && schema.seats && this.renderStats()}
                            </div>
                        </div>
                    </section>
                )}


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
            apiKey: state.users.users[state.users.currentUser].token
        };
    }

    const getSeats = () => {
        const length = state.schemas.schemas[id].seats.length
        const filtered = state.schemas.schemas[id].seats.map(seat_id => {
            return state.seats.seats[seat_id]
        }).filter(seat => !!seat);

        if(length !== filtered.length) {
            return []
        }

        return filtered.map(seat => ({
            ...seat,
            state: get(state.seats.seatsState, seat.id,
                seat.state === Seat.RESERVED && state.users.userSeats[state.users.currentUser] && state.users.userSeats[state.users.currentUser].includes(seat.id) ? Seat.MY : seat.state
            )
        }))
    }

    return {
        schema: {
            ...state.schemas.schemas[id],
            seats: getSeats(),
        },
        reservedCount: state.tickets.temporary ? state.tickets.temporary.seats.length : 0,
        apiKey: state.users.users[state.users.currentUser].token
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loadSeats(apiKey, schemaId) {
            return dispatch(fetchSeats(apiKey, schemaId))
        },
        loadSchema(apiKey, schemaId, {forceLoad = false} = {}) {
            return dispatch(fetchSchema(apiKey, schemaId, { forceLoad }))
        },
        addToTemporaryTicket(seatId) {
            return dispatch(addToTemporaryTicket(seatId))
        },
        deleteFromTemporaryTicket(seatId) {
            return dispatch(deleteFromTemporaryTicket(seatId))
        },
        saveSchema(schema) {
            return dispatch(putTab({
                id: `schema_${schema.id}`,
                index: 1,
                url: `/schema/${schema.id}`,
                name: schema.name
            }))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Schema);
