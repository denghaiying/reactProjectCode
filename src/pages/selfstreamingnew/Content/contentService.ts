import BaseService from '@/eps/commons/v3/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITableService } from '@/eps/commons/panel';
import SysStore from '@/stores/system/SysStore';


class ContentService extends BaseService implements IEpsService, ITableService {

  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
    debugger;
    args['contentchannelid'] = key ;
    args['channeltypelx'] = args['treeData'];
    return super.findForPage(this.url+"/findForPage",args,page,size);
  }


  saveByKey(key, data) {
    return new Promise((resolve, reject) => {
      if (!data) {
        return reject('请检查待保存数据，不能为空')
      }
      data['contentwhr'] = SysStore.getCurrentUser().yhmc;
      data['contentwhrid'] = SysStore.getCurrentUser().id;
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

  findTree(key: string = '') {
    let params = { 'kshflmc': key }
    return new Promise((resolve, reject) => {
        return super.post({ url: this.url + `/findList`,data: params }).then(res => {
          if (res.status > 300) {
            return reject(res)
          }
          let data = res.data.map(item => { return { id: item.id, title: item.kshflmc, key: item.id } })
          console.log("res.data", res.data);
          return resolve(data)
        }).catch(err => {
          return reject(err)
        })
      }
    )
  }
}

export default new ContentService('/api/streamingapi/content');
