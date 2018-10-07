import React from 'react'
import {Col, Card, Row, Icon, Spin, Button, Tag} from 'antd'
import http from '../../service'
import {withRouter} from 'react-router-dom'
class List extends React.Component {
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
    http.get('/group').then(r => {
      this.setState({loading: false, data: r.data})
    }).catch(e => {})
  };

  render() {
    return (
      <div>
        <Spin spinning={this.state.loading} indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}>
          <Button htmlType="button" type="primary" style={{marginBottom: '10px'}} onClick={() => {this.props.history.push('/preset/create')}}>新建预设群组</Button>
          {this.state.data.length === 0 && <p>您还没有创建任何预设群组</p>}
          <Row gutter={16}>
            {this.state.data.map((o, index) =>
              <Col xs={24} sm={12} md={8} lg={6} key={index}>
                <Card hoverable={true} style={{marginBottom: '20px'}}
                      onClick={() => {this.props.history.push('/preset/' + o.id)}}
                >
                  <h2>{o.name}</h2>
                  {
                    o.type === 'options' ? <Tag color="blue">选项预设</Tag> : <Tag color="green">用户预设</Tag>
                  }
                </Card>
              </Col>
            )}
          </Row>
        </Spin>
      </div>
    )
  }
}

export default withRouter(List)