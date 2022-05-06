import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITreeService, ITableService } from '@/eps/commons/panel';
import SysStore from "@/stores/system/SysStore";


class ZtclService extends BaseService implements IEpsService, ITreeService, ITableService {
  loadAsyncDataByKey(key: any): Promise<any> {
    return new Promise<any>(resolve => {
      return resolve([])
    });
  }

  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
    args['page'] = page;
    args['limit'] = size;
    args['pageIndex'] = page;
    args['pageSize'] = size;
    args['sortField'] = "";
    args['sortOrder'] = "";
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

  saveFzZlx(ztid: String,dakid: String, args: String, whr: String, whrid: String) {
    var data={};
    var aa = encodeURIComponent(JSON.stringify(args));
    data['dakid'] = dakid;
    data['ztid'] = ztid;
    data['whr'] = whr;
    data['whrid'] = whrid;

    return new Promise((resolve, reject) => {
      return super.post({ url: this.url + `/saveFzZlx?arrs=${aa}`,data: data}).then(res => {
       if (res.status > 300) {
          return reject(res)
        }
        return resolve(res.data)
      }).catch(err => {
        return reject(err)
      })
    })

  }


  updateZtclsyxy(ztid: String,dakid: String, args: String, whr: String, whrid: String) {
    var data={};
    var aa = encodeURIComponent(JSON.stringify(args));
    data['dakid'] = dakid;
    data['ztid'] = ztid;
    data['whr'] = whr;
    data['whrid'] = whrid;

    return new Promise((resolve, reject) => {
      return super.post({ url: this.url + `/updateZtclsyxy?arrs=${aa}`,data: data}).then(res => {
       if (res.status > 300) {
          return reject(res)
        }
        return resolve(res.data)
      }).catch(err => {
        return reject(err)
      })
    })

  }

  queryztclList(ztid: String,dakid: String) {
    var data={};
    data['dakid'] = dakid;
    data['ztid'] = ztid;
    return new Promise((resolve, reject) => {
      return super.post({ url: this.url + `/findForKey`,data: data}).then(res => {
        debugger
        if (res.status === 200) {
          return resolve(res);
        } else {
          return reject(res.data.message);
        }
      }).catch(err => {
        return reject(err)
      })
    })

  }


  saveByKey(key, data) {
    return super.save(data)
  }



  updateForTable(data) {
    return super.update(data)
  }

  deleteForTable(data) {

    return super.del(data);
  }


  page(): Function {
    throw new Error('Method not implemented.');
  }
}

export default new ZtclService('/api/eps/lg/cqbcztcl');
