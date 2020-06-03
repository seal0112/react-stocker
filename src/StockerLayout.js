import React, { Component } from 'react';
import './StockerLayout.css';
import Header from './Header';
import NaviBar from './NaviBar';
import StockInfoAndCommodity from './StockInfoAndCommodity';
import DailyInfo from './DailyInfo';
import Revenue from './Revenue';
import Eps from './Eps';
import IncomeSheet from './IncomeSheet';
import ProfitAnalysis from './ProfitAnalysis';
import OperatingExpensesAnalysis from './OperatingExpensesAnalysis';
import Login from './Login';
import { Route, Switch } from "react-router-dom";
import { Container } from 'react-bootstrap';

class StockerLayout extends Component {
    _isMounted = false;

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
        this._isMounted = true;

        this.checkPathnameStockNum();
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }

  render() {
    const stockNum = this.state.stockNum;
    return (
        <div className="Stocker">
            <Header handleStockNumChange={this.handleStockNumChange} />
            <NaviBar stockNum={stockNum}/>
            <Container>
                <StockInfoAndCommodity stockNum={this.state.stockNum}/>
                <hr />
                <Switch>
                    {["/", `/basic-info/daily-info/:stockNum`].map(path => (
                        <Route
                          key={path}
                          exact
                          path={path}>
                            <DailyInfo stockNum={stockNum}/>
                        </Route>
                      ))}
                    <Route path="/basic-info/company-data/:stockNum">
                        <p>company data</p>
                    </Route>
                    <Route key="news" path="/basic-info/news/:stockNum">
                        <p>news</p>
                    </Route>
                    <Route key="comment" path="/basic-info/comment/:stockNum">
                        <p>comment</p>
                    </Route>
                    <Route key="revenue" path="/financial-stat/revenue/:stockNum">
                        <Revenue stockNum={stockNum}/>
                    </Route>
                    <Route
                        key="eps"
                        path="/financial-stat/eps/:stockNum">
                            <Eps stockNum={stockNum}/>
                    </Route>
                    <Route
                        key="income-sheet"
                        path="/financial-stat/income-sheet/:stockNum">
                            <IncomeSheet stockNum={stockNum}/>
                    </Route>
                    <Route
                        key="profit-analysis"
                        path="/financial-stat/profit-analysis/:stockNum">
                            <ProfitAnalysis stockNum={stockNum}/>
                    </Route>
                    <Route
                        key="operating-expenses-analysis"
                        path="/financial-stat/operating-expenses-analysis/:stockNum">
                            <OperatingExpensesAnalysis stockNum={stockNum}/>
                    </Route>
                    <Route key="login" path="/login">
                        <Login />
                    </Route>
                    <Route path="*">
                        <p>no match</p>
                    </Route>
                    <Route path="/not-found">
                        <p>Can not find this stock: {this.state.stockNum}</p>
                    </Route>
                </Switch>
            </Container>
        </div>
    )};
}

export default StockerLayout;
