import React, {Component} from 'react';
import autoBind from 'react-autobind';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {fetchSchemas} from "../../actions/index";
import DependencyManager from "../DependencyManager";
import {addError} from "../../actions";


class Schema extends React.Component {

    render() {
        const {id, name} = this.props;
        return (
            <tr>
                <td>
                    {id}
                </td>
                <td>
                    {name}
                </td>
                <td>
                    <Link className="badge badge-info" to={`/admin/schema/${id}/overview`}>
                        Zobrazit
                    </Link>
                </td>
            </tr>
        );
    }
}

class OverviewSchemaList extends Component {
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
                Zde si můžete zobrazit přehled jednotlivých akcí.
                <table className="table table-striped">
                    <thead>

                    <tr>
                        <th>Číslo</th>
                        <th>Název</th>
                        <th>Odkaz</th>
                    </tr>
                    </thead>
                    <tbody>

                    {schemas.map(schema => (
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

export default connect(mapStateToProps, mapDispatchToProps)(OverviewSchemaList);