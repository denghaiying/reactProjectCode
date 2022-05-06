import BaseService from '@/eps/commons/BaseService';
import { ITableService } from '@/eps/commons/panel';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';
import fetch from '@/utils/fetch';

class GpcwhService extends BaseService implements ITableService {
  //分页查询
  findByKey(
    key: string | number,
    page: number = 1,
    size: number = 10,
    args: object = {},
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      return super
        .get({ url: this.url + '/queryForList', params: args })
        .then((res) => {
          if (!res.data.success) {
            return reject(res.data.message);
          }
          return resolve(res.data.results);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // 新增数据
  saveByKey(key, data) {
    data['whr'] = SysStore.getCurrentUser().yhmc;
    data['whsj'] = moment();
    return fetch.post(this.url + `/add`, data);
  }

  // 修改数据
  updateForTable(data) {
    data['whr'] = SysStore.getCurrentUser().yhmc;
    return fetch.post(this.url + `/update`, data);
  }

  // 删除数据
  deleteForTable(data: object): Promise<any> {
    return fetch.post(this.url + `/delete`, data);
  }
}

export default new GpcwhService('/api/eps/control/main/gcpwh');
