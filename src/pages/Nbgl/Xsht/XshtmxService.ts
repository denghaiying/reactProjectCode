import BaseService from '@/eps/commons/BaseService';
import { ITableService } from '@/eps/commons/panel';

class XshtmxService extends BaseService implements ITableService {
  //分页查询
  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
    //主表与明细表的关联字段xshtid
    args['xshtid'] = args['id'];
    delete args['id'];
    const params = { params: args };
    return new Promise((resolve, reject) => {
      return super.findAll(params).then(res => {
        return resolve(res.data);
      }).catch(err => {
        return reject(err);
      })
    });
  }

  //新增数据
  saveByKey(key, data) {
    return super.save(data);
  }

  //修改数据
  updateForTable(data) {
    return super.update(data);
  }
  // 删除数据
  deleteForTable(data: object): Promise<any> {
    return super.del(data);
  };
}

export default new XshtmxService('/api/eps/nbgl/xshtmx');