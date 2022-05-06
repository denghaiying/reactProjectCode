// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import HttpRequest from '@/eps/commons/v2/HttpRequest';
import UserService from '@/services/user/UserService';
import util from '@/utils/util'

const httpRequest = new HttpRequest("/api/eps/control/main");
/** 获取当前的用户 GET /api/currentUser */
export async function currentUser() {
  const token = util.getLStorage("mtoken");
  const userinfo = await UserService.checktoken(token);
  return userinfo;
}
/** 获取当前的单位 GET */
export async function currentCmp() {
  return httpRequest.get({ url: `${httpRequest.baseUrl}/getEpsSession?esname=currentdw` });
}

/** 获取当前的单位 GET */
export async function setCmpSession(dwid) {
  //return HttpRequest.post({url:`/api/eps/control/main/setEpsSession`,params:dw});
  return new Promise((resolve, reject) => {
    httpRequest.get({
      url: `${httpRequest.baseUrl}/eps/control/main/setEpsSession`,
      params: { dwid }
    }).then(res => {
      return resolve(res.data);
    }).catch(err => {
      return reject(err);
    })
  })
}

/** 根据单位id获取单位 GET */
export async function queryCmp(dwid) {
  return new Promise((resolve, reject) => {
    httpRequest.get({
      url: `${httpRequest.baseUrl}/dw/queryForId?id=${dwid}`,
    }).then(res => {
      return resolve(res.data);
    }).catch(err => {
      return reject(err);
    })
  })
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/login/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  // return request<API.NoticeIconList>('/eps/workflow/dbsw/queryForPage', {
  //   method: 'GET',
  //   ...(options || {}),
  // });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}
