import BaseService from '@/eps/commons/v2/BaseService';
import SysStore from '../../stores/system/SysStore';
import moment from 'moment';
import { ITableService } from "src/eps/commons/panel";

class IpAddressesService extends BaseService implements ITableService {

    page(): Function {
        throw new Error('Method not implemented.');
    }

  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {

    args['ipaddresses'] = key;
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

  saveByKey(key, data) {
      data['whsj']=moment().format('YYYY-MM-DD HH:mm:ss');
    return super.save(data);
  }

  updateForTable(data) {
       data['whsj']=moment().format('YYYY-MM-DD HH:mm:ss');
    return super.update(data)
  }

  deleteForTable(data) {
    return super.del(data);
  }

   //左边单位树
  findTree(key: string = '') {
    let params = { 'mc': key }
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

export default new IpAddressesService('/api/eps/control/main/ipAddresses/');
