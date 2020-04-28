import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
    Navbar, Nav, Container
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faListAlt, faClipboardList, faBalanceScale, faInfoCircle,
    faNewspaper, faCommentAlt, faAngleDoubleDown, faCoins,
    faHandHoldingUsd, faFileInvoiceDollar, faFunnelDollar, faSearchDollar
} from '@fortawesome/free-solid-svg-icons';
import {
  Link, useRouteMatch
} from "react-router-dom";

function SelectLink({ label, to, activeOnlyWhenExact, icon }) {
  let match = useRouteMatch({
    path: to,
    exact: activeOnlyWhenExact
  });

  return (
    <div className={match ? "sub-nav-link active" : "sub-nav-link"}>
        <Link to={to}>
            <FontAwesomeIcon className="icon" icon={icon} size="sm"/>
            <span> {label}</span>
        </Link>
    </div>
  );
}

class NaviBar extends Component {
    state = {

    };

    naviTabParent = [
        {
            "title": "個股資訊",
            "href": "basic-info",
            "icon": faListAlt,
            "naviTabSub": [
                {
                    "title": "每日資訊",
                    "href": "/daily-info",
                    "icon": faInfoCircle
                },
                {
                    "title": "公司資料",
                    "href": "/company-data",
                    "icon": faInfoCircle
                },
                {
                    "title": "最新新聞",
                    "href": "/news",
                    "icon": faNewspaper
                },
                {
                    "title": "個人意見",
                    "href": "/comment",
                    "icon": faCommentAlt
                }
            ]
        },{
            "title": "財報分析",
            "href": "financial-Stat",
            "icon": faClipboardList,
            "naviTabSub": [
                {
                    "title": "營收資訊",
                    "href": "/revenue",
                    "icon": faCoins
                },
                {
                    "title": "每股盈餘",
                    "href": "/eps",
                    "icon": faHandHoldingUsd
                },
                {
                    "title": "損益表",
                    "href": "/income-sheet",
                    "icon": faFileInvoiceDollar
                },
                {
                    "title": "利潤分析",
                    "href": "/profit-analysis",
                    "icon": faFunnelDollar
                },
                {
                    "title": "營業費用分析",
                    "href": "/operating-expenses-analysis",
                    "icon": faSearchDollar
                }
            ]
        },{
            "title": "資產分析",
            "href": "balance-Stat",
            "icon": faBalanceScale,
            "naviTabSub": []
        }]
    render() {
        return (
            <Navbar className="App-navbar" expand="md">
                <Container>
                        <Navbar.Toggle children={
                            <FontAwesomeIcon className="icon" icon={faAngleDoubleDown} size="lg"/>
                        } aria-controls="App-navbar-content" />
                        <Navbar.Collapse id="App-navbar-content">
                            <Nav variant="tabs" defaultActiveKey="#basic-info" as="ul">
                                {this.naviTabParent.map(naviTabPar=>(
                                    <Nav.Item as="li">
                                        <Nav.Link className="parent" href={`#${naviTabPar.href}`}>
                                            <FontAwesomeIcon className="icon" icon={naviTabPar.icon} size="lg"/>
                                            <span>{naviTabPar.title}</span>
                                        </Nav.Link>
                                        <ul className="navi-tab-sub">
                                            {naviTabPar["naviTabSub"].map(naviTabSub=>(
                                                <Nav.Item as="li">
                                                    <SelectLink
                                                        to={naviTabSub.href}
                                                        icon={naviTabSub.icon}
                                                        label={naviTabSub.title}
                                                        activeOnlyWhenExact={true}
                                                    />
                                                </Nav.Item>
                                            ))}
                                        </ul>
                                    </Nav.Item>
                                ))}
                            </Nav>
                        </Navbar.Collapse>
                </Container>
            </Navbar>
        )
    }
}

export default NaviBar;

