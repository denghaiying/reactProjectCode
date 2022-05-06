import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITableService } from '@/eps/commons/panel';
import SysStore from '../../stores/system/SysStore';

class RoleService extends BaseService implements IEpsService, ITableService {
    findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
      args['dwid'] = key || SysStore.getCurrentCmp().id;
      args['page'] = page;
      args['limit'] = size;
      args['pageIndex']= page;
      args['pageSize']= size;
      args['sortField']= "";
      args['sortOrder']= "";
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



  /**
 * 根据params中的code查询借阅单是否启用状态
 */
    queryJydByCode = () => {
      return new Promise((resolve, reject) => {
         super.get(`${this.url}/queryForKeyByCode?code=${this.jydCode}`).then(res => {
           return resolve(res.data);
         }).catch(err => reject(err));
      });
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
      return super.save(data);
    }

    updateForTable(data) {
      return super.update(data)
    }

    deleteForTable(data){

      return super.del(data);
    }


    copyRoleqx (params){
      return new Promise((resolve, reject) => {
        return super.post({url: this.url + '/copyRoleqx' ,params}).then(res => {
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






}

export default new RoleService('/api/eps/control/main/role');
