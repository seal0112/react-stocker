import React from 'react'
import { Container } from 'react-bootstrap'

import PushNotification from 'components/PushNotification'
import ApiTokenManager from 'components/ApiTokenManager'
import { useAuth } from 'hooks/AuthContext'

const UserInfo = () => {
  const { canManageTokens } = useAuth()

  return (
    <Container>
      <h2>用戶資料</h2>
      <PushNotification />
      {canManageTokens() && (
        <>
          <hr className="my-4" />
          <ApiTokenManager />
        </>
      )}
    </Container>
  )
}

export default UserInfo
