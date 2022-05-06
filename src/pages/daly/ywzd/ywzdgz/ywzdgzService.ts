import BaseService from '@/eps/commons/v2/BaseService';
import IEpsStore from '@/eps/commons/IEpsStore';
import { ITableService, ITreeService } from '@/eps/commons/panel';
import SysStore from '@/stores/system/SysStore';

class YwzdgzService
  extends BaseService
  implements IEpsStore, ITreeService, ITableService
{
  page(): Function {
    throw new Error('Method not implemented.');
  }

  findByKey(
    key: string | number,
    page: number = 1,
    size: number = 20,
    args: object = {},
  ): Promise<any> {
    console.log('argsmk1', args);
    args['page'] = page;
    args['limit'] = size;
    args['pageIndex'] = page;
    args['pageSize'] = size;
    args['sortField'] = '';
    args['sortOrder'] = '';

    //  args['search']= key;
    debugger;
    console.log('argsmk', args);
    return new Promise((resolve, reject) => {
      return super
        .get({ url: this.url + '/queryforDazdmxnr', params: args })
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

  // 保存
  savetz(data) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: '/api/eps/control/main/dagl/reSetDabm', params: data })
        .then((res) => {
          if (res.data && res.data.success) {
            return resolve(res.data);
          }
          return reject(res.data.message);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  findAll(params: any) {
    return new Promise((resolve, reject) => {
      return super
        .get({ url: this.url + '/queryForList', params })
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

  saveByKey(key, data) {
    return super.save(data);
  }

  updateForTable(data) {
    return super.update(data);
  }

  deleteForTable(data) {
    return super.del(data);
  }

  currentPage: Number;
  list: Array<any>;
  pageSize: Number;
  params: JSON;
  tableLoading: Boolean;

  findTree(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      return super
        .get({ url: this.url + '/queryForList' })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          let data = res.data.map((item) => {
            return { id: item.mkbh, title: item.mc, key: item.mkbh };
          });
          return resolve(data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  loadAsyncDataByKey(key): Promise<any> {
    return Promise.resolve(undefined);
  }
}

export default new YwzdgzService('/api/eps/control/main/dazd');