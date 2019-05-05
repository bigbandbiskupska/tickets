import React, {Component} from 'react';
import autoBind from 'react-autobind';
import {connect} from 'react-redux';
import classnames from "classnames";
import {Link} from 'react-router-dom';
import {fetchSchemas} from "../../actions/index";
import DependencyManager from "../DependencyManager";
import {addError} from "../../actions";

import 'font-awesome/css/font-awesome.min.css'

const Schema = ({match, id, name, hidden, locked}) => {
    if (hidden) {
        return null;
    }

    return (
        <tr>
            <td>
                <Link to={`${match.url === '/' ? '' : match.url}/schema/${id}`}>
                    {name}
                </Link>
            </td>
            <td>
                <span className={classnames({
                    'fa': true,
                    'fa-lock': locked
                })} />
            </td>
        </tr>
    );
}

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
                <p>
                    Pokračujte výběrem akce ze seznamu níže. V uzamčených akcích nelze provádět rezervace.
                </p>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Název</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {schemas.filter(schema => !schema.hidden).map(schema => (
                            <Schema key={schema.id} match={match} {...schema} />
                        ))}
                    </tbody>
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