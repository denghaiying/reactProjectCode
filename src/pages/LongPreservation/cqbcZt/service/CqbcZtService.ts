import BaseService from '@/eps/commons/v3/BaseService';
import {ITableService, ITreeService} from "@/eps/commons/panel";
import IEpsService from '@/eps/commons/IEpsService';
import SysStore from "@/stores/system/SysStore";
import moment from 'moment';

class CqbcZtService extends BaseService implements IEpsService, ITableService {

  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
    return super.findForPage(this.url+"/findForPage",args,page,size);
}


  saveByKey(key, data) {
    if(data['zt']=="true"){
      data['zt']='Y'
    }else{
      data['zt']='N'
    }
    if(data['blyw']=="true"){
       data['blyw']='Y'
       }else{
       data['blyw']='N'
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
    if(data['zt']=="true"){
      data['zt']='Y'
    }else{
      data['zt']='N'
    }
    if(data['blyw']=="true"){
       data['blyw']='Y'
       }else{
       data['blyw']='N'
    }
    return new Promise((resolve, reject) => {
      if (!data) {
        return reject('请检查待保存数据，不能为空')
      }
      data['whr'] = SysStore.getCurrentUser().yhmc;
      data['whrid'] = SysStore.getCurrentUser().id;
      data['whsj'] = moment().format('YYYY-MM-DD HH:mm:ss');
      super.put({
        url: `${this.url}/${encodeURIComponent(data.id)}`,
        data: data
      }).then(res => {

         if (res.status === 201) {
          return resolve(res.data);
        }
        return reject(res.data.message)
      }).catch(err => {
        return reject(err);
      })
    })
  }

  deleteForTable(data) {
    return super.delete(data);
  }

  findTree(key: string = '') {
      let params = { 'ztmc': key }
      return new Promise((resolve, reject) => {
        return super.post({ url: this.url + `/findForKey`,data: params }).then(res => {
          if (res.status > 300) {
            return reject(res)
          }
          let data = res.data.map(item => { return { id: item.id, title: item.ztmc, key: item.id } })
          console.log("res.data", res.data);
          return resolve(data)
        }).catch(err => {
          return reject(err)
        })
      }
      )
    }
}

export default new CqbcZtService('/api/eps/lg/cqbczt');
