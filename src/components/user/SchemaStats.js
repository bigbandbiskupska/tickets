import React from 'react';
import autoBind from "react-autobind";
import Seat from "./Seat";

export default class SchemaStats extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    render() {
        const {seats} = this.props;

        const stats = {
            capacity: 0,
            free: 0,
            reserved: 0,
            price: 0,
            my: 0,
            myPrice: 0,
        }

        seats.forEach(seat => {
            stats.capacity += seat.state !== Seat.WALL;
            stats.free += seat.state === Seat.FREE;
            stats.reserved += seat.state === Seat.MY;
            stats.reserved += seat.state === Seat.RESERVED;
            stats.reserved += seat.state === Seat.TEMPORARY_RESERVED;
            stats.price += seat.state !== Seat.WALL ? seat.price : 0;
            stats.my += seat.state === Seat.MY || seat.state === Seat.TEMPORARY_RESERVED;
            stats.myPrice += seat.state === Seat.MY ? seat.price : 0;
        });

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
}