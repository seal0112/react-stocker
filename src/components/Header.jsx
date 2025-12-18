import React, { useState, useEffect, useCallback } from 'react'
import { Navbar, Button } from 'react-bootstrap'
import Select from 'react-select'
import { useNavigate } from 'react-router-dom'
import { useStock } from 'hooks/StockContext'
import { useAuth } from 'hooks/AuthContext'
import { debounce } from 'utils/StockerTool'
import { getStockOptions } from 'utils/StockerAPI'

const Header = () => {
  const stock = useStock()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stockOptions, setStockOptions] = useState([])
  const [stockInputValue, setStockInputValue] = useState('')

  const handleLogout = () => {
    logout().then(() => {
      navigate('/login')
    })
  }

  const handleStockOptionSelect = (option) => {
    if (option.value) {
      stock.handleStockNum(option.value)
    }
  }

  const handleStockInputValue = (value) => {
    setStockInputValue(value)
  }

  const debounceHandleStockInputValue = useCallback(debounce(handleStockInputValue, 500), [])

  useEffect(() => {
    if (!stockInputValue) {
      return
    }
    getStockOptions(stockInputValue).then(stocks => {
      setStockOptions(stocks.map(stock => {
        return {
          value: stock.stock,
          label: `${stock.stock} ${stock.name}`
        }
      }))
    })
  }, [stockInputValue])

  return (
    <header className="App-header">
      <Navbar variant="dark">
        <Navbar.Brand>Stocker</Navbar.Brand>
        <div style={{ width: '50%' }}>
          <Select
            options={stockOptions}
            onInputChange={debounceHandleStockInputValue}
            onChange={handleStockOptionSelect}
            menuPortalTarget={ document.body }
          />
        </div>
        {user && (
          <Button
            variant="outline-light"
            size="sm"
            onClick={handleLogout}
            className="ms-auto"
          >
            登出
          </Button>
        )}
      </Navbar>
    </header>
  )
}

export default Header
