import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import {ITableService} from '@/eps/commons/panel';




class GuidSimpleService extends BaseService implements IEpsService, ITableService {

    getGuid() {
        return new Promise((resolve, reject) => {
            return super.post({ url:  '/api/eps/wdgl/attachdoc/getGuid'}).then(res => {
                if (res.status > 300) {
                    return reject(res)
                }
                return resolve(res.data)
            }).catch(err => {
                return reject(err)
            })
        }
        )
      }
}

export default new GuidSimpleService('/api/eps/control/main/dagl');
