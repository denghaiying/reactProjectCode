import BaseService from '@/eps/commons/v3/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITableService } from '@/eps/commons/panel';
import SysStore from '@/stores/system/SysStore';


class KkjsService extends BaseService implements IEpsService, ITableService {

  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
    if(args['key']){
      args['page'] = page;
      args['limit'] = size;
      args['pageIndex']= page;
      args['pageSize']= size;
      args['sortField']= "";
      args['sortOrder']= "";
      args['dw'] = SysStore.getCurrentCmp().id;
      return new Promise((resolve, reject) => {
              return super.get({url: this.url + '/queryForPage' ,params: args}).then(res => {
                  if(res.status > 300){
                      return reject(res)
                  }
                  return resolve(res.data)
              }).catch(err => {
                  return reject(err)
              })
          }
      )
    }else{
      return new Promise((resolve, reject) => {
              return resolve([])
      })
    }
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

    return super.update(data)
  }

  deleteForTable(data) {

    return super.delete(data);
  }
}


export default new KkjsService('/api/eps/control/main/kkjs');