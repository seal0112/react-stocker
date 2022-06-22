import React, { Component } from 'react'
import './StockerLayout.css'
import PropTypes from 'prop-types'
import Header from './Header'
import NaviBar from './NaviBar'
import StockInfoAndCommodity from './StockInfoAndCommodity'
import NoThisStock from './NoThisStock'
import { Outlet } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import * as StockerAPI from './utils/StockerAPI'

class StockerLayout extends Component {
  _isMounted = false

  constructor (props) {
    super(props)
    this.state = {
      stockExist: false
    }
  }

  static propTypes = {
    handleStockNum: PropTypes.func.isRequired,
    stockNum: PropTypes.string.isRequired
  }

  handleStockExistChange = exist => {
    this.setState({
      stockExist: exist
    })
  }

  checkPathnameStockNum = () => {
    const location = window.location.pathname.split('/')
    if (location[3]) {
      if (location[3] && this.props.stockNum !== location[3]) {
        this.handleStockNum(location[3])
      }
    }
  }

  checkStockExist = () => {
    StockerAPI.checkStockExist(this.props.stockNum)
      .then(res => {
        console.log(res.status)
        if (res.status === 200) {
          this.handleStockExistChange(true)
        }
      })
      .catch(err => {
        console.log(err)
        if (err.response.status === 404) {
          this.handleStockExistChange(false)
        }
      })
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.stockNum !== prevState.stockNum) {
      this.checkStockExist(this.props.stockNum)
    }
  }

  componentDidMount = () => {
    this._isMounted = true
    this.checkPathnameStockNum()
    this.checkStockExist()
  }

  componentWillUnmount = () => {
    this._isMounted = false
  }

  render () {
    const { stockExist } = this.state
    console.log(this.props)
    return (
      <div className="Stocker">
        <Header handleStockNumChange={this.props.handleStockNum} />
        <NaviBar stockNum={this.props.stockNum}/>
            {stockExist
              ? <Container>
                  <StockInfoAndCommodity
                      stockNum={this.props.stockNum} />
                  <hr />
                  <Outlet />
                  </Container>
              : <NoThisStock stockNum={this.props.stockNum}/>
            }
        </div>
    )
  }
}

export default StockerLayout
