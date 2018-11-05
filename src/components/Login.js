import React from 'react';
import autoBind from "react-autobind";
import {connect} from "react-redux";
import {addError, addSuccess, login} from '../actions';
import {Redirect} from "react-router-dom";

class Login extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);
        this.state = {
            email: '',
            password: '',
            loggedIn: false,
        }
    }

    getRedirect(location) {
        return (location.search && new URLSearchParams(location.search).get('redirect')) || undefined;
    }

    onEmailChange(event) {
        this.setState({
            email: event.target.value
        })
    }

    onPasswordChange(event) {
        this.setState({
            password: event.target.value
        })
    }

    onLogin(event) {
        event.preventDefault();

        this.props.login({
            'email': this.state.email,
            'password': this.state.password,
        }).then(user => {
            this.setState({
                loggedIn: true
            })
            return this.props.addSuccess(`Uživatel ${this.state.email} byl úspěšně přihlášen`)
        }).catch(error => {
            return this.props.addError(error)
        });
    }

    render() {
        if (this.state.loggedIn) {
            if (this.getRedirect(window.location)) {
                return <Redirect to={decodeURIComponent(this.getRedirect(window.location))}/>
            }
            return (<Redirect to={`/`}/>);
        }

        return (
            <form method="POST">
                <div className="row">
                    <div className="col-md-12">
                        <label htmlFor="name">
                            Email:
                        </label>
                        <input name="email" type="text" className="form-control" value={this.state.email}
                               onChange={this.onEmailChange}/>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <label htmlFor="limit">
                            Heslo:
                        </label>
                        <input name="limit" type="password" className="form-control" value={this.state.password}
                               onChange={this.onPasswordChange}/>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <input type="submit" className="btn btn-success" onClick={this.onLogin} value="Přihlásit"/>
                    </div>
                </div>

            </form>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        login(info) {
            return dispatch(login(info))
        },
        addError(error) {
            return dispatch(addError(error));
        },
        addSuccess(success) {
            return dispatch(addSuccess(success));
        },
    }
}

export default connect(null, mapDispatchToProps)(Login);
