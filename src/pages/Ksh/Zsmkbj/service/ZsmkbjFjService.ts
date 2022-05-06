import BaseService from '@/eps/commons/v3/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITableService } from '@/eps/commons/panel';
import SysStore from '@/stores/system/SysStore';


class ZsmkbjFjService extends BaseService implements IEpsService, ITableService {

  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
    return new Promise((resolve, reject) => {
     return super.post({url:this.url+'/findForfjPage?pageno='+page+'&pagesize='+size,  data: args})
        .then(response => {
          if (response.status === 200) {
              response.data.list.map(o => (o.id=o.zsmkbjfjfileid));
            return resolve(response.data);
          } else {
            return reject(response.data.message)
          }
        })
        .catch(err => {
          return reject(err);
        });
    });
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
     return  super.put({
        url: `/api/eps/ksh/zsmkbjfj/${encodeURIComponent(data.id)}`,
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

  deleteForTable(data, params) {
    return new Promise((resolve, reject) => {
    return super.post({url: '/api/eps/ksh/zsmkbjfj/deletefj?id='+params.bzmkbjid, data: data}).then(response => {
        if (response.status === 200) {
         return resolve(true);
        } else {
           return reject(response.data.message)
        }
      }).catch(err => {
        return reject(err);
      });
    });
  }
}


export default new ZsmkbjFjService('/api/eps/ksh/zsmkbj');
