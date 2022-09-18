import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/css/index.css'
import App from './App'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import * as serviceWorker from './serviceWorker'
import reportWebVitals from './reportWebVitals'
import { AuthProvider } from './hooks/AuthContext'
import { StockProvider } from './hooks/StockContext'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <AuthProvider>
      <StockProvider>
        <App />
      </StockProvider>
    </AuthProvider>
  </React.StrictMode>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
reportWebVitals()
