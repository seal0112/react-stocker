import React from 'react'
import {
  Navbar, Form, FormControl
} from 'react-bootstrap'
import { useStock } from '../hooks/StockContext'

const Header = () => {
  const stock = useStock()

  const handleSubmit = (event) => {
    event.preventDefault()
    stock.handleStockNum(event.target[0].value)
  }

  return (
    <header className="App-header">
      <Navbar variant="dark" expand="md">
        <Navbar.Brand>Stocker</Navbar.Brand>
        <Form className="mr-auto" onSubmit={handleSubmit}>
          <FormControl
            type="text"
            placeholder="Search"
            className="mr-sm-2"
            size="sm"
          />
        </Form>
      </Navbar>
    </header>
  )
}

export default Header
