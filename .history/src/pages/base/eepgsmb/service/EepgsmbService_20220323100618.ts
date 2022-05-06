import BaseService from '@/eps/commons/v3/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITableService } from '@/eps/commons/panel';
import SysStore from '@/stores/system/SysStore';


class KshflService extends BaseService implements IEpsService, ITableService {

  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {

     return super.findForPage(this.url+"/findForPage",args,page,size);
  }


  saveByKey(key, data) {
      debugger
      return super.save(data);
  }

  updateForTable(data) {

    return super.update(data)
  }

  deleteForTable(data) {

    return super.delete(data);
  }

  findTree(key: string = '') {
    let params = { 'kshflmc': key }
    return new Promise((resolve, reject) => {
      return super.post({ url: this.url + `/findList`,data: params }).then(res => {
        if (res.status > 300) {
          return reject(res)
        }
        let data = res.data.map(item => { return { id: item.id, title: item.kshflmc, key: item.id } })
        console.log("res.data", res.data);
        return resolve(data)
      }).catch(err => {
        return reject(err)
      })
    }
    )
  }
}


export default new KshflService('/api/eps/control/main/eepgsmb');
