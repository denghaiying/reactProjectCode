import BaseService from '@/eps/commons/v3/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITableService } from '@/eps/commons/panel';
import SysStore from '@/stores/system/SysStore';


class JcgzService extends BaseService implements IEpsService, ITableService {

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
      return super.post({ url: this.url, data: data}).then(res => {
        debugger
       if (res.status === 201) {
          return resolve(res.data);
        }
        return reject(res.data.message)
      }).catch(err => {
        return reject(err.response.data);
      })
    })
  }

  updateForTable(data) {
    return super.update(data)
  }

  deleteForTable(data) {

    return super.delete(data);
  }

  copyData(params) {
    return new Promise((resolve, reject) => {
      params['whr'] = SysStore.getCurrentUser().yhmc;
      params['whrid'] = SysStore.getCurrentUser().id;
    return super.post({ url: this.url+"/copyData", data:params}).then(res => {
     if (res.status === 201) {
        return resolve(res);
      }
      return reject(res.data.message)
    }).catch(err => {
      return reject(err.response.data);
    })
  })
}
}

export default new JcgzService('/api/api/sxjcjcgz');
