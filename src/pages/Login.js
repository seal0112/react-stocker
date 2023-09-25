import React, { useState, useEffect } from 'react'
import '../assets/css/Login.css'
import { useNavigate, useLocation } from 'react-router-dom'
import GoogleLogin from 'react-google-login'
import FacebookLogin from 'react-facebook-login'
import { Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../hooks/AuthContext'

const Login = () => {
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [alertShow, setAlertShow] = useState(false)
  const [alertContent, setAlertContent] = useState('')

  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state ? location.state.from.pathname : '/'

  const responseGoogle = googleUser => {
    const idToken = googleUser.getAuthResponse().id_token
    const data = {
      external_type: 'google',
      token: idToken
    }
    auth.login(data)
      .then(() => { navigate(from, { replace: true }) })
      .catch(err => {
        if (err.response.status === 401) {
          setAlertStatus(true, '帳號不存在')
        }
        if (err.response.status === 403) {
          setAlertStatus(true, '帳號權限未開通')
        }
      })
  }

  const responseFacebook = response => {
    const accessToken = response.accessToken
    const data = {
      external_type: 'facebook',
      token: accessToken
    }
    auth.login(data)
      .then(() => { navigate(from, { replace: true }) })
      .catch(err => {
        if (err.response.status === 401) {
          setAlertShow(true, '帳號不存在')
        }
        if (err.response.status === 403) {
          setAlertShow(true, '帳號權限未開通')
        }
      })
  }

  const loginWithAccount = event => {
    event.preventDefault()
    const data = {
      external_type: 'internal',
      data: {
        account,
        password
      }
    }
    auth.login(data)
      .then(() => { navigate(from, { replace: true }) })
      .catch(err => {
        if (err.response.status === 401) {
          setAlertStatus(true, '帳號或密碼錯誤')
        }
        if (err.response.status === 403) {
          setAlertStatus(true, '帳號權限未開通')
        }
      })
  }

  const handleChangeAccount = event => {
    setAccount(event.target.value)
  }

  const handleChangePassword = event => {
    setPassword(event.target.value)
  }

  const setAlertStatus = (toggle, content) => {
    setAlertContent(content)
    setAlertShow(toggle)
  }

  useEffect(() => {
    auth.getAccountData().then((user) => {
      if (user) {
        navigate(from, { replace: true })
      }
    })
  }, [])

  return (
    <div className="login-component text-center">
      <Form className="form-signin login-title" onSubmit={loginWithAccount}>
        {alertShow &&
          <Alert
              className="alert-login"
              variant="danger"
              onClose={() => setAlertStatus(false)}
              dismissible>
            <Alert.Heading>You got problem!</Alert.Heading>
            <p>
              { alertContent }
            </p>
          </Alert>
        }
        <h1 className="h3 mb-3">Stocker</h1>
        <Form.Group controlId="formBasicAccount">
          <Form.Label className="sr-only">Account</Form.Label>
          <Form.Control
              type="text"
              placeholder="Account"
              onChange={handleChangeAccount} />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label className="sr-only">Password</Form.Label>
          <Form.Control
              type="password"
              placeholder="Password"
              onChange={handleChangePassword}/>
        </Form.Group>
        <Button
            className="form-btn"
            variant="primary"
            size="lg"
            type="submit">
            Sign in
        </Button>
        <div className="login-btn-area">
          <GoogleLogin
              className="oauth-login-btn"
              clientId="622841715235-kifmb8aoh7jvjt1kjpltdtut9tf8j3p5.apps.googleusercontent.com"
              buttonText="Sign in with Google"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={'single_host_origin'} />
        </div>
        <div className="login-btn-area">
          <FacebookLogin
              appId="2670950613176820"
              autoLoad={false}
              fields="name,email,picture"
              callback={responseFacebook} />
        </div>
      </Form>
    </div>
  )
}

export default Login
