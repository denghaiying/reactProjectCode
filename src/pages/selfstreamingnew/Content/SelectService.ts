import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ISelectService } from '@/eps/commons/panel';
import SysStore from '../../../stores/system/SysStore';

class SelectService extends BaseService implements IEpsService, ISelectService {


  findByKey(key: string | number,args: object = {}): Promise<any> {
    args['channeltypelx'] = key ;
    args['sortField']= "";
    args['sortOrder']= "";
    debugger;

    return new Promise((resolve, reject) => {
        return super.get({url: this.url + '/queryChannelTree' , params: args}).then(res => {
          if(res.status > 300){
            return reject(res)
          }
          return resolve(res.data.map(item => {
            return  {key: item.channelid, value: item.channelid,...item}
          }))
        }).catch(err => {
          return reject(err)
        })
      }
    )
  }

  findSelectByKey(key: string | number,args: object = {}): Promise<any> {
    args['channeltypelx'] = key ;
    args['sortField']= "";
    args['sortOrder']= "";

    return new Promise((resolve, reject) => {
        return super.get({url: this.url + '/querySJZdTree' ,params: args}).then(res => {
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

export default new SelectService('/api/streamingapi/new/channeltype');
