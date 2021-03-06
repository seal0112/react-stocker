import React, { Component } from 'react'
import PropTypes from 'prop-types'
import StockerLayout from './StockerLayout'
import Login from './Login'
import PrivateRoute from './PrivateRoute'
import { Switch, Route, withRouter } from 'react-router-dom'
import * as StockerAPI from './utils/StockerAPI'

/**
 * Stocker main compoment.
 */
class StockerApp extends Component {
  /**
  * constructor.
  * @param {object} props.
  */
  constructor (props) {
    super(props)
    this.state = {
      isAuth: false,
      isLoading: true
    }
  }

  static propTypes = {
    history: PropTypes.object.isRequired
  }

  componentDidMount = () => {
    StockerAPI.checkAuth()
      .then(res => res.data)
      .then(data => this.handleAuthenticated(data))
  }

  handleAuthenticated = (res) => {
    this.setState({
      isAuth: res.isAuth,
      isLoading: false
    })
    if (res.isAuth) {
      console.log(this.props.history.location)

      const { from } = this.props.history.location.state || { from: { pathname: '/' } }
      this.props.history.replace(from)
    }
  }

  render () {
    return (
      <div className="App">
        <Switch>
          <Route
              exact path="/login"
              handleAuthenticated={this.handleAuthenticated}>
            <Login handleAuthenticated={this.handleAuthenticated}/>
          </Route>
          <PrivateRoute
              path="/"
              isAuth={this.state.isAuth}
              isLoading={this.state.isLoading}
              component={StockerLayout}/>
        </Switch>
      </div>
    )
  }
}

export default withRouter(StockerApp)
