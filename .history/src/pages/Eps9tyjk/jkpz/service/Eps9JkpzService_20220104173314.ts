import BaseService from '@/eps/commons/v2/BaseService';
import IEpsStore from '@/eps/commons/IEpsStore';
import SysStore from "@/stores/system/SysStore";
import {ITableService, ITreeService} from "@/eps/commons/panel";
import moment from 'moment';


class Eps9JkpzService extends BaseService implements IEpsService, ITableService {

  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
    return super.findForPage(this.url+"/findForPage",args,page,size);
 }


  saveByKey(key, data) {
    if(data['sqjcqy']){
      data['sqjcqy']='Y'
    }else{
      data['sqjcqy']='N'
    }
    if(data['scdh']){
      data['scdh']='Y'
    }else{
      data['scdh']='N'
    }
     if(data['afterdele']){
      data['afterdele']='是'
    }else{
      data['afterdele']='否'
    }
    data['whsj'] = moment().format('YYYY-MM-DD HH:mm:ss');
    return super.save(data)
  }

  updateForTable(data) {
    if(data['sqjcqy']){
      data['sqjcqy']='Y'
    }else{
      data['sqjcqy']='N'
    }
    if(data['scdh']){
      data['scdh']='Y'
    }else{
      data['scdh']='N'
    }
    if(data['afterdele']){
      data['afterdele']='是'
    }else{
      data['afterdele']='否'
    }
    data['whsj'] = moment().format('YYYY-MM-DD HH:mm:ss');
    return super.update(data)
  }

  deleteForTable(data) {
    return super.del(data);
  }

 batchDelete(data) {
    return new Promise((resolve, reject) => {
      let fromData = new FormData()
      fromData.append('data', JSON.parse(JSON.stringify(data)))
      return super.delete({
        url: `${this.url}/batchDelete`,
        data
      }).then(res => {
        if (res.data && res.data.success) {
          return resolve(res.data);
        }
        return reject(res.data.message)
      }).catch(err => {
        return reject(err);
      })
    })
  }
}

export default new Eps9JkpzService('/api/eps9/tyjk/jkpz');
