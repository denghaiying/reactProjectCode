import BaseService from '@/eps/commons/BaseService';
import SysStore from '@/stores/system/SysStore';
import { ITableService } from '@/eps/commons/panel';

class CdyclService extends BaseService implements ITableService {
  //分页查询
  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
    const params = { params: args, page: page + 1, size };
    return new Promise((resolve, reject) => {
      return this.findAll(params).then(res => {
        //数据渲染
        return resolve(res.data);
      }).catch(err => {
        return reject(err);
      })
    });
  }
  findAll(params) {
    debugger
    return super.get({
      url: `${this.url}/ycl/${SysStore.getCurrentCmp().id}`,
      params: params
    })
  }
  // 新增数据
  saveByKey(key, data) {
    debugger
    return super.save(data);
  };

  // 修改数据
  updateForTable(data) {
    return super.update(data);
  };

  // 删除数据
  deleteForTable(data: object): Promise<any> {
    return super.del(data);
  };
  // 批量删除
  batchDelete(data: Array<any>): Promise<any>{
    return super.deleteData(data);
  }
}


export default new CdyclService('/api/eps/e9msdaly/lasqd');
