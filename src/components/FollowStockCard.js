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
      <div style={{ display: 'flex' }}>
        <div
          className={`follow-stock-${longOrShort}`}
          style={{
            padding: '0.5rem',
            marginBottom: '0.5rem'
          }}
        >
          { longOrShort === 'long' ? '偏多' : '偏空' }
        </div>
        <div style={{ padding: '0.5rem', display: 'flex' }}>
          <a href={`/basic-info/daily-info/${stock.id}`} target="_blank" rel="noreferrer">
            <h5 className="follow-stock-title">{`${stock.id} ${stock.公司簡稱}`}</h5>
          </a>
          <span style={{ paddingLeft: '0.5rem' }}>
            { dayjs.tz(lastUpdateTime, 'utc').tz('Asia/Taipei').format('YYYY/MM/DD HH:mm') } 台灣時間
          </span>
        </div>
      </div>
      <p
        style={{
          paddingLeft: '0.5rem',
          width: '100%',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        }}
      >
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
