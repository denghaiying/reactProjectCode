import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITreeService } from '@/eps/commons/panel';
import SysStore from '@/stores/system/SysStore';
import util from '@/utils/util';

class DataDictionaryService extends BaseService {
  query(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: this.url + '/querySjzdmxBySjzd', params })
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

// const response = await fetch.post(
//   `/api/eps/control/main/sjzdmx/querySjzdmxBySjzd?mc=档案开放去向`,
// );
// if (response.status === 200) {
//   runInAction(() => {
//     const publishTo = response.data.map((o) => ({
//       id: o.id,
//       label: o.mc,
//       value: o.mc,
//     }));
//     console.log('publish:', publishTo);
//     this.publishTo = publishTo;
//   });
// }

export default new DataDictionaryService('/api/eps/control/main/sjzdmx');
