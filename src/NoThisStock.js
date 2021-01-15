import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert, Container } from 'react-bootstrap'

class NoThisStock extends Component {
  static propTypes = {
    stockNum: PropTypes.string.isRequired
  }

  render () {
    return (
      <Container>
        <Alert variant="danger" dismissible>
          <Alert.Heading>查不到 {this.props.stockNum} 這支股票</Alert.Heading>
        </Alert>
      </Container>)
  }
}

export default NoThisStock
