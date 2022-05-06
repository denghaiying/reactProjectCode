import BaseService from '@/eps/commons/v2/BaseService';
import {ITableService, ITreeService} from "@/eps/commons/panel";
import IEpsService from '@/eps/commons/IEpsService';
import SysStore from "@/stores/system/SysStore";
import moment from 'moment';

class KkdyService extends BaseService implements IEpsService, ITableService {

  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
    args['page'] = page;
    args['limit'] = size;
    args['pageIndex']= page;
    args['pageSize']= size;
    args['sortField']= "";
    args['sortOrder']= "";
    return new Promise((resolve, reject) => {
            return super.get({url: this.url + '/findForPage' ,params: args}).then(res => {
                if(res.status > 300){
                    return reject(res)
                }
                return resolve(res.data)
            }).catch(err => {
                return reject(err)
            })
        }
    )
}


  saveByKey(key, data) {
    data['whr'] = SysStore.getCurrentUser().yhmc;
    data['whrid'] = SysStore.getCurrentUser().id;
    return super.save(data)
  }

  updateForTable(data) {
    debugger
    data['whr'] = SysStore.getCurrentUser().yhmc;
    data['whrid'] = SysStore.getCurrentUser().id;
    data['whsj'] = moment().format('YYYY-MM-DD HH:mm:ss');
    return super.update(data)
  }

  deleteForTable(data) {
    debugger
    return super.del(data);
  }
}

export default new KkdyService('/api/eps9/tyjk/kkdy');
