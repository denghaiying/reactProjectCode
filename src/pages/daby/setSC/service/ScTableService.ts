import IEpsService from '@/eps/commons/IEpsService';
import { ITableService } from '@/eps/commons/panel';
import BaseService from '@/eps/commons/v3/BaseService';

class ScTableService extends BaseService implements IEpsService, ITableService {
  findByKey(
    key: string | number,
    page: number,
    size: number,
    args?: Record<string, unknown> | undefined,
  ) {
    return new Promise((resolve, reject) => {
      return super
        .get({ url: this.url + '/', params: args })
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
  saveByKey(
    key: any,
    data: Record<string, unknown>,
    params?: Record<string, unknown> | undefined,
  ) {
    return Promise.resolve([]);
  }
  deleteForTable(
    data: Record<string, unknown>,
    params?: Record<string, unknown> | undefined,
  ) {
    return super.delete(data);
  }
  updateForTable(
    data: Record<string, unknown>,
    params?: Record<string, unknown> | undefined,
  ) {
    return Promise.resolve([]);
  }
}

export default new ScTableService('/api/dabysc');
