import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITableService } from '@/eps/commons/panel';
import SysStore from '../../../stores/system/SysStore';

class YhService extends BaseService implements IEpsService, ITableService {


    findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {

        args['page'] = page;
        args['limit'] = size;
        if(!args["sw"]){
            args["sw"]="W";
        }
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

    queryKTable(params) {
        return new Promise((resolve, reject) => {
            return super.post({ url: this.url + '/queryKTable', params }).then(res => {
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

    getKField(params) {
        return new Promise((resolve, reject) => {
            return super.post({ url: this.url + '/queryKFields', params }).then(res => {
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



}

export default new YhService('/api/eps/control/main/kfjdsp');
