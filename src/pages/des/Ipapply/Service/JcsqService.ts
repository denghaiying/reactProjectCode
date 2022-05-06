import BaseService from '@/eps/commons/BaseService';
import { ITableService } from '@/eps/commons/panel';
import moment from 'moment';
class JcsqService extends BaseService implements ITableService {
  //分页查询
  findByKey(
    key: string | number,
    page: number = 1,
    size: number = 10,
    args: object = {},
  ): Promise<any> {
    const params = { params: args, page: page + 1, size };
    return new Promise((resolve, reject) => {
      return super
        .findAll(params)
        .then((res) => {
          //数据渲染
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // 新增数据
  saveByKey(key, data) {
    return super.save(data);
  }

  // 修改数据
  updateForTable(data) {
    debugger
    data.ljjc = data.ljjc?'Y':'N';
    data.sjly==='w'?data.dakid = '':data.ywdir='';
    data.sqrq = moment(data.sqrq).format('yyyy-MM-DD');
    data.jcrq = moment(data.jcrq).format('yyyy-MM-DD');
    return super.update(data);
  }

  // 删除数据
  deleteForTable(data: object): Promise<any> {
    return super.del(data);
  }
}

export default new JcsqService('/api/eps/des/jcsq');
