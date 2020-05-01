import React, { Component } from 'react';
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
        stockNum: "2330"
    }

    handleStockNumChange = (stockNum) => {
        this.setState({
            stockNum
        })
    }

    checkPathnameStockNum = () => {
        let location = window.location.pathname.split("/");
        if(location[3]){
            if(this.state.stockNum !== location[3]){
                this.handleStockNumChange(location[3]);
            }
        }
    }

    componentDidMount = () => {
        this.checkPathnameStockNum();
    }

  render() {
    const stockNum = this.state.stockNum;
    return (
        <div className="App">
            <Header handleStockNumChange={this.handleStockNumChange} />
            <NaviBar stockNum={stockNum}/>
            <Container>
                <h3>{this.state.stockNum} 台積電</h3>
                <hr />
                <Switch>
                    {["/", `/basic-info/daily-info/:stockNum`].map(path => (
                        <Route
                          key={path}
                          exact
                          path={path}>
                            <DailyInfo />
                        </Route>
                      ))}
                    <Route path="/basic-info/company-data">
                        <p>company data</p>
                    </Route>
                    <Route key="news" path="/basic-info/news">
                        <p>news</p>
                    </Route>
                    <Route key="comment" path="/basic-info/comment">
                        <p>comment</p>
                    </Route>
                    <Route key="revenue" path="/financial-stat/revenue">
                        <Revenue />
                    </Route>
                    <Route key="eps" path="/financial-stat/eps">
                        <Eps />
                    </Route>
                    <Route key="income-sheet" path="/financial-stat/income-sheet">
                        <IncomeSheet />
                    </Route>
                    <Route key="profit-analysis" path="/financial-stat/profit-analysis">
                        <ProfitAnalysis />
                    </Route>
                    <Route key="operating-expenses-analysis" path="/financial-stat/operating-expenses-analysis">
                        <OperatingExpensesAnalysis />
                    </Route>
                    <Route path="*">
                        <p>no match</p>
                    </Route>
                </Switch>
            </Container>
        </div>
    )};
}

export default StockerApp;
