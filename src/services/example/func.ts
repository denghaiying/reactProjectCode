import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITableService } from '@/eps/commons/panel';

class FuncService extends BaseService implements IEpsService, ITableService {


    findByKey(key: string | number, page: number = 1, size: number = 10, prams: any): Promise<any> {
      let args = {}
      args['mkbh'] = key;
      args['page'] = page;
      args['limit'] = size;
      if(prams && prams['key']){
        args['key'] = prams['key'];
      }
      return new Promise((resolve, reject) => {
        return super.get({url: this.url + '/queryForPage' ,params: args}).then(res => {
            if(res.status > 300){
              return reject(res)
            }
            let result = res.data || res.results
            return resolve(result)
          }).catch(err => {
            return reject(err)
          })
        }
      )
    }

    page(): Function {
        throw new Error('Method not implemented.');
    }

    findByTree(args = {}, fid:string = '', page: number = 1, size: number = 10){
      args[page] = page;
      args[size]= size;
      args['fid'] = fid;
      return new Promise((resolve, reject) => {
        return super.post({url: this.url + '/queryForPage' ,args}).then(res => {
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

    findAll (params){
      return new Promise((resolve, reject) => {
        return super.post({url: this.url + '/queryForPage' ,params}).then(res => {
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

    saveByKey(key, data){
      data['id'] = `${Math.random()}`
      data['inm'] = 'Y'
      data['mkbh'] = key
      return super.save(data);
    }

    updateForTable(data) {
      data['inm'] = 'Y'
      return super.update(data)
    }

    deleteForTable(data){
      return super.del(data);
    }
}

export default new FuncService('/api/eps/control/main/gn');
