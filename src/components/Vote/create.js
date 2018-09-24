import React from 'react'
import http from '../../service'
import {Card, Col, message, Row, Icon, InputNumber} from 'antd'
import { Form, Input, Button} from 'antd';
import {withRouter} from 'react-router-dom';
import moment from 'moment';
const FormItem = Form.Item;
class VoteCreator extends React.Component{
  constructor(props) {
    super(props);
    this.date = moment().format('YYYY-MM-DD');
    this.state = {
      loading: false,
      time: moment().format('HH:mm')
    };
    this.uuid = 0
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      6000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    let data = this.state;
    data.time = moment().format('HH:mm');
    this.setState(data);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        http.post('vote', {
          name: values.name,
          introduction: values.introduction,
          start_time: values.start_time + ' ' + moment().format('HH:mm:ss'),
          end_time: values.end_time + ' ' + moment().format('HH:mm:ss'),
          count: values.count,
          options: values.options.filter(v => v)
        }).then(r => {
          message.success('发布成功', 1).then(() => {
            this.setState({ loading: false });
            this.props.history.push('/dashboard');
          })
        }).catch(e => {
          this.setState({ loading: false });
          if (e.response.status === 422) {
            this.props.form.setFields(e.response.data.message);
          }
        });
      } else {
        message.error('表单填写有误')
      }
    })
  };

  remove = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('option_keys');
    if (keys.length === 0) {
      return;
    }
    form.setFieldsValue({
      option_keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('option_keys');
    const nextKeys = keys.concat(this.uuid++);
    form.setFieldsValue({
      option_keys: nextKeys,
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
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
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 18, offset: 6 },
      },
    };
    getFieldDecorator('option_keys', {initialValue: []});
    const option_keys = getFieldValue('option_keys');
    const optionItems = () => {
      let arr = [
        (
          <FormItem {...formItemLayout} label="投票选项" key={0}>
            {getFieldDecorator(`options[${0}]`, {rules: [{required: true, message: '选项至少一个'}]})(<Input/>)}
          </FormItem>
        )
      ];
      let extra = option_keys.map((key, index) => (
        <FormItem {...formItemLayout} colon={false} label={option_keys.length >= 1 ? (
          <span><Icon
            style={{cursor: 'pointer', fontSize: '20px', color: 'red'}}
            type="minus-circle-o"
            disabled={option_keys.length === 0}
            onClick={() => this.remove(key)}
          /></span>
        ) : null} key={key + 1}>
          {getFieldDecorator(`options[${key + 1}]`)(<Input />)}
        </FormItem>
      ));
      return arr.concat(extra)
    };
    return (
      <div>
        <Row type="flex" justify="center" style={{padding: '20px 10px'}}>
          <Col xs={24} sm={15} md={12}>
            <Card title="创建投票">
              <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label="投票名称">
                  {getFieldDecorator('name', {rules: [{required: true, message: '名字不能为空'}]})(<Input/>)}
                </FormItem>
                <FormItem {...formItemLayout} label="投票简介">
                  {getFieldDecorator('introduction')(<Input.TextArea/>)}
                </FormItem>
                <FormItem {...formItemLayout} label="开始时间">
                  {getFieldDecorator('start_time', {initialValue: this.date, rules: [{required: true, message: '开始时间不能为空'}]})(<input type="date" style={{border: '1px solid #d9d9d9', borderRadius: '4px'}}/>)}
                  <span style={{paddingLeft: '10px'}}>{this.state.time}</span>
                </FormItem>
                <FormItem {...formItemLayout} label="结束时间">
                  {getFieldDecorator('end_time', {initialValue: this.date, rules: [{required: true, message: '结束时间不能为空'}]})(<input type="date" style={{border: '1px solid #d9d9d9', borderRadius: '4px'}}/>)}
                  <span style={{paddingLeft: '10px'}}>{this.state.time}</span>
                </FormItem>
                <FormItem {...formItemLayout} label="每人票数">
                  {getFieldDecorator('count', {rules: [{required: true, message: '每人票数不能为空'}]})(<InputNumber min={1}/>)}
                </FormItem>
                {optionItems()}
                <FormItem {...formItemLayoutWithOutLabel}>
                  <Button type="dashed" onClick={this.add} block>
                    <Icon type="plus" /> 添加选项
                  </Button>
                </FormItem>
                <FormItem >
                  <Button type="primary" htmlType="submit" loading={this.state.loading} block>提交</Button>
                </FormItem>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
const WrappedVoteCreatorForm = Form.create()(VoteCreator);
export default withRouter(WrappedVoteCreatorForm);