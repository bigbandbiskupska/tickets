import autoBind from "react-autobind";
import React, {Component} from "react";
import classnames from "classnames";

import './schema.css'

class Seat extends Component {

    static WALL = 0;
    static FREE = 1;
    static RESERVED = 2;
    static TEMPORARY_RESERVED = 3;
    static MY = 4;

    constructor(props) {
        super(props);
        autoBind(this);
    }

    onMouseIn() {
        const{seat, onMouseIn} = this.props;
        onMouseIn && onMouseIn(seat)
    }

    onMouseOut() {
        const{seat, onMouseOut} = this.props;
        onMouseOut && onMouseOut(seat)
    }

    onMouseClick() {
        const{seat, onMouseClick} = this.props;
        onMouseClick && onMouseClick(seat)
    }

    render() {
        const {seat} = this.props;

        return (
            <td
                key={seat.id}
                className={classnames({
                    'bg-success': seat.state === Seat.FREE,
                    'bg-danger': seat.state === Seat.RESERVED,
                    'bg-warning': seat.state === Seat.TEMPORARY_RESERVED,
                    'bg-transparent': seat.state === Seat.WALL,
                    'schema-seat': true,
                })}
                onMouseEnter={this.onMouseIn}
                onMouseOut={this.onMouseOut}
                onClick={this.onMouseClick}
            >
                {seat.state !== Seat.WALL && seat.price}
            </td>
        );
    }
};

export default Seat;