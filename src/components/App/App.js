import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import lazyload from '../lazyload.js';
import store from 'store'
import { BrowserRouter, Route, Redirect } from 'react-router-dom';

class App extends Component{
  constructor(props) {
    super(props)
  }

  logout = () => {
    store.remove('VS_TOKEN');
    store.remove('VS_USER');
    window.location.reload();
  };


  render() {
    return(
      <div>
        <Menu
          theme="dark"
          mode="horizontal"
        >
          <Menu.Item>
            VotingSystem
          </Menu.Item>
          <Menu.Item style={{float: 'right', padding: '0px 0px'}}><span onClick={this.logout}><Icon type="poweroff" theme="outlined" /></span></Menu.Item>
          <Menu.Item style={{float: 'right'}}><span><Icon type="user" />{store.get('VS_USER').username}</span></Menu.Item>
        </Menu>
      </div>
    )
  }
}

export default App;