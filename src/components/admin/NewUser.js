import React from 'react';
import autoBind from "react-autobind";
import {connect} from "react-redux";
import {addError, addSuccess, createUser} from '../../actions';

import './schema.css';
import Overlay from "../Overlay";
import {Redirect} from "react-router-dom";

class NewUser extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);
        this.state = {
            isSaving: false,
            name: '',
            surname: '',
            email: '',
        }
    }

    onNameChange(event) {
        this.setState({
            name: event.target.value
        })
    }

    onSurnameChange(event) {
        this.setState({
            surname: event.target.value
        })
    }

    onEmailChange(event) {
        this.setState({
            email: event.target.value,
        })
    }

    onCreate(event) {
        this.setState({
            isSaving: true
        })
        this.props.createUser(this.props.apiKey, {
            'name': this.state.name,
            'surname': this.state.surname,
            'email': this.state.email,
        }).then(user => {
            this.setState({
                isSaving: false,
                userId: user.id,
            })

            return this.props.addSuccess('Uživatel byl úspěšně uloženo a byl uvědoměn emailem.')
        }).catch(error => {
            this.setState({
                isSaving: false
            })
            return this.props.addError(error)
        });
    }

    render() {
        if(this.state.userId) {
            return (<Redirect to={`/admin/user/${this.state.userId}`} />)
        }

        return (
            <section>
                <Overlay show={this.state.isSaving} />
                <div className="row">
                    <label htmlFor="name">
                        Jméno:
                    </label>
                    <input name="name" type="text" className="form-control" value={this.state.name}
                           onChange={this.onNameChange}/>
                </div>

                <div className="row">
                    <label htmlFor="surname">
                        Přijmení:
                    </label>
                    <input name="surname" type="text" className="form-control" value={this.state.surname}
                           onChange={this.onSurnameChange}/>
                </div>

                <div className="row">
                    <label htmlFor="email">
                        Email
                    </label>
                    <input name="email" type="text" className="form-control" value={this.state.email}
                           onChange={this.onEmailChange}/>
                </div>


                <div className="row">
                    <button className="btn btn-success" onClick={this.onCreate}>Vytvořit</button>
                </div>

            </section>
        );
    }
}

function mapStateToProps(state) {
    return {
        apiKey: state.users.users[state.users.currentUser].token,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createUser(apiKey, user) {
            return dispatch(createUser(apiKey, user))
        },
        addError(error) {
            return dispatch(addError(error));
        },
        addSuccess(message) {
            return dispatch(addSuccess(message));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewUser);
