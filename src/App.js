import React, {Component} from 'react';
import {NavLink, Route} from 'react-router-dom';

import './App.css';
import SchemaList from './components/user/SchemaList';
import TicketList from './components/user/TicketList';
import Ticket from './components/user/Ticket';
import TemporaryTicket from "./components/user/TemporaryTicket";
import Login from "./components/Login";
import {connect} from "react-redux";
import autoBind from "react-autobind";
import {deleteTab} from "./actions";
import SchemaPage from "./components/user/SchemaPage";

class App extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    render() {
        return (
            <div>
                <ul className="nav nav-tabs" role="tablist">
                    {this.props.menu.map((renderTab, i) => (
                        <li key={i} role="presentation" className="nav-item">
                            {renderTab(this.state, this.props)}
                        </li>))}
                </ul>
                <div className="content">
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/" component={SchemaList}/>
                    <Route path={`/schema/:id`} component={SchemaPage}/>
                    <Route path={`/tickets`} component={TicketList}/>
                    <Route path={`/ticket/:id`} component={Ticket}/>
                    <Route exact path={`/ticket`} component={TemporaryTicket}/>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const seatIds = state.tickets.temporary ? state.tickets.temporary.seats : [];

    const menu = [
        (state, props) => (<NavLink exact className="nav-link" to={`/`}>Schéma</NavLink>),
        (state, props) => (
            <NavLink exact className="nav-link" to={`/ticket`}>
                Košík
                {' '}
                {props.seatIds.length > 0 ? (<span className="badge badge-dark"> {props.seatIds.length}</span>) : null}
            </NavLink>
        ),
        (state, props) => (<NavLink exact className="nav-link" to={`/tickets`}>Objednávky</NavLink>)
    ];


    return {
        ...ownProps,
        seatIds,
        menu,
        tabs: state.tabs.tabs
    }
}


function mapDispatchToProps(dispatch) {
    return {
        deleteTab(id) {
            return dispatch(deleteTab(id))
        }
    }
}


function mergeProps(props, dispatchProps) {
    const menu = props.menu;

    if (props.tabs && props.tabs.length > 0) {
        props.tabs.sort((a, b) => a.index > b.index).forEach((tab, i) => {
            menu.splice(tab.index + i, 0, (s, p) => (
                <div style={{position: 'relative'}}>
                    <NavLink exact className="nav-link" to={tab.url}>
                        {tab.name}
                    </NavLink>
                    <button type="button" onClick={() => dispatchProps.deleteTab(tab.id)} className="close"
                            style={{position: 'absolute', top: 1, right: 2, fontSize: '1rem'}} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            ))
        })
    }

    delete props.tabs

    return {
        ...props,
        ...dispatchProps,
        menu
    }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(App);
