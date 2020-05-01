import React, { Component } from 'react';
import {
    Nav, Navbar, NavDropdown,
    Form, FormControl
} from 'react-bootstrap';

class Header extends Component {
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.handleStockNumChange(event.target[0].value)
    }

    render() {
        return (
            <header className="App-header">
                <Navbar variant="dark" expand="md">
                  <Navbar.Brand href="#home">Stocker</Navbar.Brand>
                  <Form className="mr-auto" onSubmit={this.handleSubmit}>
                    <FormControl
                      type="text"
                      placeholder="Search"
                      className="mr-sm-2"
                      size="sm"/>
                  </Form>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" />
                  <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav>
                      <Nav.Item>
                        <Nav.Link href="#home">Home</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link href="#link">Link</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                          <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                          <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                          <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                          <NavDropdown.Divider />
                          <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                      </Nav.Item>
                    </Nav>
                  </Navbar.Collapse>
                </Navbar>
            </header>
        )
    }
}

export default Header;