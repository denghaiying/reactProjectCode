import BaseService from '@/eps/commons/v3/BaseService';
import IEpsStore from '@/eps/commons/IEpsStore';
import SysStore from "@/stores/system/SysStore";
import {ITableService, ITreeService} from "@/eps/commons/panel";


class ZdgxService extends BaseService implements IEpsService, ITableService {

  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
    args['page'] = page;
    args['limit'] = size;
    args['pageIndex']= page;
    args['pageSize']= size;
    args['sortField']= "";
    args['sortOrder']= "";
    return new Promise((resolve, reject) => {
            return super.get({url: this.url,params: args}).then(res => {
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
    if(data['bgqx']){
      data['bgqx']='Y'
    }else{
      data['bgqx']='N'
    }
    return super.save(data)
  }

  updateForTable(data) {
    if(data['bgqx']){
      data['bgqx']='Y'
    }else{
      data['bgqx']='N'
    }
    return super.update(data)
  }

  deleteForTable(data) {
    return super.delete(data);
  }
}

export default new ZdgxService('/api/eps9/tyjk/zdgx');
