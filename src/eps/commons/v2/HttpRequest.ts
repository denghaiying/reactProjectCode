/* eslint-disable no-self-assign */
import axios from 'axios';
import { Notification } from '@alifd/next';
import { message } from 'antd';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

class HttpRequest {
  baseUrl: string;
  queue: object;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl?.startsWith('/api') ? baseUrl : `/api${baseUrl}`;
    // this.baseUrl = baseUrl
    this.queue = {};
  }
  getInsideConfig(_token) {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        // Authorization
        Authorization: _token ? `Bearer ${_token}` : '',
      },
    };
    return config;
  }
  destroy(url) {
    delete this.queue[url];
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      (config) => {
        // 添加全局的loading...
        if (!Object.keys(this.queue).length) {
          // Spin.show() // 不建议开启，因为界面不友好
        }
        if (config.method === 'get') {
          url.indexOf('?') === -1
            ? (config.url = url + '?_=' + new Date().getTime())
            : (config.url = url + '&_=' + new Date().getTime());
        }
        config.url = config.url.startsWith('/api')
          ? config.url
          : `/api${config.url}`;
        this.queue[url] = true;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
    // 响应拦截
    instance.interceptors.response.use(
      (res) => {
        this.destroy(url);
        let { data, status } = res;
        if (data === 'ERROR_TOKEN') {
          message.error('登陆超时，请重新登录');
          data = { result: [] };
          localStorage.removeItem('mtoken');
          localStorage.removeItem('userinfo');
          localStorage.removeItem('menuData');
          localStorage.removeItem('currentCmp');
          localStorage.removeItem('currentUser');
          window.location.reload();
          return;
        }
        return { data, status };
      },
      (error) => {
        this.destroy(url);
        // let errorInfo = error.response
        // if (!errorInfo) {
        //   const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        //   errorInfo = {
        //     statusText,
        //     status,
        //     request: { responseURL: config.url }
        //   }
        // }
        // Notification.open({
        //   title: errorInfo.statusText,
        //   content: JSON.parse(errorInfo.statusText),
        //   type: 'error'
        // });
        return Promise.reject(error);
      },
    );
  }
  request(options) {
    const instance = axios.create();
    // let token = JSON.parse(localStorage.getItem('token'))
    // if(token){
    //   options = Object.assign(this.getInsideConfig(token && token.access_token), options)
    // }
    this.interceptors(instance, options.url);
    return instance(options);
  }
  get(options) {
    return this.request({ ...options, method: 'get' });
  }
  post(options) {
    return this.request({ ...options, method: 'post' });
  }
  put(options) {
    return this.request({ ...options, method: 'put' });
  }
  delete(options) {
    return this.request({ ...options, method: 'post' });
  }
}
export default HttpRequest;
