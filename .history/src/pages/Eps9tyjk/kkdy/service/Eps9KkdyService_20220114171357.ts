import BaseService from '@/eps/commons/v3/BaseService';
import {ITableService, ITreeService} from "@/eps/commons/panel";
import IEpsService from '@/eps/commons/IEpsService';
import SysStore from "@/stores/system/SysStore";
import moment from 'moment';

class Eps9KkdyService extends BaseService implements IEpsService, ITableService {

  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
    args['page'] = page;
    args['limit'] = size;
    args['pageIndex']= page;
    args['pageSize']= size;
    args['sortField']= "";
    args['sortOrder']= "";
    args["jkid"]=key;
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
}

export default new Eps9KkdyService('/api/eps9/tyjk/kkdy');
