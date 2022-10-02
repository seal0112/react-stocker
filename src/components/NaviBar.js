import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Navbar, Nav, Container
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGlobe, faListAlt, faClipboardList, faBalanceScale, faInfoCircle,
  faNewspaper, faCommentAlt, faAngleDoubleDown, faCoins,
  faHandHoldingUsd, faFileInvoiceDollar, faFunnelDollar, faSearchDollar
} from '@fortawesome/free-solid-svg-icons'
import { useStock } from '../hooks/StockContext'
import { Link, useLocation } from 'react-router-dom'

function SelectLink ({ label, to, activeOnlyWhenExact, icon }) {
  const { pathname } = useLocation()

  return (
    <div className={pathname === to ? 'sub-nav-link active' : 'sub-nav-link'}>
      <Link to={to}>
        <FontAwesomeIcon className="icon" icon={icon} size="sm" />
        <span> {label}</span>
      </Link>
    </div>
  )
}

SelectLink.propTypes = {
  label: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  activeOnlyWhenExact: PropTypes.bool.isRequired,
  icon: PropTypes.object.isRequired
}

const NaviBar = () => {
  const [naviParentType, setNaviParentType] = useState(null)
  const [navExpanded, setNavExpanded] = useState(false)

  const stock = useStock()

  const naviTabParent = [
    {
      title: '大盤資訊',
      href: 'taiwan-stock',
      icon: faGlobe,
      naviTabSub: [
        {
          title: '相關新聞',
          href: '/news',
          icon: faNewspaper
        }
      ]
    }, {
      title: '個股資訊',
      href: 'basic-info',
      icon: faListAlt,
      naviTabSub: [
        {
          title: '每日資訊',
          href: '/daily-info',
          icon: faInfoCircle
        },
        {
          title: '公司資料',
          href: '/company-data',
          icon: faInfoCircle
        },
        {
          title: '個股新聞',
          href: '/news',
          icon: faNewspaper
        },
        {
          title: '個人意見',
          href: '/comment',
          icon: faCommentAlt
        }
      ]
    }, {
      title: '財報分析',
      href: 'financial-stat',
      icon: faClipboardList,
      naviTabSub: [
        {
          title: '營收資訊',
          href: '/revenue',
          icon: faCoins
        },
        {
          title: '每股盈餘',
          href: '/eps',
          icon: faHandHoldingUsd
        },
        {
          title: '損益表',
          href: '/income-sheet',
          icon: faFileInvoiceDollar
        },
        {
          title: '利潤分析',
          href: '/profit-analysis',
          icon: faFunnelDollar
        },
        {
          title: '營業費用分析',
          href: '/operating-expenses-analysis',
          icon: faSearchDollar
        }
      ]
    }, {
      title: '資產分析',
      href: 'balance-Stat',
      icon: faBalanceScale,
      naviTabSub: []
    }
  ]

  const handleNaviParentTypeChange = (naviParentType) => {
    setNaviParentType(naviParentType)
  }

  const clickNaviParent = (event) => {
    if (event.target.dataset.navipar) {
      handleNaviParentTypeChange(event.target.dataset.navipar)
    } else {
      handleNaviParentTypeChange(event.target.parentNode.dataset.navipar)
    }
  }

  const setNaviExpanded = (expanded) => {
    setNavExpanded(expanded)
  }

  const closeNavibar = () => {
    setNavExpanded(false)
  }

  return (
    <Navbar
        className="App-navbar"
        expand="md"
        onToggle={setNaviExpanded}
        expanded={navExpanded}>
      <Container>
        <Navbar.Toggle aria-controls="App-navbar-content">
          <FontAwesomeIcon className="icon" icon={ faAngleDoubleDown } size="lg" />
        </Navbar.Toggle>
        <Navbar.Collapse id="App-navbar-content">
          <Nav variant="tabs" as="ul">
            {naviTabParent.map(naviTabPar => (
              <Nav.Item as="li" key={naviTabPar.href}>
                <Nav.Link
                    className={ naviParentType === naviTabPar.href ? 'parent active' : 'parent'}
                    onClick={ clickNaviParent }
                    data-navipar={ naviTabPar.href }>
                  <FontAwesomeIcon className="icon" icon={naviTabPar.icon} size="lg"/>
                  <span>{naviTabPar.title}</span>
                </Nav.Link>
                <ul className="navi-tab-sub">
                  {naviTabPar.naviTabSub.map(naviTabSub => (
                    <Nav.Item as="li" key={naviTabSub.href} onClick={ closeNavibar }>
                      <SelectLink
                        to={
                          naviTabPar.href === 'taiwan-stock'
                            ? `/${naviTabPar.href}${naviTabSub.href}`
                            : `/${naviTabPar.href}${naviTabSub.href}/${stock.stockNum}`
                        }
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

export default NaviBar
