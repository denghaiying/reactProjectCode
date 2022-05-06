import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import {  ITableService } from '@/eps/commons/panel';
import SysStore from '../../../stores/system/SysStore'

class DbswService extends BaseService implements IEpsService, ITableService {

  loadAsyncDataByKey(key: any): Promise<any> {
    return new Promise<any>(resolve => {
      return resolve([])
    });
  }

  findByKey(key: string | number ,page: number = 1, size: number = 50, args: object = {}): Promise<any> {

    args['page'] = page;
    args['limit'] = size;
    args['pageIndex'] = page;
    args['pageSize'] = size;
    args['sortField'] = "";
    args['sortOrder'] = "";
    args['sqr']="";
    args['sqbm'] = "";
    args['wfid']=key;

    console.log('args==',args);


    return new Promise((resolve, reject) => {
        return super.get({ url: this.url + '/queryForPage', params: args }).then(res => {
          if (res.status > 300) {
            return reject(res)
          }
          console.log('res.data',res);
          return resolve(res.data)
        }).catch(err => {
          return reject(err)
        })
      }
    )
  }


  findAll(params) {
    return new Promise((resolve, reject) => {
        return super.post({ url: this.url + '/queryTree', params }).then(res => {
          if (res.status > 300) {
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

    return super.save(data);
  }

  updateForTable(data) {
    return super.update(data)
  }

  deleteForTable(data) {

    return super.del(data);
  }




  page(): Function {
    throw new Error('Method not implemented.');
  }
}

export default new DbswService('/api/eps/workflow/dbsw');
