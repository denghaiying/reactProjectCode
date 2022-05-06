import BaseService from '@/eps/commons/BaseService';
import { ITableService } from '@/eps/commons/panel';

class KqszService extends BaseService implements ITableService {

  //分页查询
  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
    const params = { params: args, page: page + 1, size };
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
    data['brest'] = data.brest ? 'Y' : 'N';
    if (data.projectName === undefined) {
      data['projectName'] = '';
    };
    data['workdate'] = data.workdate ? (data.workdate).toString() : '';
    data['stime'] = data.stime ? (data.stime).format('HH:mm:ss') : '';
    data['etime'] = data.etime ? (data.etime).format('HH:mm:ss') : '';
    data['rstime'] = data.rstime ? (data.rstime).format('HH:mm:ss') : '';
    data['retime'] = data.retime ? (data.retime).format('HH:mm:ss') : '';
    return super.save(data)
  };

  // 修改数据
  updateForTable(data) {
    data['brest'] = data.brest ? 'Y' : 'N';
    data['workdate'] = data.workdate ? (data.workdate).toString() : '';
    data['stime'] = data.stime ? (data.stime).format('HH:mm:ss') : '';
    data['etime'] = data.etime ? (data.etime).format('HH:mm:ss') : '';
    data['rstime'] = data.rstime ? (data.rstime).format('HH:mm:ss') : '';
    data['retime'] = data.retime ? (data.retime).format('HH:mm:ss') : '';
    return super.update(data)
  };

  // 删除数据
  deleteForTable(data: object): Promise<any> {
    return super.del(data);
  };
}


export default new KqszService('/api/eps/dps/ptrule');
