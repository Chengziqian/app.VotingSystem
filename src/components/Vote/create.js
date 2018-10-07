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
      time: moment().format('HH:mm'),
      presetData: [],
      option_keys: [],
      pre_options: []
    };
    this.uuid = 0
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
    this.getPreset()
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    let data = this.state;
    data.time = moment().format('HH:mm');
    this.setState(data);
  }

  getPreset = () => {
    http.get('/group').then(r => {
      this.setState({
        loading: false,
        presetData: r.data
      });
    }).catch(e => {})
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        http.post('vote', {
          name: values.name,
          introduction: values.introduction,
          start_time: values.start_date + ' ' + values.start_time + ':00',
          end_time: values.end_date + ' ' + values.end_time + ':00',
          count: values.count,
          options: values.options.filter(v => v)
        }).then(r => {
          message.success('发布成功', 1).then(() => {
            this.setState({ loading: false });
            this.props.history.push('/vote/' + r.data.id);
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
    const keys = this.state.option_keys;
    if (keys.length === 0) {
      return;
    }
    this.setState({
      option_keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const keys = this.state.option_keys;
    const nextKeys = keys.concat(this.uuid++);
    this.setState({
      option_keys: nextKeys,
    });
  };

  loadPreset = (e) => {
    let id = e.target.value;
    if (id) {
      http.get('/group/' + id).then(r => {
        if (!r.data) {
          message.error('该预设群组不存在', 1).then(() => {
          })
        } else {
          const { form } = this.props;
          this.setState({
            option_keys: (() => {
              let res = [];
              for(let i = 0; i < r.data.content.length; i++) {
                res[i] = i;
              }
              return res;
            })()
          }, () => {
            form.setFieldsValue({
              options: r.data.content.map(o => o.name)
            });
          });
          this.uuid = r.data.content.length;
        }
      }).catch(e => {})
    } else {
      const { form } = this.props;
      this.setState({
        option_keys: []
      }, () => {
        form.setFieldsValue({
          options: ['']
        });
      });
      this.uuid = 0;
    }
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
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 18, offset: 6 },
      },
    };
    const optionItems = () => {
      let option_keys = this.state.option_keys || [];
      if (option_keys.length === 0) {
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
      } else {
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
        extra.unshift(
          <FormItem {...formItemLayout} label="投票选项" key={0}>
            {getFieldDecorator(`options[${0}]`, {rules: [{required: true, message: '选项至少一个'}]})(<Input/>)}
          </FormItem>
        );
        return extra
      }
    };
    let dateLayout = {
      xs: 14,
      sm: 14,
      ms: 14,
      lg: 12
    };
    let timeLayout = {
      xs: 10,
      sm: 10,
      md: 10,
      lg: 12
    };
    return (
      <div>
        <Row type="flex" justify="center" style={{padding: '20px 10px'}}>
          <Col xs={24} sm={18} md={18} lg={12}>
            <Card title="创建投票">
              <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label="投票名称">
                  {getFieldDecorator('name', {rules: [{required: true, message: '名字不能为空'}]})(<Input/>)}
                </FormItem>
                <FormItem {...formItemLayout} label="投票简介">
                  {getFieldDecorator('introduction')(<Input.TextArea/>)}
                </FormItem>
                <FormItem {...formItemLayout} label="开始时间">
                  <Row>
                    <Col {...dateLayout}>
                      {getFieldDecorator('start_date', {initialValue: this.date, rules: [{required: true, message: '开始时间不能为空'}]})(<input type="date" style={{border: '1px solid #d9d9d9', borderRadius: '4px', width: '100%'}}/>)}
                    </Col>
                    <Col {...timeLayout}>
                      {getFieldDecorator('start_time', {initialValue: this.state.time, rules: [{required: true, message: '开始时间不能为空'}]})(<input type="time" style={{border: '1px solid #d9d9d9', borderRadius: '4px', width: '100%'}}/>)}
                    </Col>
                  </Row>
                </FormItem>
                <FormItem {...formItemLayout} label="结束时间">
                  <Row>
                    <Col {...dateLayout}>
                      {getFieldDecorator('end_date', {initialValue: this.date, rules: [{required: true, message: '结束时间不能为空'}]})(<input type="date" style={{border: '1px solid #d9d9d9', borderRadius: '4px', width: '100%'}}/>)}
                    </Col>
                    <Col {...timeLayout}>
                      {getFieldDecorator('end_time', {initialValue: this.state.time, rules: [{required: true, message: '结束时间不能为空'}]})(<input type="time" style={{border: '1px solid #d9d9d9', borderRadius: '4px', width: '100%'}}/>)}
                    </Col>
                  </Row>
                </FormItem>
                <FormItem {...formItemLayout} label="每人票数">
                  {getFieldDecorator('count', {rules: [{required: true, message: '每人票数不能为空'}]})(<InputNumber min={1}/>)}
                </FormItem>
                <FormItem {...formItemLayout} label="导入选项预设">
                  <select style={{border: '1px solid #d9d9d9', borderRadius: '4px', width: '100%'}} onChange={this.loadPreset}>
                    <option value='' key='empty'>无</option>
                    {
                      this.state.presetData.map((o) => (
                        <option value={o.id} key={o.id}>{o.name}</option>
                      ))
                    }
                  </select>
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