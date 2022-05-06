import BaseService from '@/eps/commons/v3/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import SysStore from "@/stores/system/SysStore";
import {ITableService, ITreeService} from "@/eps/commons/panel";
import moment from 'moment';


class Eps9JkpzService extends BaseService implements IEpsService, ITableService {
  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
    return super.findForPage(this.url+"/findForPage",args,page,size);
 }


  saveByKey(key, data) {
    if(data['qyusing']=="true"){
      data['qyusing']='Y'
    }else{
      data['qyusing']='N'
    }
    return new Promise((resolve, reject) => {
      if (!data) {
        return reject('请检查待保存数据，不能为空')
      }
      debugger
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
    debugger
    if(data['qyusing']){
      data['qyusing']='Y'
    }else{
      data['qyusing']='N'
    }
    data['whr'] = SysStore.getCurrentUser().yhmc;
    data['whrid'] = SysStore.getCurrentUser().id;
    data['whsj'] = moment().format('YYYY-MM-DD HH:mm:ss');
    return super.update(data)
  }

  deleteForTable(data) {
    return super.delete(data);
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

  findForKey(params) {
    return new Promise((resolve, reject) => {
      super .post({url:this.url+"/findForKey",params})
        .then(response => {
          if (response.status === 200) {
            resolve(response.data);
          } else {
            return reject(response.data.message)
          }
        })
        .catch(err => {
           return reject(err);
        });
    });
  }

  findTree(key: string = '') {
    let params = { 'name': key }
    return new Promise((resolve, reject) => {
      return super.post({ url: this.url + `/findForKey`,data: params }).then(res => {
        if (res.status > 300) {
          return reject(res)
        }
        let data = res.data.map(item => { return { id: item.id, title: item.name, key: item.id } })
        console.log("res.data", res.data);
        return resolve(data)
      }).catch(err => {
        return reject(err)
      })
    }
    )
  }
}

export default new Eps9JkpzService('/api/eps9/tyjk/jkpz');
