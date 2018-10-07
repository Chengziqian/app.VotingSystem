import React from 'react'
import {Card, Row, Col, message, Form, Button, Input, Icon} from 'antd';
import http from "../../service";
import {withRouter} from 'react-router-dom'
const FormItem = Form.Item;
class PresetDetail extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      content_keys: [],
      isEdit: false
    };
    this.uuid = 0
  }

  componentDidMount() {
    this.getData()
  }

  getData = () => {
    http.get('/group/' + this.props.match.params.id).then(r => {
      if (!r.data) {
        message.error('该预设群组不存在', 1).then(() => {
          this.props.history.push('/preset/list');
        })
      } else {
        this.setState({
          loading: false,
          data: r.data,
          content_keys: (() => {
            let res = [];
            for(let i = 0; i < r.data.content.length; i++) {
              res[i] = i;
            }
            return res;
          })(),
        });
        const { form } = this.props;
        form.setFieldsValue({
          content: r.data.content.map(o => o.name),
          name: r.data.name,
          type: r.data.type
        });
        this.uuid = r.data.content.length;
      }
    }).catch(e => {})
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        console.log(values.content.filter(v => v));
        http.put('group/' + this.props.match.params.id, {
          name: values.name,
          type: values.type,
          content: values.content.filter(v => v)
        }).then(r => {
          message.success('保存成功', 1).then(() => {
            this.setState({ loading: false });
            window.location.reload()
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
    const keys = this.state.content_keys;
    if (keys.length === 0) {
      return;
    }
    this.setState({content_keys: keys.filter(key => key !== k)})
  };

  add = () => {
    const keys = this.state.content_keys;
    const nextKeys = keys.concat(this.uuid++);
    this.setState({
      content_keys: nextKeys,
    });
  };

  removeGroup = () => {
    http.delete('/group/' + this.props.match.params.id).then(r => {
      this.props.history.push('/preset/list')
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
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 18, offset: 6 },
      },
    };
    const optionItems = () => {
      let content_keys = this.state.content_keys || [];
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
      extra.unshift(
        <FormItem {...formItemLayout} label="预设群组内容" key={0}>
          {getFieldDecorator(`content[${0}]`, {rules: [{required: true, message: '选项至少一个'}]})(<Input/>)}
        </FormItem>
      );
      return extra
    };
    return (
      <div>
        <Row type="flex" justify="center" style={{padding: '20px 10px'}}>
          <Col xs={24} sm={18} md={18} lg={12}>
            <Card title="预设群组" extra={
              <span>
                <a onClick={() => this.setState({isEdit: !this.state.isEdit})}>修改</a>
                <span style={{padding: '0 2px'}}>|</span>
                <a onClick={this.removeGroup}>删除</a>
              </span>
            }>
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
                  <Button type="primary" htmlType="submit" loading={this.state.loading} disabled={!this.state.isEdit} block>提交</Button>
                </FormItem>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
const WrappedPresetDetailForm = Form.create()(PresetDetail);
export default withRouter(WrappedPresetDetailForm)