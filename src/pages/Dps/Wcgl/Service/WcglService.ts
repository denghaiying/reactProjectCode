import BaseService from '@/eps/commons/BaseService';
import { ITableService } from '@/eps/commons/panel';

class WcglService extends BaseService implements ITableService {

  //分页查询
  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
    const params = { params: args,page:page+1,size };
    return new Promise((resolve, reject) => {
      return super.findAll(params).then(res => {
        //数据渲染
        return resolve(res.data);
      }).catch(err => {
        return reject(err);
      })
    });
  }

  // 新增数据
  saveByKey(key, data) {
    data['id'] = `${Math.random()}`
    data['pstime'] = data.pstime ? (data.pstime).format('YYYY-MM-DD HH:mm:ss') : '';
    data['petime'] = data.petime ? (data.petime).format('YYYY-MM-DD HH:mm:ss') : '';
    data['astime'] = data.astime ? (data.astime).format('YYYY-MM-DD HH:mm:ss') : '';
    data['aetime'] = data.aetime ? (data.aetime).format('YYYY-MM-DD HH:mm:ss') : '';
    return super.save(data);
  };

  // 修改数据
  updateForTable(data) {
    data['pstime'] = data.pstime ? (data.pstime).format('YYYY-MM-DD HH:mm:ss') : '';
    data['petime'] = data.petime ? (data.petime).format('YYYY-MM-DD HH:mm:ss') : '';
    data['astime'] = data.astime ? (data.astime).format('YYYY-MM-DD HH:mm:ss') : '';
    data['aetime'] = data.aetime ? (data.aetime).format('YYYY-MM-DD HH:mm:ss') : '';
    return super.update(data)
  };

  // 删除数据
  deleteForTable(data: object): Promise<any> {
    return super.del(data);
  };
}


export default new WcglService('/api/eps/dps/outmgn');
