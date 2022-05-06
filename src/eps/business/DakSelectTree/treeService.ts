import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITreeService } from '@/eps/commons/panel';
import SysStore from '@/stores/system/SysStore';
import util from '@/utils/util';

class TreeService extends BaseService {
  findTree(params: any) {
    return new Promise((resolve, reject) => {
      return super
        .get({ url: this.url + '/queryTree', params })
        .then((res) => {
          debugger;
          if (res.status > 300) {
            return reject(res);
          }

          // let data = res.data.map(item => { return { id: item.mkbh, title: item.mc, key: item.mkbh } })
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
}

export default new TreeService('/api/eps/control/main/dak');
