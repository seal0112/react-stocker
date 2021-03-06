import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'

class PrivateRoute extends Component {
  static propTypes = {
    component: PropTypes.func.isRequired,
    isAuth: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired
  }

  render () {
    const { component: Component, isAuth, isLoading, ...rest } = this.props
    return (
      isLoading === true
        ? <Spinner
            animation="border"
            variant="success"
            style={{ position: 'relative', left: '50%' }} />
        : <Route
            {...rest}
            render={({ location }) =>
              isAuth
                ? (<Component />)
                : (<Redirect
                  to={{
                    pathname: '/login',
                    state: { from: location }
                  }}
                />)
            }
          />
    )
  }
}

export default PrivateRoute
