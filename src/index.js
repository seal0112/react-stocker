import React from 'react'
import ReactDOM from 'react-dom/client'
import 'assets/css/index.css'
import App from 'App'
import reportWebVitals from 'reportWebVitals'
import { AuthProvider } from 'hooks/AuthContext'
import { StockProvider } from 'hooks/StockContext'

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

reportWebVitals()
