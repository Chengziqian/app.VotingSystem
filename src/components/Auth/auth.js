import React from 'react'
import Register from './register';
import Login from './login'
import {Card, Row, Col} from 'antd';
import './auth.less'
class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 'login'
    }
  }
  render() {
    return(
      <Row type="flex" justify="center" className="myCard">
        <Col xs={24} sm={17} md={13} lg={10} xl={8}>
          <div className="title">
            <p className="main-title">投票系统</p>
            <p className="sub-title">BETA</p>
          </div>
          <Card title={ this.state.tab === 'login' ? "登陆" : "注册"}>
            {this.state.tab === 'login' && <Login/>}
            {this.state.tab === 'register' && <Register/>}
            {this.state.tab === 'login' &&
              <div>
                <a onClick={() => {this.setState({tab: 'register'})}}>立即注册</a>
              </div>
            }
            {this.state.tab === 'register' &&
              <div>
                <a onClick={() => {this.setState({tab: 'login'})}}>&lt;-登陆</a>
              </div>
            }
          </Card>
        </Col>
      </Row>
    )
  }
}

export default Auth