import { notification, message } from 'antd';

import { currentUser as queryCurrentUser } from '@/services/ant-design-pro/api';
import './index.scss';
import './global.less';
import util from '@/utils/util';
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
const ssoPath = '/sso';
const runWidthOutAuth = '/runWfunc';
import { history } from 'umi';
import config from './config/config';
message.config({
  top: 100,
});

// /** 获取用户信息比较慢的时候会展示一个 loading */
// export const initialStateConfig = {
//   loading: <PageLoading />,
// };
// /** 菜单 */
// // 普通+无布局界面

// /**
//  * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
//  * */
export async function getInitialState(): Promise<{
  currentUser?: API.CurrentUser;
  menuData?: API.CurrentMenu;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
  //fetchCmpInfo?: () => Promise<API.CurrentCmp | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      // = util.getLStorage('currentUser');
      // if (!currentUser) {

      const currentUser = await queryCurrentUser();
      // }
      util.setLStorage('currentUser', currentUser);

      return currentUser;
    } catch (error) {
      debugger;
      if (window.top.location.pathname.indexOf(ssoPath) >= 0) {
        // window.top.location.href = ssoPath;
        return;
      } else if (window.top.location.pathname.indexOf(loginPath) < 0) {
        window.top.location.href = loginPath;
      } else if (window.top.location.pathname.indexOf(runWidthOutAuth)) {
        return;
      }
      //history.push(loginPath);
    }
    return undefined;
  };

  // 如果是登录页面，不执行
  if (
    history.location.pathname !== loginPath &&
    history.location.pathname.indexOf(ssoPath) < 0 &&
    history.location.pathname.indexOf(runWidthOutAuth) < 0
  ) {
    const currentUser = await fetchUserInfo();
    if (currentUser) {
      //   menuData=await fetchMenuInfo();
    }
    return {
      fetchUserInfo,
      currentUser,
      // menuData,
      settings: {},
    };
  }
  return {
    fetchUserInfo,
    settings: {},
  };
}

getInitialState();

// /**
//  * 异常处理程序
//     200: '服务器成功返回请求的数据。',
//     201: '新建或修改数据成功。',
//     202: '一个请求已经进入后台排队（异步任务）。',
//     204: '删除数据成功。',
//     400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
//     401: '用户没有权限（令牌、用户名、密码错误）。',
//     403: '用户得到授权，但是访问是被禁止的。',
//     404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
//     405: '请求方法不被允许。',
//     406: '请求的格式不可得。',
//     410: '请求的资源被永久删除，且不会再得到的。',
//     422: '当创建一个对象时，发生一个验证错误。',
//     500: '服务器发生错误，请检查服务器。',
//     502: '网关错误。',
//     503: '服务不可用，服务器暂时过载或维护。',
//     504: '网关超时。',
//  //-----English
//     200: The server successfully returned the requested data. ',
//     201: New or modified data is successful. ',
//     202: A request has entered the background queue (asynchronous task). ',
//     204: Data deleted successfully. ',
//     400: 'There was an error in the request sent, and the server did not create or modify data. ',
//     401: The user does not have permission (token, username, password error). ',
//     403: The user is authorized, but access is forbidden. ',
//     404: The request sent was for a record that did not exist. ',
//     405: The request method is not allowed. ',
//     406: The requested format is not available. ',
//     410':
//         'The requested resource is permanently deleted and will no longer be available. ',
//     422: When creating an object, a validation error occurred. ',
//     500: An error occurred on the server, please check the server. ',
//     502: Gateway error. ',
//     503: The service is unavailable. ',
//     504: The gateway timed out. ',
//  * @see https://beta-pro.ant.design/docs/request-cn
//  */
// export const request: RequestConfig = {
//   errorHandler: (error: any) => {
//     const { response } = error;

//     if (!response) {
//       notification.error({
//         description: '您的网络发生异常，无法连接服务器',
//         message: '网络异常',
//       });
//     }
//     throw error;
//    },
// };
