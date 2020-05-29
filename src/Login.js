import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import './Login.css';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import * as StockerAPI from './utils/StockerAPI';


class Login extends Component {
    responseGoogle = (googleUser) => {
        console.log(googleUser);
        let id_token = googleUser.getAuthResponse().id_token;
        const data = {
            external_type: 'google',
            token: id_token
        }
        StockerAPI.login(data)
            .then(res=>res.data)
            .then(res=>this.handleAuthenticated(res))
            .catch(err=>console.log(err));
    }

    responseFacebook = (response) => {
        console.log(response);
        const access_token = response.accessToken;
        console.log(access_token)
        const data = {
            external_type: 'facebook',
            token: access_token
        }
        StockerAPI.login(data)
            .then(res=>res.data)
            .then(res=>this.handleAuthenticated(res))
            .catch(err=>console.log(err));
    }

    handleAuthenticated = (res) => {
        this.props.handleAuthenticated(res['isAuth'])
        if(res['isAuth']) {
            let { from } = this.props.history.location.state || { from: { pathname: "/" } };
            this.props.history.replace(from);
        }
    }

    handleClick = (event) => {
        event.preventDefault();
        let { from } = this.props.history.location.state || { from: { pathname: "/" } };
        this.props.history.replace(from);
    }

    render() {
        return (
            <div style={{textAlign: 'center'}}>
                <button onClick={this.handleClick} />
                <div className="login-btn-area">
                    <GoogleLogin
                        className="oauth-login-btn"
                        clientId="622841715235-kifmb8aoh7jvjt1kjpltdtut9tf8j3p5.apps.googleusercontent.com"
                        buttonText="Sign in with Google"
                        onSuccess={this.responseGoogle}
                        onFailure={this.responseGoogle}
                        cookiePolicy={'single_host_origin'}/>
                </div>
                <div className="login-btn-area">
                    <FacebookLogin
                        appId="2670950613176820"
                        autoLoad={false}
                        fields="name,email,picture"
                        callback={this.responseFacebook} />
                </div>
            </div>
        );
    }
}

export default withRouter(Login);
