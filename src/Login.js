import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './css/Login.css'
import GoogleLogin from 'react-google-login'
import FacebookLogin from 'react-facebook-login'
import * as StockerAPI from './utils/StockerAPI'
import { Form, Button, Alert } from 'react-bootstrap'

class Login extends Component {
  propTypes = {
    handleAuthenticated: PropTypes.bool.isRequired
  }

  state = {
    account: '',
    password: '',
    alertShow: false,
    alertContent: 'ccc'
  }

  responseGoogle = googleUser => {
    const idToken = googleUser.getAuthResponse().id_token
    const data = {
      external_type: 'google',
      token: idToken
    }
    StockerAPI.login(data)
      .then(this.props.handleAuthenticated)
      .catch(err => this.setAlertShow(true, err.response.data))
  }

  responseFacebook = response => {
    const accessToken = response.accessToken
    const data = {
      external_type: 'facebook',
      token: accessToken
    }
    StockerAPI.login(data)
      .then(this.props.handleAuthenticated)
      .catch(err => this.setAlertShow(true, err.response.data))
  }

  loginWithAccount = event => {
    event.preventDefault()
    const data = {
      external_type: 'internal',
      data: {
        account: this.state.account,
        password: this.state.password
      }
    }
    console.log(data)
    this.setAlertShow(true, '帳號登入尚未完成')
    // StockerAPI.login(query)
    //  .then(this.props.handleAuthenticated)
    //  .catch(err=>this.setAlertShow(true, err.response.data));
  }

  handleAccountInput = event => {
    const value = event.target.value
    this.setState(() => ({ account: value }))
  }

  handlePasswordInput = event => {
    const value = event.target.value
    this.setState(() => ({ password: value }))
  }

  setAlertShow = (toggle, content) => {
    this.setState({
      alertShow: toggle,
      alertContent: content
    })
  }

  render () {
    return (
      <div className="login-component text-center">
        <Form className="form-signin login-title" onSubmit={this.loginWithAccount}>
          {this.state.alertShow &&
            <Alert
                className="alert-login"
                variant="danger"
                onClose={() => this.setAlertShow(false)}
                dismissible>
              <Alert.Heading>You got problem!</Alert.Heading>
              <p>
                { this.state.alertContent }
              </p>
            </Alert>
          }
          <h1 className="h3 mb-3">Stocker</h1>
          <Form.Group controlId="formBasicAccount">
            <Form.Label className="sr-only">Account</Form.Label>
            <Form.Control type="text"
              placeholder="Account"
              onChange={this.handleAccountInput} />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label className="sr-only">Password</Form.Label>
            <Form.Control type="password"
              placeholder="Password"
              onChange={this.handlePasswordInput}/>
          </Form.Group>
          <Button
            className="form-btn"
            variant="primary"
            size="lg"
            type="submit" block>
            Sign in
          </Button>
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
        </Form>
      </div>
    )
  }
}

export default Login
