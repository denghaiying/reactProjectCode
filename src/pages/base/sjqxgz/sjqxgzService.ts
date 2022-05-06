import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITreeService, ITableService } from '@/eps/commons/panel';
import SysStore from '../../../stores/system/SysStore';

class sjqxgzService
  extends BaseService
  implements IEpsService, ITreeService, ITableService
{
  loadAsyncDataByKey(key: any): Promise<any> {
    return new Promise<any>((resolve) => {
      return resolve([]);
    });
  }

  findByKey(
    key: string | number,
    page: number = 1,
    size: number = 10,
    args: object = {},
  ): Promise<any> {
    args['page'] = page;
    args['limit'] = size;
    args['pageIndex'] = page;
    args['pageSize'] = size;
    args['sortField'] = '';
    args['sortOrder'] = '';
    return new Promise((resolve, reject) => {
      return super
        .get({ url: this.url + '/queryForPage', params: args })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  findAll(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: this.url + '/queryForPage', params })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  isJSON(str) {
    if (typeof str == 'string') {
      try {
        var obj = JSON.parse(str);
        if (typeof obj == 'object' && obj) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        console.log('error：' + str + '!!!' + e);
        return false;
      }
    }
    console.log('It is not a string!');
  }

  saveByKey(key, data) {
    // data['sqltext'] = `${btoa(data['sqltext'])}`;
    return super.save(data);
  }

  updateForTable(data) {
    // data['sqltext'] = `${btoa(data['sqltext'])}`;
    return super.update(data);
  }

  deleteForTable(data) {
    return super.del(data);
  }

  //左边单位树
  findTree(key: string = '') {
    let params = { dwmc: key };
    let address = '/api/eps/control/main/dw';
    return new Promise((resolve, reject) => {
      return super
        .get({
          url:
            address +
            `/queryForListByYhid?yhid=${SysStore.getCurrentUser().id}`,
          params,
        })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          let data = res.data.map((item) => {
            return { id: item.id, title: item.mc, key: item.id };
          });
          return resolve(data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  page(): Function {
    throw new Error('Method not implemented.');
  }
}

export default new sjqxgzService('/api/eps/control/main/sjqxgz');
