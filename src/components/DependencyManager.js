import React from 'react';
import PropTypes from 'prop-types';
import Spinner from "./Spinner";
import Overlay from "./Overlay";

export class DependencyManager extends React.Component {
    state = {
        loading: false,
        mounted: false,
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.blocking !== this.props.blocking || nextProps.nonBlocking !== this.props.nonBlocking) {
            this.loadDependencies(nextProps);
        }
    }

    componentWillMount() {
        this.setState({
            mounted: true
        });
        this.loadDependencies(this.props);
    }

    componentWillUnmount() {
        this.setState({
            mounted: false
        });
    }

    loadDependencies({ blocking, nonBlocking, onLoaded, onFailure }) {
        this.setState({ loading: true });

        this.runDependencies(nonBlocking);

        this.runDependencies(blocking).then(allPromises => {
            const errors = allPromises.filter(promise => promise instanceof Error);

            if (errors.length) {
                onFailure(allPromises);
            } else {
                onLoaded();
            }
            if(this.state.mounted) {
                this.setState({loading: false});
            }
        });
    }

    runDependencies(dependencies) {
        return Promise.all(
            dependencies.map(dep => {
                if(!(dep instanceof Promise)) {
                    dep = Promise.resolve(dep()).catch(error => {
                        this.props.onFailure(error);
                        return error;
                    });
                }
                return dep;
            }),
        );
    }

    render() {
        const { children, placeHolder, forceLoad, spinner, inline } = this.props;
        const { loading } = this.state;

        if (forceLoad || !loading) {
            return children;
        }

        return spinner ? <Spinner inline={inline} /> : placeHolder;
    }
}

DependencyManager.propTypes = {
    onLoaded: PropTypes.func,
    forceLoad: PropTypes.bool,
    onFailure: PropTypes.func,
    placeHolder: PropTypes.element,
    blocking: PropTypes.array.isRequired,
    nonBlocking: PropTypes.array,
    spinner: PropTypes.bool,
};

DependencyManager.defaultProps = {
    onLoaded: () => {},
    onFailure: () => {},
    forceLoad: false,
    nonBlocking: [],
    placeHolder: (<Overlay show={true} />),
    spinner: false,
    inline: false,
};

export default DependencyManager;
