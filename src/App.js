import React, { Component } from 'react';
import StockerLayout from './StockerLayout';
import Login from './Login';
import PrivateRoute from './PrivateRoute';
import { Switch, Route, withRouter } from "react-router-dom";
import * as StockerAPI from './utils/StockerAPI';


class StockerApp extends Component {
    constructor (props) {
        super(props)
        this.state = {
            isAuth: false
        }
    }

    componentDidMount = () => {
        StockerAPI.checkAuth()
            .then(res => res.data)
            .then(data => this.handleAuthenticated(data.isAuth))
    }

    handleAuthenticated = (isAuth) => {
        this.setState({isAuth})
        if(isAuth) {
            let { from } = this.props.history.location.state || { from: { pathname: "/" } };
            this.props.history.replace(from);
        }
    }

    render() {
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
                        component={StockerLayout} />
                </Switch>
            </div>
        )
    };
}

export default withRouter(StockerApp);
