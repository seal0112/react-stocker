import React, { Component } from 'react'
import {
    Route,
    Redirect
} from "react-router-dom";


class PrivateRoute extends Component {
    render () {
        const { component: Component, isAuth, ...rest } = this.props;
        return (
          <Route
            {...rest}
            render={({ location }) =>
              isAuth ? (
                <Component />
              ) : (
                <Redirect
                  to={{
                    pathname: "/login",
                    state: { from: location }
                  }}
                />
              )
            }
          />)
    }
}

export default PrivateRoute;