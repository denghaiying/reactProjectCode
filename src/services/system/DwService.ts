import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITreeService, ITableService } from '@/eps/commons/panel';
import SysStore from '../../stores/system/SysStore';


class DwService extends BaseService implements IEpsService, ITreeService, ITableService {
  loadAsyncDataByKey(key: any): Promise<any> {
    return new Promise<any>(resolve => {
      return resolve([])
    });
  }

  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {

    args['dwidlike'] = key;
    args['page'] = page;
    args['limit'] = size;
    args['pageIndex'] = page;
    args['pageSize'] = size;
    args['sortField'] = "";
    args['sortOrder'] = "";
    return new Promise((resolve, reject) => {
      return super.get({ url: this.url + '/queryForListInOwner', params: args }).then(res => {
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

  saveByKey(key, data) {
    return super.save(data);
  }

  updateForTable(data) {

    return new Promise((resolve, reject) => {
      if (data.fid === data.id) {
        return reject("父级单位不能与当前单位相同！")
      }
      return resolve(true);
    }).then(res => {
      return super.update(data)
    })
  }

  deleteForTable(data) {

    return super.del(data);
  }

  batchDelete(data) {
    return super.delete(data);
  }




  //左边单位树
  findTree(key: string = '') {

    let params = { 'dwmc': key }
    let address = "/api/eps/control/main/dw"
    return new Promise((resolve, reject) => {
      return super.get({ url: address + `/queryForListByYhid_ReactTree`, params }).then(res => {
        if (res.status > 300) {
          return reject(res)
        }
        //let data = res.data.map(item => { return { id: item.id, title: item.mc, key: item.id } })
        console.log("res.data", res.data);
        return resolve(res.data)
      }).catch(err => {
        return reject(err)
      })
    }
    )
  }

  page(): Function {
    throw new Error('Method not implemented.');
  }
}

export default new DwService('/api/eps/control/main/dw');
