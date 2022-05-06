import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ISelectService } from '@/eps/commons/panel';

class SelectService extends BaseService implements IEpsService, ISelectService {


    findByKey(key: string | number,args: object = {}): Promise<any> {
        args['dwid'] = key ;
        args['sortField']= "";
        args['sortOrder']= "";

        return new Promise((resolve, reject) => {
                return super.get({url: this.url + '/queryForList' , params: args}).then(res => {
                    if(res.status > 300){
                        return reject(res)
                    }

                    return resolve(res.data.map(item => {
                        return  {key: item.id,'id': item.id, 'label': item.code+'|'+item.name, 'value': item.id, ...item}
                    }))
                }).catch(err => {
                    return reject(err)
                })
            }
        )
    }

    /*findSelectByKey(key: string | number,args: object = {}): Promise<any> {
        args['dwid'] = key || SysStore.getCurrentCmp().id;
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
    }*/

}

export default new SelectService('/api/eps/control/main/role');
