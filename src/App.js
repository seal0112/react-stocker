import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './Header';
import NaviBar from './NaviBar';
import DailyInfo from './DailyInfo';
import Revenue from './Revenue';
import Eps from './Eps';
import IncomeSheet from './IncomeSheet';
import ProfitAnalysis from './ProfitAnalysis';
import OperatingExpensesAnalysis from './OperatingExpensesAnalysis';
import { Route, Switch } from "react-router-dom";
import { Container } from 'react-bootstrap';

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
            <Container>
                <h3>{this.state.stockNum} 台積電</h3>
                <hr />
                <Switch>
                    {["/", "/daily-info"].map(path => (
                        <Route
                          key={path}
                          exact
                          path={path}>
                            <DailyInfo />
                        </Route>
                      ))}
                    <Route path="/company-data">
                        <p>company data</p>
                    </Route>
                    <Route key="news" path="/news">
                        <p>news</p>
                    </Route>
                    <Route key="comment" path="/comment">
                        <p>comment</p>
                    </Route>
                    <Route key="revenue" path="/revenue">
                        <Revenue />
                    </Route>
                    <Route key="eps" path="/eps">
                        <Eps />
                    </Route>
                    <Route key="income-sheet" path="/income-sheet">
                        <IncomeSheet />
                    </Route>
                    <Route key="profit-analysis" path="/profit-analysis">
                        <ProfitAnalysis />
                    </Route>
                    <Route key="operating-expenses-analysis" path="/operating-expenses-analysis">
                        <OperatingExpensesAnalysis />
                    </Route>
                    <Route path="*">
                        <p>no match</p>
                    </Route>
                </Switch>
            </Container>
        </div>
    )
  };
}

export default StockerApp;
