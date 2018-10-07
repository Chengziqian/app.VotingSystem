import React from 'react'
import http from '../../service'
import {Card, Col, message, Row, Icon} from 'antd'
import { Form, Input, Button} from 'antd';
import {withRouter} from 'react-router-dom';
const FormItem = Form.Item;
class PreSetCreator extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    this.uuid = 0
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        http.post('group', {
          name: values.name,
          type: values.type,
          content: values.content.filter(v => v)
        }).then(r => {
          message.success('创建成功', 1).then(() => {
            this.setState({ loading: false });
            this.props.history.push('/preset/list');
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
    const keys = form.getFieldValue('content_keys');
    if (keys.length === 0) {
      return;
    }
    form.setFieldsValue({
      content_keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('content_keys');
    const nextKeys = keys.concat(this.uuid++);
    form.setFieldsValue({
      content_keys: nextKeys,
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
    getFieldDecorator('content_keys', {initialValue: []});
    const content_keys = getFieldValue('content_keys');
    const optionItems = () => {
      let arr = [
        (
          <FormItem {...formItemLayout} label="预设群组内容" key={0}>
            {getFieldDecorator(`content[${0}]`, {rules: [{required: true, message: '选项至少一个'}]})(<Input/>)}
          </FormItem>
        )
      ];
      let extra = content_keys.map((key, index) => (
        <FormItem {...formItemLayout} colon={false} label={content_keys.length >= 1 ? (
          <span><Icon
            style={{cursor: 'pointer', fontSize: '20px', color: 'red'}}
            type="minus-circle-o"
            disabled={content_keys.length === 0}
            onClick={() => this.remove(key)}
          /></span>
        ) : null} key={key + 1}>
          {getFieldDecorator(`content[${key + 1}]`)(<Input />)}
        </FormItem>
      ));
      return arr.concat(extra)
    };
    return (
      <div>
        <Row type="flex" justify="center" style={{padding: '20px 10px'}}>
          <Col xs={24} sm={18} md={18} lg={12}>
            <Card title="创建预设群组">
              <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label="群组名称">
                  {getFieldDecorator('name', {rules: [{required: true, message: '名字不能为空'}]})(<Input/>)}
                </FormItem>
                <FormItem {...formItemLayout} label="群组类型">
                  {getFieldDecorator(`type`, {initialValue: '', rules: [{required: true, message: '选票不能为空'}]})(
                    <select style={{border: '1px solid #d9d9d9', borderRadius: '4px', width: '100%'}} disabled={this.state.isVoted || this.state.isExpired}>
                      <option value=''>请选择...</option>
                      <option value='options'>选项预设群组</option>
                      <option value='users'>用户预设群组</option>
                    </select>
                  )}
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
const WrappedPreSetCreatorForm = Form.create()(PreSetCreator);
export default withRouter(WrappedPreSetCreatorForm);