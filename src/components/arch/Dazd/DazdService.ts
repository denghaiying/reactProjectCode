import BaseService from '@/eps/commons/v2/BaseService';
import IEpsStore from '@/eps/commons/IEpsStore';
import SysStore from "@/stores/system/SysStore";
import {ITableService, ITreeService} from "@/eps/commons/panel";

class DazdService extends BaseService implements IEpsStore,ITreeService,ITableService {

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
        
      //  args['search']= key;

        console.log('argsmk',args);
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

    deleteForTable(data){
        console.log('delete', `${this.url}/delete?id=${data.id}`)
        return new Promise((resolve, reject) => {
          if (!data || !(data.id)) {
            return reject('请正确输入待删除数据')
          }
          data['whr'] = SysStore.getCurrentUser().yhmc;
          data['whrid'] = SysStore.getCurrentUser().id;
          return super.post({
            url: `${this.url}/deletetemp?id=${data.id}`
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

export default new DazdService('/api/eps/control/main/dazdtemp');
