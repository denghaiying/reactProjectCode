import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITreeService, ITableService } from '@/eps/commons/panel';
import SysStore from '../../../stores/system/SysStore';


class MbszService extends BaseService implements IEpsService, ITreeService, ITableService {
  loadAsyncDataByKey(key: any): Promise<any> {
    return new Promise<any>(resolve => {
      return resolve([])
    });
  }

  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {

    args['dwid'] = key;
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
        res.data?.map(o => (o.key=o.id));
        res.data?.map(o => (o.children?.map(xchildren => (xchildren.key=xchildren.id))));
        console.log("mb",res.data)
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
    if(data['by']){
      data['by']='Y'
    }else{
      data['by']='N'
    }
    if(data['sfdyw']){
      data['sfdyw']='Y'
    }else{
      data['sfdyw']='N'
    }
    return super.save(data);
  }

  updateForTable(data) {
    if(data['by']){
      data['by']='Y'
    }else{
      data['by']='N'
    }
    if(data['sfdyw']){
      data['sfdyw']='Y'
    }else{
      data['sfdyw']='N'
    }
    return super.update(data)
  }

  deleteForTable(data) {

    return super.del(data);
  }




  // //左边单位树
  // findTree(key: string = '') {
  //   let params = { 'dwmc': key }
  //   let address = "/api/eps/control/main/dw"
  //   return new Promise((resolve, reject) => {
  //     return super.get({ url: address + `/queryForListByYhid?yhid=${SysStore.getCurrentUser().id}`, params }).then(res => {
  //       if (res.status > 300) {
  //         return reject(res)
  //       }
  //       let data = res.data.map(item => { return { id: item.id, title: item.mc, key: item.id } })
  //       return resolve(data)
  //     }).catch(err => {
  //       return reject(err)
  //     })
  //   }
  //   )
  // }

  //左边单位树
  findTree(key: string = '') {
    let params = { 'dwid': key }
    let address = "/api/eps/control/main/mb"
    return new Promise((resolve, reject) => {
      return super.get({ url: address + `/queryForPage`, params }).then(res => {
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


    //查询单位树
    findDw(key: string = '') {
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

export default new MbszService('/api/eps/control/main/mb');
