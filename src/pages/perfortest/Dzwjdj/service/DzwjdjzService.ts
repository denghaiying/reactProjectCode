import BaseService from '@/eps/commons/v3/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITableService } from '@/eps/commons/panel';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';


class DzwjdjzService extends BaseService implements IEpsService, ITableService {

  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
      return super.findForPage(this.url+"/findForPage",args,page,size);
  }


  saveByKey(key, data) {
      return new Promise((resolve, reject) => {
      if (!data) {
        return reject('请检查待保存数据，不能为空')
      }
      data['whr'] = SysStore.getCurrentUser().yhmc;
      data['whrid'] = SysStore.getCurrentUser().id;
       if (moment(data.dzwjinfowcrq)) {
        data.dzwjinfowcrq = data.dzwjinfowcrq.format("YYYY-MM-DD HH:mm:ss");
      }
      if (moment(data.dzwjinfotbrq)) {
        data.dzwjinfotbrq = data.dzwjinfotbrq.format("YYYY-MM-DD HH:mm:ss");
      }
      if (moment(data.dzwjinfosqrq)) {
        data.dzwjinfosqrq = data.dzwjinfosqrq.format("YYYY-MM-DD HH:mm:ss");
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

  updateForTable(data) {
      if (moment(data.dzwjinfowcrq)) {
        data.dzwjinfowcrq = data.dzwjinfowcrq.format("YYYY-MM-DD HH:mm:ss");
      }
      if (moment(data.dzwjinfotbrq)) {
        data.dzwjinfotbrq = data.dzwjinfotbrq.format("YYYY-MM-DD HH:mm:ss");
      }
      if (moment(data.dzwjinfosqrq)) {
        data.dzwjinfosqrq = data.dzwjinfosqrq.format("YYYY-MM-DD HH:mm:ss");
      }
    return super.update(data)
  }

  deleteForTable(data) {
    
    return super.delete(data);
  }
}

export default new DzwjdjzService('/api/api/dzwjdj');