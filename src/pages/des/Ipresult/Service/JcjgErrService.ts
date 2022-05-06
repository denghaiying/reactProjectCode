import BaseService from '@/eps/commons/BaseService';
import { ITableService } from '@/eps/commons/panel';

class IpresultService extends BaseService implements ITableService {

  //分页查询
  findByKey(key: string | number, page: number = 1, size: number = 10, mxeditRecord: object = {}): Promise<any> {
    const params = { params: {}, page: page + 1, size };
    return new Promise((resolve, reject) => {
      return super.get({
        url: `${this.url}/${mxeditRecord["sqid"]}/${mxeditRecord["id"]}/jcjgerr`, 
        params: params
      }).then(res => {
        //数据渲染
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
  deleteForTable(data: object): Promise<any> {
    return super.del(data);
  };
  

}


export default new IpresultService('/api/eps/des/jcjgerr');
