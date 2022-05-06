import BaseService from '@/eps/commons/v3/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITableService } from '@/eps/commons/panel';
import SysStore from '@/stores/system/SysStore';


class JcjgzService extends BaseService implements IEpsService, ITableService {

  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
    args["jgly"]=key;
    return super.findForPage(this.url+"/findForPage",args,page,size);
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

 findTree (key) {
    let params = { 'name': key }
     const ztData = [{id: "接口", title: "接口",key:"接口"}, {id: "收集", title: "收集", key:"收集" },{id: "整理", title: "整理", key:"整理" }
     ,{id: "移交", title: "移交", key:"移交" },{id: "归档", title: "归档", key:"归档" },{id: "档案管理", title: "档案管理", key:"档案管理" }
     ,{id: "长期保存", title: "长期保存", key:"长期保存" },{id: "EEP包", title: "EEP包", key:"EEP包" },{id: "ASIP", title: "ASIP", key:"ASIP" }];
    return ztData
  }
}

export default new JcjgzService('/api/api/sxjcjgz');
