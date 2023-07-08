import React, { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'

import * as followStockApi from '../utils/FollowStockAPI'

const FollowStockList = () => {
  const [followStocks, setFollowStocks] = useState([])

  useEffect(() => {
    followStockApi.getFollowStockList().then(data => {
      console.log(data)
      setFollowStocks(data)
    })
  }, [])
  return (
    <Container>
      <h2>追蹤個股清單</h2>
      <ul>
        {
          followStocks.map(followStock => (
            <li key={`${followStock.id}`}>
              {
                `${followStock.stock_id} ${followStock.long_or_short}`
              }
            </li>
          ))
        }
      </ul>
    </Container>
  )
}

export default FollowStockList
