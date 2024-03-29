import React from 'react'
import PropTypes from 'prop-types'
import { Badge } from 'react-bootstrap'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import '../assets/css/NewsIcon.css'

dayjs.extend(utc)
dayjs.extend(timezone)

const NewsCard = (props) => {
  const feedSource = {
    mops: {
      text: '公告',
      badgeColor: 'info'
    },
    ctee: {
      text: '工商時報',
      badgeColor: 'secondary',
      className: 'ctee-icon'
    },
    cnyes: {
      text: '鉅亨網',
      badgeColor: 'warning'
    },
    money: {
      text: '經濟日報',
      badgeColor: 'danger'
    },
    yahoo: {
      text: 'Yahoo',
      badgeColor: 'secondary',
      className: 'yahoo-icon'
    }
  }

  return (
    <a href={props.link} target="_blank" rel="noreferrer">
      <li className="news-card" id={props.id}>
        <Badge
          pill
          bg={feedSource[props.source].badgeColor}
          text="light"
          className={feedSource[props.source].className}
        >
          {feedSource[props.source].text}
        </Badge>
        <h5 className="news-card-title">{props.title}</h5>
        <p>
          { dayjs.tz(props.releaseTime, 'utc').tz('Asia/Taipei').format('YYYY/MM/DD HH:mm') } 台灣時間
        </p>
      </li>
    </a>
  )
}

NewsCard.propTypes = {
  id: PropTypes.string,
  source: PropTypes.string,
  title: PropTypes.string,
  releaseTime: PropTypes.string,
  link: PropTypes.string
}

export default NewsCard
