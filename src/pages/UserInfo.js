import React from 'react'
import { Container } from 'react-bootstrap'

import PushNotification from 'components/PushNotification'

const UserInfo = () => {
  return (
    <Container>
      <h2>用戶資料</h2>
      <PushNotification />
    </Container>
  )
}

export default UserInfo
