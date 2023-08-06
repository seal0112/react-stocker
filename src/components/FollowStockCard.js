import React from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

const FollowStockCard = ({ id, stock, longOrShort, comment, lastUpdateTime }) => {
  return (
    <li className="follow-stock-card" id={id}>
      <div className="follow-stock-card-header">
        <div className={`follow-stock-${longOrShort}`}>
          { longOrShort === 'long' ? '偏多' : '偏空' }
        </div>
        <div className="follow-stock-hearder-container">
          <a
            className="follow-stock-header-title"
            href={`/basic-info/daily-info/${stock.id}`}
            target="_blank"
            rel="noreferrer"
          >
            {`${stock.id} ${stock.公司簡稱}`}
          </a>
          <span className="follow-stock-header-time">
            { dayjs.tz(lastUpdateTime, 'utc').tz('Asia/Taipei').format('YYYY/MM/DD HH:mm') } 台灣時間
          </span>
        </div>
      </div>
      <p className="follow-stock-card-content">
        備註: { comment }
      </p>
    </li>
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
