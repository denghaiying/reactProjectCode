import BaseService from '@/eps/commons/v2/BaseService';

import SysStore from '../../../stores/system/SysStore';


class DajsService extends BaseService{

  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {

    args['page'] = page;
    args['limit'] = size;
    args['pageIndex'] = page;
    args['pageSize'] = size;
    args['sortField'] = "";
    args['sortOrder'] = "";
    return new Promise((resolve, reject) => {
      return super.get({ url: this.url + '/queryForPage', params: args }).then(res => {
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



  findAll(params) {
    return new Promise((resolve, reject) => {
      return super.post({ url: this.url + '/queryForPage', params }).then(res => {
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

}

export default new DajsService('/api/eps/control/main/gsyjjssqd');
