import React, {Component} from 'react';
import autoBind from 'react-autobind';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {fetchSchemas, updateSchema} from "../../actions/index";
import DependencyManager from "../DependencyManager";
import BooleanBadge from "../BooleanBadge";
import {addError, deleteSchema} from "../../actions";
import {SyncLoader} from "react-spinners";


class Schema extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);
        this.state = {
            isSaving: false
        }
    }

    handleLock() {
        const {id, locked} = this.props;
        this.setState({
            isSaving: true
        })
        this.props.updateSchema(this.props.apiKey, id, {
            locked: !locked
        }).then(schema => {
            this.setState({
                isSaving: false
            })
        }).catch(error => {
            this.setState({
                isSaving: false
            })
            this.props.addError(error)
        })
    }

    handleHide() {
        const {id, hidden} = this.props;
        this.setState({
            isSaving: true
        })
        this.props.updateSchema(this.props.apiKey, id, {
            hidden: !hidden
        }).then(schema => {
            this.setState({
                isSaving: false
            })
        }).catch(error => {
            this.setState({
                isSaving: false
            })
            this.props.addError(error)
        })
    }

    handleDelete() {
        const {id} = this.props;
        this.setState({
            isSaving: true
        })
        this.props.deleteSchema(this.props.apiKey, id)
            .then(() => {
                this.setState({
                    isSaving: false
                })
            }).catch(error => {
            this.setState({
                isSaving: false
            });
            this.props.addError(error)
        })
    }

    render() {
        const {id, name, hidden, locked} = this.props;
        return (this.state.isSaving ? (
            <tr>
                <td colSpan="7"><SyncLoader className='text-centered-spinner'/></td>
            </tr>
        ) : (
            <tr>
                <td>
                    {id}
                </td>
                <td>
                    {name}
                </td>
                <td>
                    <Link className="badge badge-info" to={`/admin/schema/${id}`}>
                        Zobrazit
                    </Link>
                </td>
                <td>
                    <Link to={`/admin/schema/${id}/reserve`} className={'badge badge-warning'}>
                        Externí rezervace
                    </Link>
                </td>
                <td>
                    <BooleanBadge enabled={!locked} no={'Odemknout'} yes={'Uzamknout'} onClick={this.handleLock}/>
                </td>
                <td>
                    <BooleanBadge enabled={!hidden} no={'Zviditelnit'} yes={'Schovat'} onClick={this.handleHide}/>
                </td>
                <td>
                    <button
                        type="button"
                        className={'btn badge btn-danger'}
                        onClick={this.handleDelete}
                    >
                        Smazat
                    </button>
                </td>
            </tr>
        ));
    }
}

Schema = connect(state => ({
    apiKey: state.users.users[state.users.currentUser].token
}), dispatch => ({
        updateSchema: (apiKey, id, schema) => {
            return dispatch(updateSchema(apiKey, id, schema))
        },
        deleteSchema: (apiKey, id) => {
            return dispatch(deleteSchema(apiKey, id))
        },
        addError(error) {
            return dispatch(addError(error))
        }
    }
))(Schema);

class SchemaList extends Component {
    constructor(props) {
        super(props);
        autoBind(this);
        this.dependencies = [() => this.fetchData(props)]
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.apiKey !== this.props.apiKey) {
            this.dependencies = [() => this.fetchData(nextProps)];
        }
    }

    fetchData(props) {
        return props.loadSchemas(props.apiKey)
            .catch(error => props.addError(error))
    }

    render() {
        const {match, schemas} = this.props;

        return (
            <DependencyManager spinner blocking={this.dependencies}>
                Zde je přehled všech uložených schémat. Pokračovat můžete
                <ol>
                    <li>Vytvořením nového schématu kliknutím na 'Nové schéma'</li>
                    <li>Úpravou existujícího schématu kliknutím na 'Zobrazit'</li>
                    <li>Externí rezervací (uživatel není členem kapely) na určité schéma</li>
                    <li>Uzamknutím schématu (nelze v něm následně provádět rezervace)</li>
                    <li>Schováním schématu (není viditelné v seznamu schémat pro uživatele)</li>
                </ol>
                <table className="table table-striped">
                    <thead>

                    <tr>
                        <th>Číslo</th>
                        <th>Název</th>
                        <th>Odkaz</th>
                        <th>Rezervace</th>
                        <th>Zámek</th>
                        <th>Viditelnost</th>
                        <th>Smazat</th>
                    </tr>
                    </thead>
                    <tbody>

                    {schemas.map(schema => (
                        <Schema key={schema.id} match={match} {...schema} />
                    ))}
                    </tbody>

                    <tfoot>
                    <tr>
                        <th colSpan="6"></th>
                        <th>
                            <Link to={`/admin/schemas/new`}>
                                <button className="btn btn-success">Nové schéma</button>
                            </Link>
                        </th>
                    </tr>
                    </tfoot>
                </table>
            </DependencyManager>
        );
    }
}

function mapStateToProps(state) {
    return {
        schemas: Object.values(state.schemas.schemas),
        apiKey: state.users.users[state.users.currentUser].token
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loadSchemas(apiKey) {
            return dispatch(fetchSchemas(apiKey))
        },
        addError(error) {
            return dispatch(addError(error))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SchemaList);