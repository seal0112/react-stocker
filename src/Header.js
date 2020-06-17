import React, {Component} from 'react';
import UserInfo from './UserInfo';
import {Navbar, Form, FormControl} from 'react-bootstrap';

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
                  <UserInfo />
                </Navbar>
            </header>
        )
    }
}

export default Header;