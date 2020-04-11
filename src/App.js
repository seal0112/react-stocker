import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './Header';
import NaviBar from './NaviBar';
import { Route, Switch } from "react-router-dom";

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
            <Header handleStockNumChange={this.handleStockNumChange} />
            <NaviBar />
            <p>{this.state.stockNum}</p>
            <Switch>
                <Route path="/daily-info">
                    <p>daily-info</p>
                </Route>
                <Route path="/company-data">
                    <p>company data</p>
                </Route>
                <Route path="/news">
                    <p>news</p>
                </Route>
                <Route path="/comment">
                    <p>comment</p>
                </Route>
                <Route path="*">
                    <p>no match</p>
                </Route>
            </Switch>
        </div>
    )
  };
}

export default StockerApp;
