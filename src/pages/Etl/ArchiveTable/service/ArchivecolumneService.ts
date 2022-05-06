import BaseService from '@/eps/commons/v3/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITableService } from '@/eps/commons/panel';
import SysStore from '@/stores/system/SysStore';


class ArchivecolumneService extends BaseService implements IEpsService, ITableService {

  findByKey(key: string , page: number = 1, size: number = 10, args: object = {}): Promise<any> {
    if(key !==""){
        var att=key.split(",");
        key=att[0];
    }
     args['pid'] = key || SysStore.getCurrentCmp().id
    return super.findForPage(this.url,args,page,size);
  }


  saveByKey(key, data) {
      return new Promise((resolve, reject) => {
      if (!data) {
        return reject('请检查待保存数据，不能为空')
      }
      data['whr'] = SysStore.getCurrentUser().yhmc;
      data['whrid'] = SysStore.getCurrentUser().id;
      return super.post({ url: this.url, data: data}).then(res => {

       if (res.status === 201) {
          return resolve(res.data);
        }
        return reject(res.data.message)
      }).catch(err => {
        return reject(err);
      })
    })
  }

  updateForTable(data) {

    return super.update(data)
  }

  deleteForTable(data) {

    return super.delete(data);
  }
}

export default new ArchivecolumneService('/api/api/archivecolumn');
