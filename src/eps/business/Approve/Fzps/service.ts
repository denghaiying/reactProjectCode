import { request } from 'umi';
import type { BasicListItemDataType } from './data.d';
import SysStore from "@/stores/system/SysStore";
import HttpRequest from "@/eps/commons/v2/HttpRequest";
import Sys from '@/pages/sys';

type ParamsType = {
  count?: number;
} & Partial<BasicListItemDataType>;

export async function queryFakeList(
  params: ParamsType,
): Promise<{ data: { list: BasicListItemDataType[] } }> {
  return request('/api/eps/control/main/fzspdetail/queryForPage', {
    params,
  });
}

export async function removeFakeList(
  params: ParamsType,
): Promise<{ data: { list: BasicListItemDataType[] } }> {
  return request('/api/eps/control/main/fzspdetail/delete?id='+params.id, {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addFakeList(
  params: ParamsType,
): Promise<{ data: { list: BasicListItemDataType[] } ,reject}> {
  debugger;
  return request('/api/eps/control/main/fzspdetail/add?whrid='+SysStore.getCurrentUser().id+'&whr='+SysStore.getCurrentUser().yhmc+'&fzpsid='+params.fzpsid+'&title='+params.title+'&desc='+params.desc, {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  }).catch((err) => {
    return err;
  });
}


export async function updateFakeList(
  params: ParamsType,
): Promise<{ data: { list: BasicListItemDataType[] } }> {
  return request('/api/eps/control/main/fzspdetail/update?id='+params.id+'&title='+params.title+'&desc='+params.desc, {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });

  // export async function downloadFakeList(
  //   params: ParamsType,
  // ): Promise<{ data: { list: BasicListItemDataType[] } }> {
  //   return request('/api/eps/control/main/fzpsfj/download', {
  //     method: 'POST',
  //     data: {
  //       ...params,
  //       method: 'post',
  //     },
  //   });

}
