import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITreeService, ITableService } from '@/eps/commons/panel';


class ZtclService extends  BaseService implements IEpsService, ITableService {
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

  saveFzZlx(dakid: String, args: String, whr: String, whrid: String) {
    var data={};
    var aa = encodeURIComponent(JSON.stringify(args));
    data['dakid'] = dakid;
    data['arrs'] = aa;
    data['whr'] = SysStore.getCurrentUser().yhmc;
    data['whrid'] = SysStore.getCurrentUser().id;
    return new Promise((resolve, reject) => {
      return super.post({ url: this.url + `/saveFzZlx`,params: data}).then(res => {
        if (res.data && res.data.success) {
          return resolve(res.data);
        }
        return reject(res.data.message)
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

export default new ZtclService('/api/eps/control/main/lcfz');
