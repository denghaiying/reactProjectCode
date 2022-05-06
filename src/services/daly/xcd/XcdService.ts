import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITreeService, ITableService } from '@/eps/commons/panel';
import SysStore from '../../../stores/system/SysStore';
import { message } from 'antd';

class XcdService extends BaseService implements IEpsService, ITreeService, ITableService {
  loadAsyncDataByKey(key: any): Promise<any> {
    return new Promise<any>(resolve => {
      return resolve([])
    });
  }

  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {

    args['start'] = page;
    args['page'] = page;
    args['limit'] = size;
    args['pageIndex'] = page;
    args['pageSize'] = size;


    args['sortField'] = "";
    args['sortOrder'] = "";

    args['yhid'] = SysStore.getCurrentUser().id;
    args['sw'] = "W";
    args['newdjlx'] = "2";

    if (args['riqi']) {
      args['cx_kssqrq'] = args['riqi'][0].format('YYYY-MM-DD');
      args['cx_jssqrq'] = args['riqi'][1].format('YYYY-MM-DD');
    }
    var code = "DALYF004";
    var yhid = SysStore.getCurrentUser().id;

    this.getUserOption(code, yhid).then(res => {
      args['spzt'] = res.message;
    })

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
    return super.save(data);
  }

  updateForTable(data) {
    return super.update(data)
  }

  deleteForTable(data) {
    return super.del(data);
  }



  addXcd(data) {
    return new Promise((resolve, reject) => {
      return super.post({ url: '/api/eps/control/main/daxc9/addXcd', params: data }).then(res => {
        if (res.data && res.data.success) {
          return resolve(res.data);

        }
        message.error('操作失败,所选条目已加入过该协查单，请确认后在添加!');
        return reject(res.data.message)
      }).catch(err => {
        return reject(err)
      })
    }
    )
  }

  getUserOption(code, yhid) {
    return new Promise((resolve, reject) => {
      return super.post({ url: `/api/eps/control/main/params/getUserOption?code=${code}&yhid=${yhid}` }).then(res => {
        if (res.status > 300) {
          return reject(res)
        }
        return reject(res.data)
      }).catch(err => {
        return reject(err)
      })
    }
    )
  }



  //检查是否以添加
  checkXcd(daxcid: string = '', tmid: string = '') {
    return new Promise((resolve, reject) => {
      return super.post({ url: `/api/eps/control/main/daxc/queryDaxcmxForList?daxcid=${daxcid}&tmid=${tmid}` }).then(res => {
        if (res.data && res.data.success) {
          return resolve(res.data);
        }
        return reject(res.data.message)
      }).catch(err => {
        return reject(err)
      })
    }
    )
  }




  //左边单位树
  findTree(key: string = '') {
    let params = { 'dwmc': key }
    let address = "/eps/control/main/dw"
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

export default new XcdService('/api/eps/control/main/daxc9');
