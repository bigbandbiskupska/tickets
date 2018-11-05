import React, {Component} from "react";
import {Route} from "react-router-dom";
import Authorized from "./Authorized";

export default class AdminRoute extends Component {
    render() {
        return (
          <Authorized roles={["administrator"]}>
              <Route {...this.props}>
                  {this.props.children}
              </Route>
          </Authorized>
        );
    }
}
