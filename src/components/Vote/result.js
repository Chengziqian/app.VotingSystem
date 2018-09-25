import React from 'react'
import {Card, Row, Col, Tag, Progress} from 'antd';
import http from "../../service";
import {withRouter} from 'react-router-dom';
import moment from "moment";
class VoteResult extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      resultLoading: true,
      loading: true,
      data: [],
      result: [],
      total: 0
    }
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.getResult();
  }

  componentDidMount() {
    this.getData();
    this.getResult();
    this.timerID = setInterval(
      () => this.tick(),
      5000
    );
  }

  getData = () => {
    http.get('/vote/' + this.props.match.params.id).then(r => {
      this.setState({
        loading: false,
        data: r.data,
      });
    }).catch(e => {})
  };


  getResult = () => {
    http.get('/vote/' + this.props.match.params.id + '/result').then(r => {
      let total = 0;
      r.data.forEach(e => {
        total += e.count
      });

      this.setState({
        resultLoading: false,
        result: r.data.sort((x, y) => (x.count < y.count ? 1 : -1)),
        total: total
      });
    }).catch(e => {
      this.props.history.push('/vote/'+ this.props.match.params.id);
    })
  };

  render() {
    return (
      <div>
        <Row type="flex" justify="center" style={{padding: '20px 10px'}}>
          <Col xs={24} sm={15} md={12}>
            <Card title={
              moment().isBetween(moment(this.state.data.start_time), moment(this.state.data.end_time)) ?
                <span>
                <span style={{verticalAlign: 'middle'}}>投票结果</span>
                <Tag style={{verticalAlign: 'middle', marginLeft: '5px'}} color="#00e676">进行中</Tag>
              </span>
                :
                <span>
                <span style={{verticalAlign: 'middle'}}>投票结果</span>
                <Tag style={{verticalAlign: 'middle', marginLeft: '5px'}} color="#f44336">已结束</Tag>
              </span>
            } loading={this.state.loading}>
              <p style={{textAlign: 'center', fontSize: '24pt'}}>{this.state.data.name}</p>
              <p style={{wordWrap: 'break-word',wordBreak: 'normal'}}>{this.state.data.introduction}</p>
              <hr/>
              <p>共计: {this.state.total} 票</p>
              {
                (() => (
                  this.state.result.map((o, index) => (
                    <Card>
                      <p>{o.name}</p>
                      <Progress percent={Math.round(o.count/this.state.total * 100)} status="active" />
                    </Card>
                  ))
                ))()
              }
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}
export default withRouter(VoteResult)