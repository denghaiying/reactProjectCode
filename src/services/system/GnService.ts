import BaseService from '@/eps/commons/v2/BaseService';
import IEpsStore from '@/eps/commons/IEpsStore';
import {ITableService} from "@/eps/commons/panel";
import SysStore from "@/stores/system/SysStore";

class GnService extends BaseService implements IEpsStore,ITableService {

    page(): Function {
        throw new Error('Method not implemented.');
    }


    findAll(params: any){
        return new Promise((resolve, reject) => {
                return super.get({url: this.url + '/queryForList' ,params}).then(res => {
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

    list: any[];
    currentPage: number;
    pageSize: number;
    params: JSON;
    tableLoading: Boolean;

    deleteForTable(data: object): Promise<any> {
        return Promise.resolve(undefined);
    }

    findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
        console.log('argsgn1',args);
        args['mkbh'] = key

        args['pageIndex'] = page;
        args['pageSize'] = size;
        args['page'] = page;
        args['limit'] = size;
        args['sortOrder'] = "";
        args['sortField'] = "";

        console.log('argsgn',args);
        return new Promise((resolve, reject) => {
                return super.get({ url: this.url + '/queryForPage', params: args }).then(res => {

                    console.log("00000000", res)
                    if (res.status > 300) {

                        return reject(res)
                    }
                    return resolve(res.data || res.results)
                }).catch(err => {
                    return reject(err)
                })
            }
        )
    }


    saveByKey(key: any, data: object): Promise<any> {
        return Promise.resolve(undefined);
    }

    updateForTable(data: object): Promise<any> {
        return Promise.resolve(undefined);
    }

}

export default new GnService('/api/eps/control/main/gn/');
