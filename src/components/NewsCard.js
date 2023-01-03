import React from 'react'
import PropTypes from 'prop-types'
import { Badge } from 'react-bootstrap'
import dayjs from 'dayjs'

const NewsCard = (props) => {
  const feedSource = {
    mops: {
      text: '公告',
      badgeColor: 'info'
    },
    ctee: {
      text: '工商時報',
      badgeColor: 'success'
    },
    cnyes: {
      text: '鉅亨網',
      badgeColor: 'warning'
    },
    money: {
      text: '經濟日報',
      badgeColor: 'danger'
    }
  }

  return (
    <a href={props.link} target="_blank" rel="noreferrer">
      <li className="news-card" id={props.id}>
        <Badge pill bg={feedSource[props.source].badgeColor} style={{ color: 'white' }}>
          {feedSource[props.source].text}
        </Badge>
        <h5 className="news-card-title">{props.title}</h5>
        <p>{dayjs(props.releaseTime).format('YYYY/MM/DD HH:mm')}</p>
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
