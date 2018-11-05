import autoBind from "react-autobind";
import React, {Component} from "react";
import classnames from "classnames";

import { Tooltip } from 'react-tippy';

import 'react-tippy/dist/tippy.css'

class Seat extends Component {

    static WALL = 0;
    static FREE = 1;
    static RESERVED = 2;
    static TEMPORARY_RESERVED = 3;
    static MY = 4;

    constructor(props) {
        super(props);
        autoBind(this);
        this.state = {
            mouseIn: false
        }
    }

    onMouseIn() {
        const{seat, onMouseIn} = this.props;
        onMouseIn && onMouseIn(seat)
        this.setState({
            mouseIn: true
        })
    }

    onMouseLeave() {
        const{seat, onMouseLeave} = this.props;
        onMouseLeave && onMouseLeave(seat)
        this.setState({
            mouseIn: false
        })
    }

    onMouseClick() {
        const{seat, onMouseClick} = this.props;
        onMouseClick && onMouseClick(seat)
    }

    render() {
        const {seat} = this.props;
        const {mouseIn} = this.state;

        const title = seat.tickets && seat.tickets.length > 0 && seat.tickets.map(ticket => ticket.note).join('');
        const shortTitle = title && title.split(" ").length && title.split(" ").map(part => (part[0] && part[0].toUpperCase()) || '').join('');

        return (
            <td
                key={seat.id}
                className={classnames({
                    'bg-success': seat.state === Seat.FREE,
                    'bg-danger': seat.state === Seat.RESERVED,
                    'bg-warning': seat.state === Seat.TEMPORARY_RESERVED,
                    'bg-info': seat.state === Seat.MY,
                    'bg-transparent': seat.state === Seat.WALL,
                    'seat': true
                })}
                onMouseEnter={this.onMouseIn}
                onMouseLeave={this.onMouseLeave}
                onClick={this.onMouseClick}
            >
                {title ? (
                    <Tooltip title={title} open={mouseIn}>{shortTitle}</Tooltip>
                ) : seat.state === Seat.WALL ? null : (
                    <Tooltip title={`Řada ${seat.row} sedadlo ${seat.col}. Cena ${seat.price}`} open={mouseIn}>
                        {seat.col}
                    </Tooltip>
                )}
            </td>
        );
    }
};

export default Seat;