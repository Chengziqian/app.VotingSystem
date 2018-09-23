import axios from 'axios';
import store from 'store';

axios.defaults.baseURL = '/api';

axios.interceptors.request.use(config => {
  console.log(store.get('token'));
  config.headers['Api-Token'] = store.get('VS_TOKEN');
  return config;
}, error => {
  return Promise.reject(error);
});

export default axios;
