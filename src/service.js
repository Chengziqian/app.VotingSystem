import axios from 'axios';
import store from 'store';
import {message} from 'antd';

axios.defaults.baseURL = '/api';

axios.interceptors.request.use(config => {
  console.log(store.get('token'));
  config.headers['Api-Token'] = store.get('VS_TOKEN');
  return config;
}, error => {
  return Promise.reject(error);
});

axios.interceptors.response.use(r => r, e => {
  switch (e.response.status) {
    case 422:
      for (let key in e.response.data) {
        if(e.response.data.hasOwnProperty(key)) {
          message.error(e.response.data[key]);
          let obj = {};
          obj[key] = {values: '', errors: e.response.data[key].map(o => (new Error(o)))};
          e.response.data = obj
        }
      }
      break;
    case 500:
      message.error('服务器错误');
      break;
    case 504:
      message.error('服务器未响应');
      break;
    default:
      message.error(e.response.data.message || '未知错误');
      break;
  }
  return Promise.reject(e)
});

export default axios;
