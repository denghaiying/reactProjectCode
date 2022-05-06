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
    data['whr'] = SysStore.getCurrentUser().yhmc;
    data['whrid'] = SysStore.getCurrentUser().id;
    return super.save(data)
  }

  updateForTable(data) {
    debugger

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
    return new Promise((resolve, reject) => {
      if (!data || !(data.id)) {
        return reject('请正确输入待删除数据')
      }
      data['whr'] = SysStore.getCurrentUser().yhmc;
      data['whrid'] = SysStore.getCurrentUser().id;
      return super.delete(`${this.url} / ${data.id}`).then(res => {
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

export default new KkdyService('/api/eps9/tyjk/kkdy');
