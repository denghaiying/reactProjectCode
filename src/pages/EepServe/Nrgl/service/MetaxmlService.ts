import BaseService from '@/eps/commons/BaseService';
import { ITableService } from '@/eps/commons/panel';

class MetaxmlService extends BaseService implements ITableService {

  //分页查询
  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
    const params = { params: args,page:page+1,size };
    return new Promise((resolve, reject) => {
      return super.findAll(params).then(res => {
        //数据渲染
        debugger
        return resolve(res.data);
      }).catch(err => {
        return reject(err);
      })
    });
  }

  // 新增数据
  saveByKey(key, data) {
    return super.save(data);
  };

  // 修改数据
  updateForTable(data) {
    return super.update(data)
  };

  // 删除数据
  deleteForTable(data){
    return super.del(data);
  };
}


export default new MetaxmlService('/api/eps/e9eep/metaxml');
