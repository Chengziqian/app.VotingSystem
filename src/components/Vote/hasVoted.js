import React from 'react'
import {Col, Card, Row, Icon, Spin} from 'antd'
import http from '../../service'
import {withRouter} from 'react-router-dom'
import moment from 'moment';
class HasVoted extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: []
    }
  }

  componentDidMount() {
    this.getData()
  }

  getData = () => {
    http.get('/user/hasVoted').then(r => {
      this.setState({loading: false, data: r.data})
    }).catch(e => {})
  };

  render() {
    return (
      <div>
        <Spin spinning={this.state.loading} indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}>
          {this.state.data.length === 0 && <p>您还没有参加任何投票活动</p>}
          <Row gutter={16}>
            {this.state.data.map((o, index) =>
              <Col xs={24} sm={12} md={8} lg={6} key={index}>
                <Card hoverable={true} style={{marginBottom: '20px'}}
                      onClick={() => {this.props.history.push('/vote/' + o.id)}}
                >
                  <Row>
                    <Col span={10}>
                      {moment().isBetween(moment(o.start_time), moment(o.end_time)) ?
                        <div align="center">
                          <Icon type="play-circle" theme="twoTone" twoToneColor="#00e676" style={{fontSize: '24pt'}}/>
                          <p style={{color: '#69f0ae', fontSize: '13pt', paddingTop: '5px'}}>正在进行</p>
                        </div> :
                        <div align="center">
                          <Icon type="exclamation-circle" theme="twoTone" twoToneColor="#f44336" style={{fontSize: '24pt'}}/>
                          <p style={{color: '#ef5350', fontSize: '13pt', paddingTop: '5px'}}>已结束</p>
                        </div>
                      }
                    </Col>
                    <Col span={14}>
                      <p style={{fontSize: '12pt'}}>{o.name}</p>
                      <p style={{textOverflow:'ellipsis', overflow:'hidden', whiteSpace:'nowrap'}}>{o.introduction}</p>
                    </Col>
                  </Row>
                </Card>
              </Col>
            )}
          </Row>
        </Spin>
      </div>
    )
  }
}

export default withRouter(HasVoted)