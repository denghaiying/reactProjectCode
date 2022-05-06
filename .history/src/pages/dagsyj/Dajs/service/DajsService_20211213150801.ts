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

  //左边单位树
  findTree(key: string = '') {
    let params = { 'dwmc': key }
    let address = "/api/eps/control/main/dw"
    return new Promise((resolve, reject) => {
      return super.get({ url: address + `/queryForListByYhid?yhid=${SysStore.getCurrentUser().id}`, params }).then(res => {
        if (res.status > 300) {
          return reject(res)
        }
        let data = res.data.map(item => { return { id: item.id, title: item.mc, key: item.id } })
        return resolve(data)
      }).catch(err => {
        return reject(err)
      })
    }
    )
  }
}

export default new DajsService('/eps/control/main/gsyjjssqd');
