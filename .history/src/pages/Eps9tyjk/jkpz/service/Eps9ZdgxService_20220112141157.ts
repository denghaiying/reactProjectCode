import BaseService from '@/eps/commons/v3/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import SysStore from "@/stores/system/SysStore";
import {ITableService, ITreeService} from "@/eps/commons/panel";


class Eps9ZdgxService extends BaseService implements IEpsService, ITableService {

  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
    return super.findForPage(this.url+"/findForPage",args,page,size);
  }


  saveSj(val) {
    for(var i=0;i<val.length;i++){
      var a=val[i];
      if(a['bgqx']){
        a['bgqx']='Y'
      }else{
        a['bgqx']='N'
      }
      a['whr'] = SysStore.getCurrentUser().yhmc;
      a['whrid'] = SysStore.getCurrentUser().id;
      a['whsj'] = SysStore.getCurrentUser().id;
    }

    return new Promise((resolve, reject) => {
      if (!data) {
        return reject('请检查待保存数据，不能为空')
      }

      return super.post({ url: this.url, data: data}).then(res => {

       if (res.status === 201) {
          return resolve(res.data);
        }
        return reject(res.data.message)
      }).catch(err => {
        return reject(err);
      })
    })
  }

  saveByKey(key, data) {
    if(data['bgqx']){
      data['bgqx']='Y'
    }else{
      data['bgqx']='N'
    }
    return new Promise((resolve, reject) => {
      if (!data) {
        return reject('请检查待保存数据，不能为空')
      }
      data['whr'] = SysStore.getCurrentUser().yhmc;
      data['whrid'] = SysStore.getCurrentUser().id;
      return super.post({ url: this.url, data: data}).then(res => {

       if (res.status === 201) {
          return resolve(res.data);
        }
        return reject(res.data.message)
      }).catch(err => {
        return reject(err);
      })
    })
  }

  updateForTable(data) {
    if(data['bgqx']){
      data['bgqx']='Y'
    }else{
      data['bgqx']='N'
    }
    return super.update(data);
  }

  deleteForTable(data) {
    return super.delete(data);
  }
}

export default new Eps9ZdgxService('/api/eps9/tyjk/zdgx');
