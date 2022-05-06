// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取当前的用户 GET /api/currentUser */
export async function fetchMenuData(options?: { [key: string]: any }) {
  return request<any>('/api/eps/control/main/menu/queryMenu', {
    method: 'GET',
    ...(options || {}),
  });
}

