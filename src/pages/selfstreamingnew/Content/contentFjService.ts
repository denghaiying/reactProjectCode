import BaseService from '@/eps/commons/v2/BaseService';
import IEpsStore from '@/eps/commons/IEpsStore';
import SysStore from "@/stores/system/SysStore";
import {ITableService, ITreeService} from "@/eps/commons/panel";
import fetch from '@/utils/fetch';


class contentFjService extends BaseService implements IEpsStore,ITreeService,ITableService{

  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
debugger
    // if(!args.grpid){
    //   console.log("上传数据",args);
    //   return Promise.reject('');
    // }
    // debugger
    // if(args.wrkTbl===undefined){
    //   console.log("上传数据",args);
    //   return Promise.reject('');

    // }
debugger
    args['page'] = page;
    args['limit'] = size;
    args['pageIndex']= page;
    args['pageSize']= size;
    args['sortField']= "";
    args['sortOrder']= "";
debugger
    return new Promise((resolve, reject) => {
      // if(args['grpid']){
      //   return resolve(null);
      // }
        return super.get({url: this.url + '/queryForPagegrpid' ,params: args}). then(response => {
          if (response.status === 200) {
            response.data?.results?.map(o => (o.key=o.fileid,o.id=o.fileid));
            console.log("response.data",response.data);
            return resolve(response.data);
          } else {
            return reject(response.data.message)
          }
        }).catch(err => {
          return reject(err)
        })
      }
    ).catch(err => {

    })
  }


  saveByKey(key, data) {
    return super.save(data)
  }

  updateForTable(data) {

    return super.update(data)
  }

  deleteForTable(data) {
    const fd = new FormData();
    fd.append('grpid', data.grpid);
    fd.append('fileid', data.fileid);
    fd.append('daktmid', data.tmid);
    fd.append('doctbl', data.doctbl);
    fd.append('grptbl', data.grptbl);
    fd.append('wktbl', data.wktbl);
    return new Promise((resolve, reject) => {
        return fetch.post(`${this.url}/delete`, fd, { headers: { 'Content-type': 'application/x-www-form-urlencoded' } }).then(response => {
          // if (response.status === 200) {
          //   return resolve(true);
          console.log('deleteres==',response);
          //  if (response.data && response.data.success) {
          if (response.data && response.data.success) {
            return resolve(true);
          }else{
            return reject(response.data.message);
          }

        }).catch(err => {
          return reject(err);
        });
      }
    )

  }
}

export default new contentFjService('/api/eps/wdgl/attachdoc');
