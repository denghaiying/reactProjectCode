import BaseService from '@/eps/commons/v2/BaseService';
import IEpsStore from '@/eps/commons/IEpsStore';
import SysStore from "@/stores/system/SysStore";
import {ITableService, ITreeService} from "@/eps/commons/panel";

class WdscService extends BaseService implements IEpsStore,ITreeService,ITableService {

    page(): Function {
        throw new Error('Method not implemented.');
    }

    findByKey(key: string | number, page: number = 1, size: number = 20, args: object = {}): Promise<any> {
        console.log('argsmk1',args);

        args['code']= "";
        args['name']= "";

    //    args['dwid'] = key || SysStore.getCurrentCmp().id;
        args['page'] = page;
        args['limit'] = size;
        args['pageIndex']= page;
        args['pageSize']= size;
        args['sortField']= "";
        args['sortOrder']= "";
        args['yhid']=SysStore.getCurrentUser().id;

      //  args['search']= key;

        console.log('argsmk',args);
        return new Promise((resolve, reject) => {
                return super.get({url: this.url + '/queryForWdscPage' ,params: args}).then(res => {
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

    saveByKey(key, data){

        return super.save(data);
    }

    updateForTable(data) {
        return super.update(data)
    }


    queryDak (id) {

        return new Promise((resolve, reject) => {

            return super.post({ url: '/api/eps/control/main/dak/queryForId?id='+id }).then(res => {
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

    deleteForTable(data){

     return new Promise((resolve, reject) => {
        if (!data || data.length<=0) {
            return reject('请选择待删除数据')
        }
        data['whr'] = SysStore.getCurrentUser().yhmc;
        data['whrid'] = SysStore.getCurrentUser().id;
     //   for (let i = 0; i < data.length; i++) {
            return super.post({
                url: `${this.url}/deleteWdsc?bmc=WDSC&ids=${data.id}`
            }).then(res => {
                if (res.data && res.data.success) {
                return resolve(res.data);
                }
                return reject(res.data.message)
            }).catch(err => {
                return reject(err);
            })
   //     }

        })
    }

    currentPage: Number;
    list: Array<any>;
    pageSize: Number;
    params: JSON;
    tableLoading: Boolean;

    findTree(key: string): Promise<any> {


        return new Promise((resolve, reject) => {
                return super.get({ url: this.url + '/queryForList' }).then(res => {
                    if (res.status > 300) {
                        return reject(res)
                    }
                    let data = res.data.map(item => { return { id: item.mkbh, title: item.mc, key: item.mkbh } })
                    return resolve(data)
                }).catch(err => {
                    return reject(err)
                })
            }
        )
    }

    loadAsyncDataByKey(key): Promise<any> {
        return Promise.resolve(undefined);
    }


}

export default new WdscService('/api/eps/control/main/daly');
