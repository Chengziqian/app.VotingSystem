import React from 'react'
import {Card, Row, Col, Tag, message, Form, Button} from 'antd';
import http from "../../service";
import {withRouter} from 'react-router-dom'
import moment from "moment";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import store from 'store';
const FormItem = Form.Item;
class VoteDetail extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      isExpired: true,
      isVoted: true,
      loading: true,
      data: [],
      isOwner: false,
      copyValue: ''
    }
  }

  componentDidMount() {
    this.getIsVoted();
    this.getData()
  }

  getData = () => {
    http.get('/vote/' + this.props.match.params.id).then(r => {
      if (!r.data) {
        message.error('该投票活动不存在', 1).then(() => {
          this.props.history.push('/vote/list');
        })
      } else {
        this.setState({
          loading: false,
          data: r.data,
          isExpired: !(moment().isBetween(moment(r.data.start_time), moment(r.data.end_time))),
          isOwner: r.data.user_id === store.get("VS_USER").id
        })
      }
    }).catch(e => {})
  };

  getIsVoted = () => {
    http.get('/vote/' + this.props.match.params.id + '/isVoted').then(r => {
      let data = this.state;
      data.isVoted = r.data.isVoted;
      this.setState(data);
    }).catch(e => {})
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ postLoading: true });
        http.post('/vote/' + this.props.match.params.id, {
          options: values.options
        }).then(r => {
          message.success('投票成功', 1).then(() => {
            this.setState({ postLoading: false });
            console.log(this.state);
            window.location.reload();
          })
        }).catch(e => {
          message.error(e.response.data.message)
        })
      }
    })
  };

  remove = () => {
    http.delete('/vote/' + this.props.match.params.id).then(r => {
      this.props.history.push('/vote/list')
    }).catch(e => {})
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const select = () => {
      let arr = [];
      for (let i = 0; i < this.state.data.count; i++) {
        arr[i] = (
          <FormItem {...formItemLayout} label={"选票" + (i+1)} key={i}>
            {getFieldDecorator(`options[${i}]`, {initialValue: '', rules: [{required: true, message: '选票不能为空'}]})(
              <select style={{border: '1px solid #d9d9d9', borderRadius: '4px', width: '100%'}} disabled={this.state.isVoted || this.state.isExpired}>
                <option value='' key='empty'>请选择...</option>
                {
                  this.state.data.options.map(o => (
                    <option value={o.id} key={'options' + o.id}>{o.name}</option>
                  ))
                }
              </select>
            )}
          </FormItem>
        )
      }
      return arr;
    };
    return (
      <div>
        <Row type="flex" justify="center" style={{padding: '20px 10px'}}>
          <Col xs={24} sm={15} md={12}>
            <Card title={
              (() => {
                if (this.state.data.length === 0) {
                  return (<span style={{verticalAlign: 'middle'}}>投票活动</span>)
                } else {
                  if (moment().isBefore(moment(this.state.data.start_time))) return (
                    <span>
                      <span style={{verticalAlign: 'middle'}}>投票活动</span>
                      <Tag style={{verticalAlign: 'middle', marginLeft: '5px'}} color="#fdd835">未开始</Tag>
                    </span>
                  ); else if (moment().isAfter(moment(this.state.data.end_time))) return (
                    <span>
                      <span style={{verticalAlign: 'middle'}}>投票活动</span>
                      <Tag style={{verticalAlign: 'middle', marginLeft: '5px'}} color="#f44336">已结束</Tag>
                    </span>
                  ); else return (
                    <span>
                      <span style={{verticalAlign: 'middle'}}>投票活动</span>
                      <Tag style={{verticalAlign: 'middle', marginLeft: '5px'}} color="#00e676">进行中</Tag>
                    </span>
                  );
                }
              })()
            }
                  loading={this.state.loading}
                  extra={
                    <span>
                      <CopyToClipboard text={window.location.href}
                                       onCopy={() => {message.success('已复制', 1)}}>
                        <a>复制活动链接</a>
                      </CopyToClipboard>
                      {this.state.isOwner &&
                      <span>
                        <span style={{padding: '0 2px'}}>|</span>
                        <a onClick={this.remove}>删除</a>
                      </span>
                      }
                    </span>
                  }
            >
              <p style={{textAlign: 'center', fontSize: '24pt'}}>{this.state.data.name}</p>
              <p style={{wordWrap: 'break-word',wordBreak: 'normal'}}>{this.state.data.introduction}</p>
              <hr/>
              <Form onSubmit={this.handleSubmit}>
                {select()}
                <FormItem >
                  <Button type="primary" htmlType="submit" loading={this.state.postLoading} disabled={this.state.isVoted || this.state.isExpired} block>
                    {
                      (() => {
                        if (this.state.isVoted || this.state.isExpired) {
                          if (this.state.isVoted) return '您已投票';
                          else return '投票已结束'
                        } else {
                          return '投票'
                        }
                      })()
                    }
                    </Button>
                </FormItem>
                {(this.state.isVoted || this.state.isExpired) &&<FormItem >
                  <Button type="primary" htmlType='button' onClick={() => {this.props.history.push(`/vote/${this.props.match.params.id}/result`)}} block>查看结果</Button>
                </FormItem>}
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}
const WrappedVoteDetailForm = Form.create()(VoteDetail);
export default withRouter(WrappedVoteDetailForm)