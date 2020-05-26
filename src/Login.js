import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Login.css';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import * as StockerAPI from './utils/StockerAPI';
import axios from "axios";

const componentClicked = () => {
  console.log( "Clicked!" )
}

class Login extends Component {
    config = {

    }
    responseGoogle = (googleUser) => {
        console.log(googleUser);
        let id_token = googleUser.getAuthResponse().id_token;
        // StockerAPI.login(id_token)
        //     .then(res=>res.json())
        //     .then(res=>console.log(res))
        //     .catch(err=>console.log(err));
        axios.post("http://localhost:5001/api/auth/login", {
            token: id_token,
            external_type: 'google'
          },{
             withCredentials: true
          })
          .then((res) => {
            console.log(res.data);
            localStorage.setItem("access_token", res.data.access);
            localStorage.setItem("refresh_token", res.data.refresh);
          })
          .catch((err) => {
            console.log(err);
          });
    }

    responseFacebook = (response) => {
        console.log(response);
        const access_token = response.accessToken;
        console.log(access_token)
        axios.post("http://localhost:5001/api/auth/login", {
            token: access_token,
            external_type: 'facebook'
          },{
             withCredentials: true
          })
          .then((res) => {
            console.log(res.data);
            localStorage.setItem("access_token", res.data.access);
            localStorage.setItem("refresh_token", res.data.refresh);
          })
          .catch((err) => {
            console.log(err);
          });
    }

    render() {
        return (
            <div style={{textAlign: 'center'}}>
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
                        onClick={componentClicked}
                        callback={this.responseFacebook} />
                </div>
            </div>
        );
    }
}

export default Login;