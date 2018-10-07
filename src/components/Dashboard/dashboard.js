import React from 'react'
import {Card, Row, Col, Icon} from 'antd';
import {withRouter} from 'react-router-dom'
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.CardItems = [
      {
        title: <span style={{color: '#81d4fa'}}>创建投票</span>,
        icon: <Icon type="plus-circle" theme="twoTone" twoToneColor="#29b6f6" style={{fontSize: '50px'}} />,
        introduction: '创建一个投票活动。',
        to: '/vote/create'
      },
      {
        title: <span style={{color: '#ef5350'}}>我的投票活动</span>,
        icon: <Icon type="profile" theme="twoTone" twoToneColor="#f44336" style={{fontSize: '50px'}} />,
        introduction: '查看自己创建的投票活动。',
        to: '/vote/list'
      },
      {
        title: <span style={{color: '#69f0ae'}}>查看已投票</span>,
        icon: <Icon type="check-circle" theme="twoTone" twoToneColor="#00e676" style={{fontSize: '50px'}} />,
        introduction: '查看自己投票过的投票活动。',
        to: '/vote/hasVoted'
      },
      {
        title: <span style={{color: '#ffab40'}}>我的预设群组</span>,
        icon: <Icon type="appstore" theme="twoTone" twoToneColor="#ff9100"  style={{fontSize: '50px'}} />,
        introduction: '创建或查看自己的预设群组。',
        to: '/preset/list'
      }
    ]
  }
  render() {
    return(
      <Row gutter={16}>
        {this.CardItems.map((o, index) =>
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <Card hoverable={true} style={{marginBottom: '20px'}}
                  onClick={() => {this.props.history.push(o.to)}}>
              <div align="center">{o.icon}</div>
              <div align="center" style={{fontSize: '20pt',
                marginBottom: '10px'}}>{o.title}</div>
              <p>{o.introduction}</p>
            </Card>
          </Col>
        )}
      </Row>
    )
  }
}

export default withRouter(Dashboard)