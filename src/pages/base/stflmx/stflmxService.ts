import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import {  ITableService } from '@/eps/commons/panel';
import SysStore from '../../../stores/system/SysStore';
import {isMoment} from "moment";


class Stflmxservice extends BaseService implements IEpsService, ITableService {
    loadAsyncDataByKey(key: any): Promise<any> {
        return new Promise<any>(resolve => {
            return resolve([])
        });
    }

    findByKey(key: string | number ,page: number = 1, size: number = 10, args: object = {}): Promise<any>{

        args['page'] = page;
        args['limit'] = size;
        args['pageIndex'] = page;
        args['pageSize'] = size;
        args['sortField'] = "";
        args['sortOrder'] = "";
        args['fid']="";
        args['flid'] = key ;
        args['dwid'] = args['treeData'];

        return new Promise((resolve, reject) => {
                return super.get({ url: this.url + '/queryForPageE9', params: args }).then(res => {
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


    findSelectByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
        args['sortField'] = "";
        args['sortOrder'] = "";
        args['dwid'] = key || SysStore.getCurrentCmp().id;
        args['flid'] ="";
        return new Promise((resolve, reject) => {

                return super.get({ url: this.url + '/queryStflList', params: args }).then(res => {
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
                return super.post({ url: this.url + '/queryForPageE9', params }).then(res => {
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

       /* if (data.kssj) {
            data.kssj = data.kssj.format("YYYY-MM-DD");
        }
        if (data.jssj) {
            data.jssj=data.jssj.format("YYYY-MM-DD");
        }*/


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

export default new Stflmxservice('/api/eps/control/main/stflmx');
