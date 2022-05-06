import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITreeService, ITableService } from '@/eps/commons/panel';
import SysStore from '../../../stores/system/SysStore';
import moment, { isMoment } from 'moment';


class StlqService extends BaseService implements IEpsService, ITreeService, ITableService {
  loadAsyncDataByKey(key: any): Promise<any> {
    return new Promise<any>(resolve => {
      return resolve([])
    });
  }

  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
    args['page'] = page;
    args['limit'] = size;
    args['pageIndex'] = page;
    args['pageSize'] = size;
    args['sortField'] = "";
    args['sortOrder'] = "";

    if (args['datebe']) {
      args['cx_kssqrq'] = args['datebe'][0].format('YYYY-MM-DD');
      args['cx_jssqrq'] = moment(args['datebe'][1]).add(1, 'days').format('YYYY-MM-DD');
    }
    return new Promise((resolve, reject) => {
      return super.get({ url: this.url + '/queryForJydmxPage', params: args }).then(res => {
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

    //stlq的状态
    queryLqOrghTree() {
      let params = { 'node': 'root','zt':'stlq' };
      let address = "/api/eps/control/main/jydcx"
      return new Promise((resolve, reject) => {
        return super.get({ url: address + `/queryLqOrghTree`, params }).then(res => {
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
    return super.update(data)
  }

  deleteForTable(data) {

    return super.del(data);
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

  page(): Function {
    throw new Error('Method not implemented.');
  }
}

export default new StlqService('/api/eps/control/main/jydcx');
