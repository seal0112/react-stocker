import React, {Component} from 'react';
import { Dropdown, Image } from 'react-bootstrap';
import { withRouter } from "react-router-dom";
import * as StockerAPI from './utils/StockerAPI';

class UserInfo extends Component{
  constructor (props) {
    super(props)
    this.state = {
      username: "",
      picture: "",
    }
  }

  componentDidMount = () => {
    StockerAPI.getUserInfo()
      .then(data => this.handleUserInfo(data));
  }

  handleUserInfo = (userInfo) => {
    this.setState({
      username: userInfo.username,
      picture: userInfo.picture
    })
  }

  logOut = (userInfo) => {
    StockerAPI.logout()
      .then(res=>this.props.history.push('/login'))
      .catch(err=>{
        if(err.response.status===404){
          this.props.history.push('/login')
        }
    })
  }

  render() {
    return (
      <div className="user-info justify-content-end">
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            <Image
              className="user-picture"
              src={this.state.picture}
              alt="Avatar"
              roundedCircle/>
            <span className="user-name">{this.state.username}</span>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={()=>this.logOut()}>Log out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    )
  }
}

export default withRouter(UserInfo);