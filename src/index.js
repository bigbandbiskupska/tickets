import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css'
import './index.css';
import './heroic-features.css';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import store from './store';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import AdminApp from "./AdminApp";
import Authenticated from "./components/Authenticated";
import AdminRoute from "./components/AdminRoute";
import Login from "./components/Login";
import Logout from "./components/Logout";
import {fetchTemporaryTicket, loginFromLocalStorage} from './actions';
import DependencyManager from "./components/DependencyManager";
import Messages from "./components/Messages";

ReactDOM.render(
    <Provider store={store}>
        <DependencyManager
            blocking={[() => loginFromLocalStorage()(store.dispatch), () => fetchTemporaryTicket()((store.dispatch))]}>
            <Router>
                <div>
                    <nav className="navbar navbar-expand-lg navbar-dark bg-dark static-top">
                        <div className="container">
                            <Link to="/" className="navbar-brand">Lístky</Link>
                            <button className="navbar-toggler" type="button" data-toggle="collapse"
                                    data-target="#navbarResponsive"
                                    aria-controls="navbarResponsive" aria-expanded="false"
                                    aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarResponsive">
                                <ul className="navbar-nav ml-auto">
                                    <li>
                                        <Link to={`/admin`} className="nav-link">Administrace</Link>
                                    </li>
                                    <li>
                                        <Logout className="nav-link">Odhlásit</Logout>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>

                    <div id="root" className="container content">
                        <Messages/>
                        <Switch>
                            <Route exact path="/login" component={Login}/>
                            <Authenticated>
                                <Switch>
                                    <AdminRoute path="/admin" component={AdminApp}/>
                                    <Route path="/" component={App}/>
                                </Switch>
                            </Authenticated>
                        </Switch>
                    </div>


                    <footer className="bg-dark navbar navbar-default fixed-bottom copyright">
                        <div className="container">
                            <p className="m-0 text-center text-white">Copyright &copy; Tuli 2018</p>
                        </div>
                    </footer>

                </div>

            </Router>
        </DependencyManager>
    </Provider>,
    document.getElementById('page')
)

registerServiceWorker();
