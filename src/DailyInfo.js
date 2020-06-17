import React, { PureComponent } from 'react';
import './DailyInfo.css';
import {
    Row, Col, Card
} from 'react-bootstrap';
import * as StockerAPI from './utils/StockerAPI';

class DailyInfo extends PureComponent {
    state = {
        "本日收盤價": 0,
        "本日漲跌": 0,
        "本益比": 0,
        "近四季每股盈餘": 0
    }

    handleDailyInfo = (daily_info) => {
        this.setState(daily_info)
    }

    componentDidMount = () => {
        const stockNum = this.props.stockNum;
        this.getDailyInfo(stockNum)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.stockNum !== this.props.stockNum) {
            this.getDailyInfo(this.props.stockNum)
        }
    }

    getDailyInfo = (stockNum) => {
        StockerAPI.getDailyInfo(stockNum)
            .then(res => {
                console.log(res)
                this.handleDailyInfo(res)})
    }

    render() {
        let upAndDownCardText
        if (this.state["本日漲跌"]>=0) {
            upAndDownCardText = (<Card.Text style={{color: "red"}}>
                                    {`+${this.state["本日漲跌"]} (${Math.round(this.state["本日漲跌"]/(this.state["本日收盤價"]-this.state["本日漲跌"])*10000)/100})%`}
                                </Card.Text>)
        } else {
            upAndDownCardText = (<Card.Text style={{color: "green"}}>
                                    {`${this.state["本日漲跌"]} (${Math.round(this.state["本日漲跌"]/(this.state["本日收盤價"]-this.state["本日漲跌"])*10000)/100}%)`}
                                </Card.Text>)
        }

        return (
            <div className="Daily-info">
                    <Row>
                        <Col md={3} xs={6}>
                            <Card id="price">
                              <Card.Header>本日收盤價</Card.Header>
                              <Card.Body>
                                <Card.Text>
                                    {this.state["本日收盤價"]}
                                </Card.Text>
                              </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} xs={6}>
                            <Card id="upAndDown">
                              <Card.Header>本日漲跌</Card.Header>
                              <Card.Body>
                                {upAndDownCardText}
                              </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} xs={6}>
                            <Card id="pe">
                              <Card.Header>本益比</Card.Header>
                              <Card.Body>
                                <Card.Text>
                                    {this.state["本益比"]?this.state["本益比"]:'--'}
                                </Card.Text>
                              </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} xs={6}>
                            <Card id="fourSeasonEPS">
                              <Card.Header>近四季每股盈餘</Card.Header>
                              <Card.Body>
                                <Card.Text>
                                    {this.state["近四季每股盈餘"]?this.state["近四季每股盈餘"]:'--'}
                                </Card.Text>
                              </Card.Body>
                            </Card>
                        </Col>
                    </Row>
            </div>
        )
  };
}

export default DailyInfo;
