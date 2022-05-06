import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITableService } from '@/eps/commons/panel';

class OptrightService extends BaseService {
  getFunctionInfo(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: '/api/eps/control/main/getFunctionInfo', params })
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

export default new OptrightService('/api/eps/control/main/gnopt');
