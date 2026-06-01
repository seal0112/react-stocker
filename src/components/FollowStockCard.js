import React, { useState } from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import { Button } from 'react-bootstrap'

const UPDATE_FIELDS = [
  { label: '月營收', key: 'month_revenue_last_update' },
  { label: '財報', key: 'income_sheet_last_update' },
  { label: '法說會', key: 'earnings_call_last_update' },
  { label: '公告', key: 'announcement_last_update' },
  { label: '新聞', key: 'news_last_update' }
]

const FollowStockCard = ({ id, stock, longOrShort, comment, onRemove }) => {
  const [removing, setRemoving] = useState(false)
  const today = dayjs().format('YYYY-MM-DD')
  const dataUpdateDate = stock?.data_update_date || {}

  const handleRemove = async () => {
    if (!window.confirm(`確定要移除追蹤 ${stock.id} ${stock.公司簡稱}？`)) return
    setRemoving(true)
    try {
      await onRemove(id)
    } catch {
      setRemoving(false)
    }
  }

  return (
    <li className="follow-stock-card" id={id}>
      <div className="follow-stock-card-header">
        <div className={`follow-stock-${longOrShort}`}>
          {longOrShort === 'long' ? '偏多' : '偏空'}
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
          {comment && (
            <span className="follow-stock-comment">{comment}</span>
          )}
        </div>
        <Button
          variant="outline-danger"
          size="sm"
          disabled={removing}
          onClick={handleRemove}
          style={{ marginLeft: 'auto', flexShrink: 0 }}
        >
          {removing ? '移除中…' : '移除追蹤'}
        </Button>
      </div>
      <div className="follow-stock-update-dates">
        {UPDATE_FIELDS.map(({ label, key }) => {
          const date = dataUpdateDate[key]
          const isToday = date === today
          return (
            <div key={key} className={`follow-stock-update-item${isToday ? ' updated-today' : ''}`}>
              <span className="update-label">{label}</span>
              <span className="update-date">{date ? date.slice(5) : '—'}</span>
            </div>
          )
        })}
      </div>
    </li>
  )
}

FollowStockCard.propTypes = {
  id: PropTypes.string,
  stock: PropTypes.object,
  longOrShort: PropTypes.string,
  comment: PropTypes.string,
  onRemove: PropTypes.func
}

export default FollowStockCard
