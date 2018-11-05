import React from 'react';
import Spinner from "./Spinner";


export default class Overlay extends React.Component {
    render() {
        const {show} = this.props;

        if (!show) {
            return null;
        }

        return (
            <div className="overlay">
                <Spinner/>
            </div>
        )
    }
}