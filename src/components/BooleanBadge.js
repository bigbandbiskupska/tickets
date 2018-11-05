import React from "react";
import classnames from "classnames";
import autoBind from 'react-autobind';

export default class BooleanBadge extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);
    }

    onClick() {
        const {onClick} = this.props;
        onClick && onClick()
    }

    render() {
        const {enabled, yes, no, onClick} = this.props;
        return (
            onClick ? (
                <button
                    type="button"
                    className={classnames('btn', 'badge', 'btn-' + (enabled ? 'success' : 'danger'))}
                    onClick={this.onClick}
                >
                    {enabled ? yes : no}
                </button>
            ) : (
                <span
                    className={classnames('badge', 'badge-' + (enabled ? 'success' : 'danger'))}
                >
                    {enabled ? yes : no}
                </span>
            )
        );
    }
}