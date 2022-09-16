import React, { useContext } from 'react'
import { Alert, Container } from 'react-bootstrap'
import { StockContext } from './StockContext'

const NoThisStock = () => {
  const stock = useContext(StockContext)

  return (
    <Container>
      <Alert variant="danger" dismissible>
        <Alert.Heading>查不到 {stock.stockNum} 這支股票</Alert.Heading>
      </Alert>
    </Container>)
}

export default NoThisStock
