import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import {Spinner} from 'react-bootstrap';


class PrivateRoute extends Component {
  render() {
    const {component: Component, isAuth, isLoading, ...rest} = this.props;
    return (
          isLoading === true ?
            <Spinner
              animation="border"
              variant="success"
              style={{position: 'relative', left: '50%'}}/>:
            <Route
              {...rest}
              render={({location}) =>
                  isAuth ? (
                    <Component />
                  ) : (
                    <Redirect
                      to={{
                        pathname: '/login',
                        state: {from: location},
                      }}
                    />
                  )
              }
            />
    );
  }
}

export default PrivateRoute;
