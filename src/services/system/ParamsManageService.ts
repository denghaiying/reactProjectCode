import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITableService } from '@/eps/commons/panel';
import SysStore from '../../stores/system/SysStore';

class ParamsManageService extends BaseService implements IEpsService, ITableService {


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
        return resolve(res.data || res.results)
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

  saveByKey(key, data) {
    data['id'] = `${Math.random()}`
    data['inm'] = 'Y'
    data['mkbh'] = key
    return super.save(data);
  }

  updateForTable(data) {
    data['inm'] = 'Y'
    return super.update(data)
  }

  deleteForTable(data) {

    return super.del(data);
  }
}

export default new ParamsManageService('/api/eps/control/main/params');
