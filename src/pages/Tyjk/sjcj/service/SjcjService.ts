import BaseService from '@/eps/commons/v2/BaseService';
import { ITableService } from '@/eps/commons/panel';

class SjcjService extends BaseService implements IEpsService, ITableService {
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
}

export default new SjcjService('/api/eps/control/main/swhy/midinfo');
