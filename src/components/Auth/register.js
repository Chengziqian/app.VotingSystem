import React from 'react'
import http from '../../service'
import { message } from 'antd'
import sha256 from 'sha256'
import { Form, Input, Button } from 'antd';
import store from 'store';
const FormItem = Form.Item;

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      loading: false
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        http.post('auth/register', {
          username: values.username,
          password: sha256(values.password)
        }).then(r => {
          message.success('注册成功', 1).then(() => {
            store.set('VS_TOKEN', r.data.api_token);
            store.set('VS_USER', r.data.user);
            this.setState({ loading: false });
            window.location.reload()
          })
        }).catch(e => {
          this.setState({ loading: false });
          if (e.response.status === 422) {
            for (let key in e.response.data) {
              message.error(e.response.data[key])
            }
          } else {
            message.error(e.response.data.message)
          }
        })
      } else {
        message.error('表单填写有误')
      }
    });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次密码不一致');
    } else {
      callback();
    }
  };

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };


  render () {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="用户名">
            {getFieldDecorator('username', {rules: [{required: true, message: '用户名不能为空'}]})(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="密码">
            {getFieldDecorator('password', {rules: [{required: true, message: '密码不能为空'}]})(
              <Input type="password"/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="确认密码">
            {getFieldDecorator('confirm', {rules: [
              {required: true, message: '确认密码不能为空'},{validator: this.compareToFirstPassword}
              ]})(
              <Input type="password" onBlur={this.handleConfirmBlur}/>
            )}
          </FormItem>
          <FormItem >
            <Button type="primary" htmlType="submit" loading={this.state.loading} block>注册</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}
const WrappedRegistrationForm = Form.create()(Register);
export default WrappedRegistrationForm;