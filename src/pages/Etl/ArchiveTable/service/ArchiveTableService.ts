import BaseService from '@/eps/commons/v3/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITableService } from '@/eps/commons/panel';
import SysStore from '@/stores/system/SysStore';


class ArchiveTableService extends BaseService implements IEpsService, ITableService {

  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
    return super.findForPage(this.url,args,page,size);
  }

  findTree(key: string = '') {
      const params = { 'archiveinfoName': key }
      return new Promise((resolve, reject) => {
        return super.post({ url: this.url+"/findForKey" , data:params}).then(res => {
          if (res.status > 300) {
            return reject(res)
          }
          const data = res.data.map(item => { return { id: item.id, title: item.archiveinfoCode+"|"+item.archiveinfoName, key: item.id+","+item.archiveinfoCode+","+item.archiveinfoType} })
          return resolve(data)
        }).catch(err => {
          return reject(err)
        })
      }
      )
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

export default new ArchiveTableService('/api/api/archiveinfo');