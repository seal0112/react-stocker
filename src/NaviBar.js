import React, { Component } from 'react';
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
        naviParentType: null,
        navExpanded: false,
    }

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
            "href": "financial-stat",
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

    handleNaviParentTypeChange = (naviParentType) => {
        this.setState({
            naviParentType
        })
    }

    clickNaviParent = (event) => {
        if (event.target.dataset.navipar) {
            this.handleNaviParentTypeChange(event.target.dataset.navipar)
        } else {
            this.handleNaviParentTypeChange(event.target.parentNode.dataset.navipar)
        }
    }

    checkPathnameWithNaviParent = () => {
        if(this.state.naviParentType==null){
            let location = window.location.pathname.split("/");
            if(location[1]){
                this.handleNaviParentTypeChange(location[1]);
            } else {
                this.handleNaviParentTypeChange('basic-info');
            }

        }
    }

    setNaviExpanded = (expanded) => {
        this.setState({ navExpanded: expanded });
    }

    closeNavibar = () => {
        this.setState({ navExpanded: false });
    }

    componentDidMount = () => {
        this.checkPathnameWithNaviParent();
    }

    render() {
        const {naviParentType, navExpanded} = this.state;
        return (
            <Navbar
              className="App-navbar"
              expand="md"
              onToggle={this.setNaviExpanded}
              expanded={navExpanded}>
                <Container>
                    <Navbar.Toggle children={
                        <FontAwesomeIcon className="icon" icon={faAngleDoubleDown} size="lg"/>
                    } aria-controls="App-navbar-content"/>
                    <Navbar.Collapse id="App-navbar-content">
                        <Nav variant="tabs" as="ul">
                            {this.naviTabParent.map(naviTabPar=>(
                                <Nav.Item as="li" key={naviTabPar.href}>
                                    <Nav.Link
                                      className={naviParentType===naviTabPar.href ? "parent active" : "parent"}
                                      onClick={this.clickNaviParent}
                                      data-navipar={naviTabPar.href}>
                                        <FontAwesomeIcon className="icon" icon={naviTabPar.icon} size="lg"/>
                                        <span>{naviTabPar.title}</span>
                                    </Nav.Link>
                                    <ul className="navi-tab-sub">
                                        {naviTabPar["naviTabSub"].map(naviTabSub=>(
                                            <Nav.Item as="li" key={naviTabSub.href} onClick={this.closeNavibar}>
                                                <SelectLink
                                                    to={`/${naviTabPar.href}${naviTabSub.href}/${this.props.stockNum}`}
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

