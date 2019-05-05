import React from 'react';
import autoBind from "react-autobind";
import {Redirect} from "react-router-dom";
import SchemaSeats from "./SchemaSeats";
import SchemaStats from "./SchemaStats";

export default class Schema extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    onMouseSeatClick(seat) {
        const {onMouseSeatClick} = this.props;
        onMouseSeatClick && onMouseSeatClick(seat)
    }

    render() {
        const {schema, seats} = this.props;

        if (!schema || !seats) {
            return null;
        }

        if (schema.hidden) {
            return (<Redirect to={'/'}/>);
        }

        return (
            <section>
                <div className="row">
                    <h2>{schema.name}</h2>
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
                    <SchemaSeats
                        seats={seats}
                        onMouseSeatClick={this.onMouseSeatClick}
                    />
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <h2>Statistika</h2>
                        <SchemaStats seats={seats}/>
                    </div>
                </div>
            </section>
        );
    }
}