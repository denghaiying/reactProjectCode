import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITreeService, ITableService } from '@/eps/commons/panel';
import SysStore from '../../../stores/system/SysStore';
import moment from 'moment';

class Kfpm1Service extends BaseService implements IEpsService, ITreeService, ITableService {
  loadAsyncDataByKey(key: any): Promise<any> {
    return new Promise<any>(resolve => {
      return resolve([])
    });
  }

  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
    args['page'] = page;
    args['limit'] = size;
    args['pageIndex'] = page;
    args['pageSize'] = size;
    args['sortField'] = "";
    args['sortOrder'] = "";
    if (args['staDate']) {
      args['staDate'] = moment(args['staDate']).format('YYYY-MM-DD HH:mm:ss');
    }
    if (args['endDate']) {
      args['endDate'] = moment(args['endDate']).format('YYYY-MM-DD HH:mm:ss');
    }
    return new Promise(async (resolve, reject) => {
      try {
        const res = await super.get({ url: this.url + '/queryForPage', params: args });
        if (res.status > 300) {
          return reject(res);
        }
        return resolve(res.data);
      } catch (err) {
        return reject(err);
      }
    })
  }

  findAll(params:any) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await super.post({ url: this.url + '/queryForPage', params });
        if (res.status > 300) {
          return reject(res);
        }
        return resolve(res.data);
      } catch (err) {
        return reject(err);
      }
    })
  }

  saveByKey(key:'', data: any) {
    return super.save(data);
  }

  updateForTable(data: any) {
    return super.update(data)
  }

  deleteForTable(data: {}) {
    return super.del(data);
  }

  //左边单位树
  findTree(key: string = '') {
    let params = { 'dwmc': key }
    let address = "/eps/control/main/dw"
    return new Promise(async (resolve, reject) => {
      try {
        const res = await super.get({ url: address + `/queryForListByYhid?yhid=${SysStore.getCurrentUser().id}`, params });
        if (res.status > 300) {
          return reject(res);
        }
        let data = res.data.map((item: { id: any; mc: any; }) => { return { id: item.id, title: item.mc, key: item.id }; });
        return resolve(data);
      } catch (err) {
        return reject(err);
      }
    })
  }

  page(): Function {
    throw new Error('Method not implemented.');
  }
}

export default new Kfpm1Service('/api/eps/control/main/kfpm1');
