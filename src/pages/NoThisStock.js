import React from 'react'
import { Alert, Container } from 'react-bootstrap'
import { useStock } from 'hooks/StockContext'

const NoThisStock = () => {
  const stock = useStock()

  return (
    <Container>
      <Alert variant="danger" dismissible>
        <Alert.Heading>查不到 {stock.stockNum} 這支股票</Alert.Heading>
      </Alert>
    </Container>)
}

export default NoThisStock
