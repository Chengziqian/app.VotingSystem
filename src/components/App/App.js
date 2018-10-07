import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import lazyload from '../lazyload.js';
import store from 'store'
import { BrowserRouter, Route, Redirect, Link , Switch} from 'react-router-dom';

class App extends Component{

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
            <Switch>
              <Route exact path="/" component={() => <Redirect to="/dashboard"/>}/>
              <Route exact path="/dashboard" component={lazyload(() => import('../Dashboard/dashboard'))}/>
              <Route exact path="/vote/create" component={lazyload(() => import('../Vote/create'))}/>
              <Route exact path="/vote/list" component={lazyload(() => import('../Vote/list'))}/>
              <Route exact path="/vote/hasVoted" component={lazyload(() => import('../Vote/hasVoted'))}/>
              <Route exact path="/vote/:id" component={lazyload(() => import('../Vote/detail'))}/>
              <Route exact path="/vote/:id/result" component={lazyload(() => import('../Vote/result'))}/>
              <Route exact path="/preset/create" component={lazyload(() => import('../PreSet/create'))}/>
              <Route exact path="/preset/list" component={lazyload(() => import('../PreSet/list'))}/>
              <Route exact path="/preset/:id" component={lazyload(() => import('../PreSet/detail'))}/>
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    )
  }
}

export default App;