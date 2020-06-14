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
import NoThisStock from './NoThisStock';
import { Route, Switch } from "react-router-dom";
import { Container } from 'react-bootstrap';
import * as StockerAPI from './utils/StockerAPI';

class StockerLayout extends Component {
    _isMounted = false;

    constructor (props) {
        super(props)
        this.state = {
            stockNum: "2330",
            stockExist: false,
        }
    }

    handleStockNumChange = (stockNum) => {
        this.setState({
            stockNum
        })
    }

    handleStockExistChange = (exist) => {
        this.setState({
            stockExist: exist
        })
    }

    checkPathnameStockNum = () => {
        let location = window.location.pathname.split("/");
        if(location[3]){
            if(location[3] && this.state.stockNum !== location[3]){
                this.handleStockNumChange(location[3]);
            }
        }
    }

    checkStockExist = () => {
        StockerAPI.checkStockExist(this.state.stockNum)
            .then(res=>{
                console.log(res.status)
                if(res.status===200){
                    this.handleStockExistChange(true)
                }
            })
            .catch(err=>{
                console.log(err)
                if(err.response.status===404){
                    this.handleStockExistChange(false)
                }
            })
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.state.stockNum !== prevState.stockNum) {
            this.checkStockExist(this.state.stockNum)
        }
    }

    componentDidMount = () => {
        this._isMounted = true;

        this.checkPathnameStockNum();
        this.checkStockExist()
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }

  render() {
    const { stockNum, stockExist } = this.state;
    return (
        <div className="Stocker">
            <Header handleStockNumChange={this.handleStockNumChange} />
            <NaviBar stockNum={stockNum}/>
            {stockExist
                ?<Container>
                    <StockInfoAndCommodity
                        stockNum={stockNum} />
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
                :<NoThisStock stockNum={stockNum}/>
            }
        </div>
    )};
}

export default StockerLayout;
