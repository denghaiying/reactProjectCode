import BaseService from '@/eps/commons/v2/BaseService';

import {ITableService, ITreeService} from "@/eps/commons/panel";
import fetch from '@/utils/fetch';
import IEpsService from "@/eps/commons/IEpsService";


class FjService extends BaseService implements IEpsService, ITableService{

  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
    // if(!args.grpid){
    //   console.log("上传数据",args);
    //   return Promise.reject('');
    // }
    // if(args.wrkTbl===undefined){
    //   console.log("上传数据",args);
    //   return Promise.reject('');
    //
    // }
    args['page'] = page;
    args['limit'] = size;
    args['pageIndex']= page;
    args['pageSize']= size;
    args['sortField']= "";
    args['sortOrder']= "";
    return new Promise((resolve, reject) => {
        return super.get({url: this.url + '/queryForPage' ,params: args}). then(response => {
          if (response.status === 200) {
            response.data?.results?.map(o => (o.key=o.fileid,o.id=o.fileid));
            return resolve(response.data);
          } else {
            return reject(response.data.message)
          }
        }).catch(err => {
          return reject(err)
        })
      }
    )
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
          //   if (response.status === 200) {
          if (response.data && response.data.success) {
            return resolve(true);
          } else {
            return reject(response.data.message)
          }
        }).catch(err => {
          return reject(err);
        });
      }
    )

  }
}


export default new FjService('/api/eps/wdgl/attachdoc');
