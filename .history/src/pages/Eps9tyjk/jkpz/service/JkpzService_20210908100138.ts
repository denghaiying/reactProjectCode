import BaseService from '@/eps/commons/v2/BaseService';
import IEpsStore from '@/eps/commons/IEpsStore';
import SysStore from "@/stores/system/SysStore";
import {ITableService, ITreeService} from "@/eps/commons/panel";
import moment from 'moment';


class JkpzService extends BaseService implements IEpsService, ITableService {

  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
        args['page'] = page;
        args['limit'] = size;
        args['pageIndex']= page;
        args['pageSize']= size;
        args['sortField']= "";
        args['sortOrder']= "";
        args["zjkid"]=key;
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
  }


  saveByKey(key, data) {
    if(data['sqjcqy']){
      data['sqjcqy']='Y'
    }else{
      data['sqjcqy']='N'
    }
    if(data['scdh']){
      data['scdh']='Y'
    }else{
      data['scdh']='N'
    }
     if(data['afterdele']){
      data['afterdele']='是'
    }else{
      data['afterdele']='否'
    }
    data['whsj'] = moment().format('YYYY-MM-DD HH:mm:ss');
    return super.save(data)
  }

  updateForTable(data) {
    if(data['sqjcqy']){
      data['sqjcqy']='Y'
    }else{
      data['sqjcqy']='N'
    }
    if(data['scdh']){
      data['scdh']='Y'
    }else{
      data['scdh']='N'
    }
    if(data['afterdele']){
      data['afterdele']='是'
    }else{
      data['afterdele']='否'
    }
    data['whsj'] = moment().format('YYYY-MM-DD HH:mm:ss');
    return super.update(data)
  }

  deleteForTable(data) {
    return super.del(data);
  }

 batchDelete(data) {
    return new Promise((resolve, reject) => {
      let fromData = new FormData()
      fromData.append('data', JSON.parse(JSON.stringify(data)))
      return super.delete({
        url: `${this.url}/batchDelete`,
        data
      }).then(res => {
        if (res.data && res.data.success) {
          return resolve(res.data);
        }
        return reject(res.data.message)
      }).catch(err => {
        return reject(err);
      })
    })
  }

  findTree(key: string = '') {
    let params = { 'name': key }
    return new Promise((resolve, reject) => {
      return super.get({ url: this.url + `/findList`, params }).then(res => {
        if (res.status > 300) {
          return reject(res)
        }
        let data = res.data.map(item => { return { id: item.id, title: item.name, key: item.id } })
        console.log("res.data", res.data);
        return resolve(data)
      }).catch(err => {
        return reject(err)
      })
    }
    )
  }
}

export default new JkpzService('/api/eps/tyjk/jkpz');
