import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import {  ITableService } from '@/eps/commons/panel';
import SysStore from '../../../stores/system/SysStore'

class QwjsqxService extends BaseService implements IEpsService, ITableService {
    loadAsyncDataByKey(key: any): Promise<any> {
        return new Promise<any>(resolve => {
            return resolve([])
        });
    }

    findByKey(key: string | number ,page: number = 1, size: number = 10, args: object = {}): Promise<any> {

        args['page'] = page;
        args['limit'] = size;
        args['pageIndex'] = page;
        args['pageSize'] = size;
        args['sortField'] = "";
        args['sortOrder'] = "";
        args['jslx']="2";
        if(args['lx']=="" || args['lx']==null){
            args['lx']="" || "1";
        }
      args['dwid'] =  args['treeData']  || args["searchdwid"] ;
        args['roleid']= key;

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


    findSelectByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
        args['sortField'] = "";
        args['sortOrder'] = "";
        args['dwid'] = key ;

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
                return super.post({ url: this.url + '/queryTree', params }).then(res => {
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

        if( !data['lx'] ){
            data['lx']='1'
        }
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

export default new QwjsqxService('/api/eps/control/main/qwjsqx');
