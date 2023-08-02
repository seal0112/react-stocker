import React from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

const FollowStockCard = ({ id, stock, longOrShort, comment, lastUpdateTime }) => {
  return (
    <a target="_blank" rel="noreferrer">
      <li className="news-card" id={id}>
        <div style={{ display: 'flex' }}>
          <h5 className="follow-stock-title">{`${stock.id} ${stock.公司簡稱}`}</h5>
          <span>{ longOrShort === 'long' ? '偏多' : '偏空' }</span>
        </div>
        <p>{ dayjs.tz(lastUpdateTime, 'utc').tz('Asia/Taipei').format('YYYY/MM/DD HH:mm') } 台灣時間</p>
        <p>備註: { comment }</p>
      </li>
    </a>
  )
}

FollowStockCard.propTypes = {
  id: PropTypes.string,
  stock: PropTypes.object,
  longOrShort: PropTypes.string,
  lastUpdateTime: PropTypes.string,
  comment: PropTypes.string
}

export default FollowStockCard
