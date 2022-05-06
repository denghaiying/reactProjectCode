import BaseService from '@/eps/commons/v2/BaseService';
import IEpsStore from '@/eps/commons/IEpsStore';
import SysStore from "@/stores/system/SysStore";
import {ITableService, ITreeService} from "@/eps/commons/panel";
import HttpRequest from "@/eps/commons/HttpRequest";

class FzpsZjAddService extends BaseService implements IEpsStore,ITreeService,ITableService {

  page(): Function {
    throw new Error('Method not implemented.');
  }

  findByKey(key: string | number, page: number = 1, size: number = 20, args: object = {}): Promise<any> {
    console.log('argsmk1',args);

    //  args['code']= "";
    //  args['fzpsid']= "";

    //    args['dwid'] = key || SysStore.getCurrentCmp().id;
    args['page'] = page;
    args['limit'] = size;
    args['pageIndex']= page;
    args['pageSize']= size;
    args['sortField']= "";
    args['sortOrder']= "";
    args['rolecode']="ZJJS";
  //  args['fzpsid']=key;

    debugger

    console.log('argsmk',args);
    return new Promise((resolve, reject) => {
        return super.get({url: this.url + '/queryByRole' ,params: args}).then(res => {
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
    debugger
    return super.save(data);
    // return new Promise((resolve, reject) => {
    //   if (!data) {
    //     return reject('请检查待保存数据，不能为空');
    //   }
    //   debugger
    //   data['whr'] = SysStore.getCurrentUser().yhmc;
    //   data['whrid'] = SysStore.getCurrentUser().id;
    //   return HttpRequest
    //     .get({ url: this.url + '/add', params: data })
    //     .then((res) => {
    //       if (res.data && res.data.success) {
    //         return resolve(res.data);
    //       }
    //       return reject(res.data.message);
    //     })
    //     .catch((err) => {
    //       return reject(err);
    //     });
    // });
  }

  updateForTable(data) {
    return super.update(data)
  }

  deleteForTable(data){
    return super.del(data);
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

export default new FzpsZjAddService('/api/eps/control/main/fzspzj');
