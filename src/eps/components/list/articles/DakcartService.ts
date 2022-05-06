import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITableService } from '@/eps/commons/panel';
import SysStore from '@/stores/system/SysStore';
import { sqldecode, sqlencode } from '@/utils/EpsUtils';
import qs from 'qs';

class TableService extends BaseService {
  findDakcarts(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: this.url + '/queryForDakcartList', params })
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

  findDakcartsCount(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: this.url + '/queryForDakcartCount', params })
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

  deleteDakCarts(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: this.url + '/deleteDakcart', params })
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

  clearDakCarts(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: this.url + '/clearDakCarts', params })
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
}

export default new TableService('/api/eps/control/main/kfjdsp');
