import React from 'react';
import autoBind from "react-autobind";
import Seat from "./Seat";
import {connect} from "react-redux";
import {getBucketedSeats} from "../../selectors";

class SchemaSeats extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    render() {
        const {seats, maxX} = this.props;

        if (!seats || seats.length === 0 || !seats[0] || seats[0].length === 0) {
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
                {seats.map((row, i) => {
                    const nonEmptySeats = row.filter(seat => seat.state !== Seat.WALL)
                    const nonEmpty = nonEmptySeats.length ? nonEmptySeats[0] : null;
                    return (
                        <tr key={i}>
                            <th>{nonEmpty ? nonEmpty.row : null}</th>
                            {row.map(seat => (
                                <Seat
                                    key={seat.id}
                                    seat={seat}
                                    onMouseIn={this.props.onMouseSeatIn}
                                    onMouseLeave={this.props.onMouseSeatLeave}
                                    onMouseClick={this.props.onMouseSeatClick}
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
}

function mapStateToProps(state, ownProps) {
    return {
        seats: getBucketedSeats(ownProps.seats),
        maxX: ownProps.seats.reduce((acc, seat) => seat.x > acc ? seat.x : acc, 0)
    }
}

export default connect(mapStateToProps, null)(SchemaSeats);