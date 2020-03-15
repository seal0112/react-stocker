import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './Header';
import { Button, Container } from 'react-bootstrap';

class StockerApp extends Component {
  state = {
    stockNum: 2330
  }

  handleStockNumChange = (stockNum) => {
    this.setState({
        stockNum
    })
  }

  render() {
    return (
        <div className="App">
            <Header handleStockNumChange={this.handleStockNumChange}/>
            <p>{this.state.stockNum}</p>
        </div>
    )
  };
}

export default StockerApp;
