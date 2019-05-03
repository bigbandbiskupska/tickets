import React, {Component} from 'react';
import {NavLink, Route, Switch} from 'react-router-dom';

import './AdminApp.css';
import SchemaList from './components/admin/SchemaList';
import Schema from './components/admin/Schema';
import NewSchema from './components/admin/NewSchema';
import Ticket from './components/user/Ticket';
import UserList from "./components/admin/UserList";
import User from "./components/admin/User";
import ReserveSchema from "./components/admin/ReserveSchema";
import TicketList from "./components/admin/TicketList";
import {connect} from "react-redux";
import {deleteTab} from "./actions";
import NewUser from "./components/admin/NewUser";
import OverviewSchema from "./components/admin/OverviewSchema";
import OverviewSchemaList from "./components/admin/OverviewSchemaList";
import OverviewTicketList from "./components/admin/OverviewTicketList";
import Checkpoints from "./components/admin/checkpoints/Checkpoints";

class AdminApp extends Component {
    render() {
        const {match} = this.props;
        return (
            <div>
                <ul className="nav nav-tabs" role="tablist">
                    {this.props.menu.map((renderTab, i) => (
                        <li key={i} role="presentation" className="nav-item">
                            {renderTab(this.state, this.props)}
                        </li>))}
                </ul>
                <div className="content">
                    <Route exact path={`${match.url}`} component={SchemaList}/>
                    <Route exact path={`${match.url}/schemas`} component={SchemaList}/>
                    <Route exact path={`${match.url}/schemas/overview`} component={OverviewSchemaList}/>
                    <Route exact path={`${match.url}/schemas/new`} component={NewSchema}/>
                    <Switch>
                        <Route path={`${match.url}/schema/:id/reserve`} component={ReserveSchema}/>
                        <Route path={`${match.url}/schema/:id/overview`} component={OverviewSchema}/>
                        <Route path={`${match.url}/schema/:id`} component={Schema}/>
                    </Switch>
                    <Route exact path={`${match.url}/tickets`} component={TicketList}/>
                    <Route exact path={`${match.url}/tickets/overview`} component={OverviewTicketList}/>
                    <Route exact path={`${match.url}/tickets/checkpoints`} component={Checkpoints}/>
                    <Route path={`${match.url}/ticket/:id`} component={Ticket}/>
                    <Route exact path={`${match.url}/users`} component={UserList}/>
                    <Route exact path={`${match.url}/users/new`} component={NewUser}/>
                    <Route path={`${match.url}/user/:id`} component={User}/>
                </div>
            </div>
        );
        //                <Route path={`${match.url}/tickets`} component={TicketList}/>
    }
}


function mapStateToProps(state, ownProps) {

    const menu = [
        (state, props) => (<NavLink exact className="nav-link"
                                    isActive={(match, location) => match || location.pathname === `${props.match.url}/schemas` || location.pathname === `${props.match.url}/` || location.pathname === `${props.match.url}`}
                                    to={`${props.match.url}/schemas`}>Schéma</NavLink>),
        (state, props) => (<NavLink exact className="nav-link" to={`${props.match.url}/users`}>Uživatelé</NavLink>),
        (state, props) => (<NavLink exact className="nav-link" to={`${props.match.url}/tickets`}>Objednávky</NavLink>),
        (state, props) => (
            <NavLink exact className="nav-link" to={`${props.match.url}/tickets/overview`}>Výdej</NavLink>),
        (state, props) => (
            <NavLink exact className="nav-link" to={`${props.match.url}/tickets/checkpoints`}>Checkpointy</NavLink>),
        (state, props) => (<NavLink exact className="nav-link" to={`${props.match.url}/schemas/overview`}>Přehled
            obsazenosti</NavLink>)
    ];


    return {
        ...ownProps,
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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(AdminApp);

