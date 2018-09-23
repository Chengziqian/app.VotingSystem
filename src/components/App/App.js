import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import lazyload from '../lazyload.js';
import store from 'store'
import { BrowserRouter, Route, Redirect, Link } from 'react-router-dom';

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
      <BrowserRouter forceRefresh={true}>
        <div>
          <Menu
            theme="dark"
            mode="horizontal"
          >
            <Menu.Item >
              <Link to='/dashboard'>VotingSystem</Link>
            </Menu.Item>
            <Menu.Item style={{float: 'right'}} onClick={this.logout}>
              <span>
                <Icon type="poweroff" theme="outlined" style={{marginRight: '0px'}}/>
              </span>
            </Menu.Item>
            <Menu.Item style={{float: 'right'}}><span><Icon type="user" />{store.get('VS_USER').username}</span></Menu.Item>
          </Menu>
          <div style={{marginTop: '30px', padding: '0px 20px'}}>
            <Route exact path="/" component={() => <Redirect to="/dashboard"/>}/>
            <Route exact path="/dashboard" component={lazyload(() => import('../Dashboard/dashboard'))}/>
            <Route exact path="/vote/create" component={lazyload(() => import('../Vote/create'))}/>
          </div>
        </div>
      </BrowserRouter>
    )
  }
}

export default App;