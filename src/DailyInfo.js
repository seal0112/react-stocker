import React, { Component } from 'react';
import './DailyInfo.css';
import {
    Row, Col, Card
} from 'react-bootstrap';

class DailyInfo extends Component {
    state = {
        "股價": 278.5,
        "漲跌": -1,
        "本益比": 21.87,
        "近四季EPS": 14.33
    }

    render() {
        let upAndDownCardText
        if (this.state["漲跌"]>=0) {
            upAndDownCardText = (<Card.Text style={{color: "red"}}>
                                    {`+${this.state["漲跌"]} (${Math.round(this.state["漲跌"]/(this.state["股價"]-this.state["漲跌"])*10000)/100})%`}
                                </Card.Text>)
        } else {
            upAndDownCardText = (<Card.Text style={{color: "green"}}>
                                    {`${this.state["漲跌"]} (${Math.round(this.state["漲跌"]/(this.state["股價"]-this.state["漲跌"])*10000)/100}%)`}
                                </Card.Text>)
        }

        return (
            <div className="Daily-info">
                    <Row>
                        <Col md={3} xs={6}>
                            <Card id="price">
                              <Card.Header>今日股價</Card.Header>
                              <Card.Body>
                                <Card.Text>
                                    {this.state["股價"]}
                                </Card.Text>
                              </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} xs={6}>
                            <Card id="upAndDown">
                              <Card.Header>今日漲跌</Card.Header>
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
                                    {this.state["本益比"]}
                                </Card.Text>
                              </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} xs={6}>
                            <Card id="fourSeasonEPS">
                              <Card.Header>近四季EPS</Card.Header>
                              <Card.Body>
                                <Card.Text>
                                    {this.state["近四季EPS"]}
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
