import React, { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import FollowStockCard from 'components/FollowStockCard'

import * as followStockApi from 'utils/FollowStockAPI'

const FollowStockList = () => {
  const [followStocks, setFollowStocks] = useState([])

  useEffect(() => {
    followStockApi.getFollowStockList().then(data => {
      setFollowStocks(data)
    })
  }, [])
  return (
    <Container>
      <h2>追蹤個股清單</h2>
      <p>追蹤總數: {followStocks.length}間公司</p>
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {
          followStocks.map(followStock => (
            <FollowStockCard
              key={followStock.id}
              id={followStock.id}
              stock={followStock.stock}
              longOrShort={followStock.long_or_short}
              lastUpdateTime={followStock.last_update_time}
              comment={followStock.comment}
            ></FollowStockCard>

          ))
        }
      </ul>
    </Container>
  )
}

export default FollowStockList
