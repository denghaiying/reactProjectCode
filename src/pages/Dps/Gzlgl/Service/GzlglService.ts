import BaseService from '@/eps/commons/BaseService';
import { ITableService } from '@/eps/commons/panel';


class GzlglService extends BaseService implements ITableService {

  // 分页查询
  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
    const params = { params: args,page:page+1,size };
    return new Promise((resolve, reject) => {
      return super.findAll(params).then(res => {
        // 数据渲染
        return resolve(res.data);
      }).catch(err => {
        return reject(err);
      })
    });
  }

  // 新增数据
  saveByKey(key, data) {
    debugger
    data['id'] = `${Math.random()}`
    data['date'] = data.date ?  (data.date).format('YYYY-MM-DD HH:mm:ss') : '';
    data['stime'] = data.stime ? (data.stime).format('YYYY-MM-DD HH:mm:ss') : '';
    data['etime'] = data.etime ? (data.etime).format('YYYY-MM-DD HH:mm:ss') : '';
    data['whsj'] = data.whsj ? (data.whsj).format('YYYY-MM-DD HH:mm:ss') : '';
    data['source'] = '02';
    return super.save(data);
  };

  // 修改数据
  updateForTable(data) {
    
    data['date'] = data.date ?  (data.date).format('YYYY-MM-DD HH:mm:ss') : '';
    data['stime'] = data.stime ? (data.stime).format('YYYY-MM-DD HH:mm:ss') : '';
    data['etime'] = data.etime ? (data.etime).format('YYYY-MM-DD HH:mm:ss') : '';
    data['whsj'] = data.whsj ? (data.whsj).format('YYYY-MM-DD HH:mm:ss') : '';
    return super.update(data)
  };

  // 删除数据
  deleteForTable(data: object): Promise<any> {
    return super.del(data);
  };
 }


export default new GzlglService('/api/eps/dps/workload');
