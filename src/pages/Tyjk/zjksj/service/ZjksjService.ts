import BaseService from '@/eps/commons/v2/BaseService';
import IEpsStore from '@/eps/commons/IEpsStore';
import SysStore from "@/stores/system/SysStore";
import {ITableService, ITreeService} from "@/eps/commons/panel";


class ZjksjService extends BaseService implements IEpsService, ITableService {

  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
        args['page'] = page;
        args['limit'] = size;
        args['pageIndex']= page;
        args['pageSize']= size;
        args['sortField']= "";
        args['sortOrder']= "";
        if(key !=""){
           args['jkpzid'] = key;
          return new Promise((resolve, reject) => {
                    return super.get({url: this.url + '/queryZjksjForPage' ,params: args}).then(res => {
                        if(res.status > 300){
                            return reject(res)
                        }
                        if(res.data.total>0){
                            const dd = res.data.results.map(item =>  {return {...item, id: item.ID}})
                            return resolve(dd)
                        }else{
                            return resolve(res.data)
                        }
                    }).catch(err => {
                        return reject(err)
                    })
                }
            )
        }
 
  }


  saveByKey(key, data) {
    return super.save(data)
  }

  updateForTable(data) {
    
    return super.update(data)
  }

  deleteForTable(data) {
    return super.del(data);
  }

}

export default new ZjksjService('/api/eps/tyjk/zjk');
