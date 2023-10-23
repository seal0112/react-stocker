import React, { useState, useEffect, useCallback } from 'react'
import { Navbar } from 'react-bootstrap'
import Select from 'react-select'
import { useStock } from '../hooks/StockContext'
import { debounce } from '../utils/StockerTool'
import { getStockOptions } from '../utils/StockerAPI'

const Header = () => {
  const stock = useStock()
  const [stockOptions, setStockOptions] = useState([])
  const [stockInputValue, setStockInputValue] = useState('')

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
          />
        </div>
      </Navbar>
    </header>
  )
}

export default Header
